import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/packages - Get all packages
export async function GET() {
  try {
    const packages = await prisma.package.findMany({
      orderBy: {
        package_id: 'asc',
      },
    });

    return NextResponse.json({
      success: true,
      data: packages,
      count: packages.length,
    });
  } catch (error) {
    console.error('Error fetching packages:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch packages',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// POST /api/packages - Create a new package
export async function POST(request) {
  try {
    const body = await request.json();
    const { package_title, package_description, package_price } = body;

    // Validate required fields
    if (!package_title || !package_description || package_price === undefined) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields',
          required: ['package_title', 'package_description', 'package_price'],
        },
        { status: 400 }
      );
    }

    // Validate price is a positive number
    if (typeof package_price !== 'number' || package_price < 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package price must be a positive number',
        },
        { status: 400 }
      );
    }

    const newPackage = await prisma.package.create({
      data: {
        package_title,
        package_description,
        package_price,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: 'Package created successfully',
        data: newPackage,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating package:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to create package',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
