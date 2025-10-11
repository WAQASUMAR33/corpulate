import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/adones/search - Advanced search for add-ons
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Search parameters
    const query = searchParams.get('q') || '';
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || Infinity;
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const limit = parseInt(searchParams.get('limit')) || 20;
    const offset = parseInt(searchParams.get('offset')) || 0;
    const category = searchParams.get('category') || '';
    const hasRequests = searchParams.get('hasRequests');

    // Build search conditions
    const whereConditions = [];

    // Text search
    if (query) {
      whereConditions.push({
        OR: [
          { ad_title: { contains: query } },
          { ad_description: { contains: query } },
          { ad_information: { contains: query } },
        ],
      });
    }

    // Price range filter
    if (minPrice > 0 || maxPrice < Infinity) {
      whereConditions.push({
        ad_price: {
          gte: minPrice,
          lte: maxPrice === Infinity ? undefined : maxPrice,
        },
      });
    }

    // Category filter (based on title keywords)
    if (category) {
      whereConditions.push({
        OR: [
          { ad_title: { contains: category } },
          { ad_description: { contains: category } },
        ],
      });
    }

    // Requests filter
    if (hasRequests !== null) {
      const hasRequestsBool = hasRequests === 'true';
      if (hasRequestsBool) {
        whereConditions.push({
          Request: {
            some: {},
          },
        });
      } else {
        whereConditions.push({
          Request: {
            none: {},
          },
        });
      }
    }

    // Combine all conditions
    const where = whereConditions.length > 0 ? { AND: whereConditions } : {};

    // Get total count for pagination
    const total = await prisma.adOne.count({ where });

    // Build order by clause
    let orderBy = {};
    if (sortBy === 'usage') {
      orderBy = {
        Request: {
          _count: sortOrder,
        },
      };
    } else if (sortBy === 'price') {
      orderBy = {
        ad_price: sortOrder,
      };
    } else {
      orderBy = {
        [sortBy]: sortOrder,
      };
    }

    // Execute search
    const results = await prisma.adOne.findMany({
      where,
      skip: offset,
      take: limit,
      orderBy,
      include: {
        _count: {
          select: {
            Request: true,
          },
        },
      },
    });

    // Get search suggestions
    const suggestions = await prisma.adOne.findMany({
      select: {
        ad_title: true,
      },
      distinct: ['ad_title'],
      take: 10,
    });

    // Get price range for filters
    const priceRange = await prisma.adOne.aggregate({
      _min: {
        ad_price: true,
      },
      _max: {
        ad_price: true,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        results,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total,
        },
        filters: {
          priceRange: {
            min: priceRange._min.ad_price || 0,
            max: priceRange._max.ad_price || 0,
          },
          suggestions: suggestions.map(s => s.ad_title),
        },
        searchParams: {
          query,
          minPrice,
          maxPrice,
          sortBy,
          sortOrder,
          category,
          hasRequests,
        },
      },
    });
  } catch (error) {
    console.error('Error searching add-ons:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to search add-ons',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
