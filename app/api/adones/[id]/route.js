import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/adones/[id] - Get specific add-on
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const adId = parseInt(id);

    if (isNaN(adId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid add-on ID',
        },
        { status: 400 }
      );
    }

    const adOne = await prisma.adOne.findUnique({
      where: {
        ad_id: adId,
      },
      include: {
        _count: {
          select: {
            Request: true,
          },
        },
        Request: {
          select: {
            id: true,
            name: true,
            company_name: true,
            status: true,
            createdAt: true,
          },
          take: 10, // Limit to recent requests
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!adOne) {
      return NextResponse.json(
        {
          success: false,
          message: 'Add-on not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: adOne,
    });
  } catch (error) {
    console.error('Error fetching add-on:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch add-on',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT /api/adones/[id] - Update add-on
export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const adId = parseInt(id);
    const body = await request.json();
    const { ad_title, ad_price, ad_description, ad_information } = body;

    if (isNaN(adId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid add-on ID',
        },
        { status: 400 }
      );
    }

    // Check if add-on exists
    const existingAdOne = await prisma.adOne.findUnique({
      where: {
        ad_id: adId,
      },
    });

    if (!existingAdOne) {
      return NextResponse.json(
        {
          success: false,
          message: 'Add-on not found',
        },
        { status: 404 }
      );
    }

    // Validation
    if (ad_price !== undefined && ad_price < 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'Price must be a positive number',
        },
        { status: 400 }
      );
    }

    // Check if title is being changed and if it conflicts with existing titles
    if (ad_title && ad_title !== existingAdOne.ad_title) {
      const titleConflict = await prisma.adOne.findFirst({
        where: {
          ad_title: {
            equals: ad_title,
          },
          ad_id: {
            not: adId,
          },
        },
      });

      if (titleConflict) {
        return NextResponse.json(
          {
            success: false,
            message: 'Add-on with this title already exists',
          },
          { status: 409 }
        );
      }
    }

    // Update add-on
    const updatedAdOne = await prisma.adOne.update({
      where: {
        ad_id: adId,
      },
      data: {
        ...(ad_title && { ad_title }),
        ...(ad_price !== undefined && { ad_price: parseFloat(ad_price) }),
        ...(ad_description && { ad_description }),
        ...(ad_information !== undefined && { ad_information }),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Add-on updated successfully',
      data: updatedAdOne,
    });
  } catch (error) {
    console.error('Error updating add-on:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update add-on',
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// DELETE /api/adones/[id] - Delete add-on
export async function DELETE(request, { params }) {
  try {
    const { id } = params;
    const adId = parseInt(id);

    if (isNaN(adId)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid add-on ID',
        },
        { status: 400 }
      );
    }

    // Check if add-on exists
    const existingAdOne = await prisma.adOne.findUnique({
      where: {
        ad_id: adId,
      },
      include: {
        _count: {
          select: {
            Request: true,
          },
        },
      },
    });

    if (!existingAdOne) {
      return NextResponse.json(
        {
          success: false,
          message: 'Add-on not found',
        },
        { status: 404 }
      );
    }

    // Check if add-on is being used by any requests
    if (existingAdOne._count.Request > 0) {
      return NextResponse.json(
        {
          success: false,
          message: `Cannot delete add-on. It is currently being used by ${existingAdOne._count.Request} request(s).`,
        },
        { status: 409 }
      );
    }

    // Delete add-on
    await prisma.adOne.delete({
      where: {
        ad_id: adId,
      },
    });

    return NextResponse.json({
      success: true,
      message: 'Add-on deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting add-on:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to delete add-on',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
