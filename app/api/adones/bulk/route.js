import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/adones/bulk - Bulk operations for add-ons
export async function POST(request) {
  try {
    const body = await request.json();
    const { operation, ids, data } = body;

    if (!operation || !ids || !Array.isArray(ids)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Missing required fields: operation, ids',
        },
        { status: 400 }
      );
    }

    const adIds = ids.map(id => parseInt(id)).filter(id => !isNaN(id));

    if (adIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: 'No valid add-on IDs provided',
        },
        { status: 400 }
      );
    }

    let result;
    let message;

    switch (operation) {
      case 'delete':
        // Check if any add-ons are being used
        const usedAdOnes = await prisma.adOne.findMany({
          where: {
            ad_id: {
              in: adIds,
            },
            Request: {
              some: {},
            },
          },
          select: {
            ad_id: true,
            ad_title: true,
            _count: {
              select: {
                Request: true,
              },
            },
          },
        });

        if (usedAdOnes.length > 0) {
          return NextResponse.json(
            {
              success: false,
              message: 'Some add-ons are being used and cannot be deleted',
              data: usedAdOnes,
            },
            { status: 409 }
          );
        }

        result = await prisma.adOne.deleteMany({
          where: {
            ad_id: {
              in: adIds,
            },
          },
        });

        message = `Successfully deleted ${result.count} add-on(s)`;
        break;

      case 'update':
        if (!data) {
          return NextResponse.json(
            {
              success: false,
              message: 'Missing data for update operation',
            },
            { status: 400 }
          );
        }

        // Validate price if provided
        if (data.ad_price !== undefined && data.ad_price < 0) {
          return NextResponse.json(
            {
              success: false,
              message: 'Price must be a positive number',
            },
            { status: 400 }
          );
        }

        // Check for title conflicts if title is being updated
        if (data.ad_title) {
          const titleConflicts = await prisma.adOne.findMany({
            where: {
              ad_title: {
                equals: data.ad_title,
                mode: 'insensitive',
              },
              ad_id: {
                notIn: adIds,
              },
            },
            select: {
              ad_id: true,
              ad_title: true,
            },
          });

          if (titleConflicts.length > 0) {
            return NextResponse.json(
              {
                success: false,
                message: 'Title conflicts with existing add-ons',
                data: titleConflicts,
              },
              { status: 409 }
            );
          }
        }

        result = await prisma.adOne.updateMany({
          where: {
            ad_id: {
              in: adIds,
            },
          },
          data: {
            ...data,
            updatedAt: new Date(),
          },
        });

        message = `Successfully updated ${result.count} add-on(s)`;
        break;

      case 'activate':
        result = await prisma.adOne.updateMany({
          where: {
            ad_id: {
              in: adIds,
            },
          },
          data: {
            updatedAt: new Date(),
          },
        });

        message = `Successfully activated ${result.count} add-on(s)`;
        break;

      case 'export':
        // Get add-ons data for export
        const exportData = await prisma.adOne.findMany({
          where: {
            ad_id: {
              in: adIds,
            },
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
          message: `Exported ${exportData.length} add-on(s)`,
          data: exportData,
          exportInfo: {
            timestamp: new Date().toISOString(),
            totalRecords: exportData.length,
            format: 'JSON',
          },
        });

      default:
        return NextResponse.json(
          {
            success: false,
            message: 'Invalid operation. Supported operations: delete, update, activate, export',
          },
          { status: 400 }
        );
    }

    return NextResponse.json({
      success: true,
      message,
      data: {
        operation,
        affectedCount: result?.count || 0,
        processedIds: adIds,
      },
    });
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to perform bulk operation',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
