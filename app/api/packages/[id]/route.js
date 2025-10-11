import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/packages/[id] - Get a specific package
export async function GET(request, { params }) {
  try {
    const packageId = parseInt(params.id);

    if (isNaN(packageId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid package ID',
        },
        { status: 400 }
      );
    }

    const packageData = await prisma.package.findUnique({
      where: {
        package_id: packageId,
      },
      include: {
        Request: {
          select: {
            id: true,
            status: true,
            createdAt: true,
            User: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
      },
    });

    if (!packageData) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: packageData,
    });
  } catch (error) {
    console.error('Error fetching package:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch package',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/packages/[id] - Update a package
export async function PUT(request, { params }) {
  try {
    const packageId = parseInt(params.id);

    if (isNaN(packageId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid package ID',
        },
        { status: 400 }
      );
    }

    const body = await request.json();
    const { package_title, package_description, package_price } = body;

    // Check if package exists
    const existingPackage = await prisma.package.findUnique({
      where: {
        package_id: packageId,
      },
    });

    if (!existingPackage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package not found',
        },
        { status: 404 }
      );
    }

    // Validate price if provided
    if (package_price !== undefined && (typeof package_price !== 'number' || package_price < 0)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package price must be a positive number',
        },
        { status: 400 }
      );
    }

    const updatedPackage = await prisma.package.update({
      where: {
        package_id: packageId,
      },
      data: {
        ...(package_title && { package_title }),
        ...(package_description && { package_description }),
        ...(package_price !== undefined && { package_price }),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Package updated successfully',
      data: updatedPackage,
    });
  } catch (error) {
    console.error('Error updating package:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to update package',
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/packages/[id] - Delete a package
export async function DELETE(request, { params }) {
  try {
    const packageId = parseInt(params.id);

    if (isNaN(packageId)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid package ID',
        },
        { status: 400 }
      );
    }

    // Check if package exists
    const existingPackage = await prisma.package.findUnique({
      where: {
        package_id: packageId,
      },
      include: {
        Request: true,
      },
    });

    if (!existingPackage) {
      return NextResponse.json(
        {
          success: false,
          error: 'Package not found',
        },
        { status: 404 }
      );
    }

    // Check if package has associated requests
    if (existingPackage.Request.length > 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'Cannot delete package with associated requests',
          associatedRequests: existingPackage.Request.length,
        },
        { status: 400 }
      );
    }

    await prisma.package.delete({
      where: {
        package_id: packageId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Package deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting package:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to delete package',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
