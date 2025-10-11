import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/adones - Get all add-ons
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const search = searchParams.get('search') || '';
    const sortBy = searchParams.get('sortBy') || 'createdAt';
    const sortOrder = searchParams.get('sortOrder') || 'desc';
    const minPrice = parseFloat(searchParams.get('minPrice')) || 0;
    const maxPrice = parseFloat(searchParams.get('maxPrice')) || Infinity;

    const skip = (page - 1) * limit;

    // Build where clause
    const where = {
      AND: [
        {
          OR: [
            { ad_title: { contains: search } },
            { ad_description: { contains: search } },
            { ad_information: { contains: search } },
          ],
        },
        {
          ad_price: {
            gte: minPrice,
            lte: maxPrice === Infinity ? undefined : maxPrice,
          },
        },
      ],
    };

    // Get total count
    const total = await prisma.adOne.count({ where });

    // Get add-ons with pagination
    const adOnes = await prisma.adOne.findMany({
      where,
      skip,
      take: limit,
      orderBy: {
        [sortBy]: sortOrder,
      },
      include: {
        _count: {
          select: {
            Request: true,
          },
        },
      },
    });

    return NextResponse.json({
      success: true,
      data: adOnes,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
        hasNext: page < Math.ceil(total / limit),
        hasPrev: page > 1,
      },
    });
  } catch (error) {
    console.error('Error fetching add-ons:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch add-ons',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/adones - Create new add-on
export async function POST(request) {
  try {
    const body = await request.json();
    const { ad_title, ad_price, ad_description, ad_information } = body;

    // Validation
    if (!ad_title || !ad_price || !ad_description) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: ad_title, ad_price, ad_description',
        },
        { status: 400 }
      );
    }

    if (ad_price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Price must be a positive number',
        },
        { status: 400 }
      );
    }

    // Check if add-on with same title already exists
    const existingAdOne = await prisma.adOne.findFirst({
      where: {
        ad_title: {
          equals: ad_title,
        },
      },
    });

    if (existingAdOne) {
      return NextResponse.json(
        {
          success: false,
          message: 'Add-on with this title already exists',
        },
        { status: 409 }
      );
    }

    // Create new add-on
    const newAdOne = await prisma.adOne.create({
      data: {
        ad_title,
        ad_price: parseFloat(ad_price),
        ad_description,
        ad_information: ad_information || '',
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Add-on created successfully',
        data: newAdOne,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating add-on:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create add-on',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
