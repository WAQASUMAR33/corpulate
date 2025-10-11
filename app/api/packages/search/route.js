import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/packages/search - Search packages
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q') || '';
    const minPrice = searchParams.get('min_price');
    const maxPrice = searchParams.get('max_price');
    const limit = parseInt(searchParams.get('limit')) || 10;
    const offset = parseInt(searchParams.get('offset')) || 0;

    // Build where clause
    const where = {};

    // Text search
    if (query) {
      where.OR = [
        {
          package_title: {
            contains: query,
            mode: 'insensitive',
          },
        },
        {
          package_description: {
            contains: query,
            mode: 'insensitive',
          },
        },
      ];
    }

    // Price range filter
    if (minPrice || maxPrice) {
      where.package_price = {};
      if (minPrice) {
        where.package_price.gte = parseFloat(minPrice);
      }
      if (maxPrice) {
        where.package_price.lte = parseFloat(maxPrice);
      }
    }

    const packages = await prisma.package.findMany({
      where,
      include: {
        Request: {
          select: {
            id: true,
            status: true,
          },
        },
      },
      orderBy: {
        package_id: 'asc',
      },
      take: limit,
      skip: offset,
    });

    // Get total count for pagination
    const totalCount = await prisma.package.count({ where });

    // Add request counts to each package
    const packagesWithCounts = packages.map(pkg => ({
      ...pkg,
      request_count: pkg.Request.length,
      pending_count: pkg.Request.filter(req => req.status === 'pending').length,
      completed_count: pkg.Request.filter(req => req.status === 'completed').length,
    }));

    return NextResponse.json({
      success: true,
      data: packagesWithCounts,
      pagination: {
        total: totalCount,
        limit,
        offset,
        has_more: offset + limit < totalCount,
      },
      search_params: {
        query,
        min_price: minPrice,
        max_price: maxPrice,
      },
    });
  } catch (error) {
    console.error('Error searching packages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to search packages',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
