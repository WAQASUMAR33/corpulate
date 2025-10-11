import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// POST /api/packages/bulk - Bulk operations on packages
export async function POST(request) {
  try {
    const body = await request.json();
    const { operation, package_ids, data } = body;

    if (!operation || !package_ids || !Array.isArray(package_ids)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Missing required fields: operation, package_ids',
        },
        { status: 400 }
      );
    }

    const validOperations = ['update', 'delete'];
    if (!validOperations.includes(operation)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid operation. Must be one of: update, delete',
        },
        { status: 400 }
      );
    }

    // Validate package IDs
    const packageIds = package_ids.map(id => parseInt(id)).filter(id => !isNaN(id));
    if (packageIds.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: 'No valid package IDs provided',
        },
        { status: 400 }
      );
    }

    let result;

    if (operation === 'update') {
      if (!data || typeof data !== 'object') {
        return NextResponse.json(
          {
            success: false,
            error: 'Update operation requires data object',
          },
          { status: 400 }
        );
      }

      // Validate update data
      const allowedFields = ['package_title', 'package_description', 'package_price'];
      const updateData = {};
      
      for (const field of allowedFields) {
        if (data[field] !== undefined) {
          if (field === 'package_price' && (typeof data[field] !== 'number' || data[field] < 0)) {
            return NextResponse.json(
              {
                success: false,
                error: 'Package price must be a positive number',
              },
              { status: 400 }
            );
          }
          updateData[field] = data[field];
        }
      }

      if (Object.keys(updateData).length === 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'No valid fields to update',
          },
          { status: 400 }
        );
      }

      result = await prisma.package.updateMany({
        where: {
          package_id: {
            in: packageIds,
          },
        },
        data: updateData,
      });

      return NextResponse.json({
        success: true,
        message: `Updated ${result.count} packages successfully`,
        updated_count: result.count,
        package_ids: packageIds,
      });

    } else if (operation === 'delete') {
      // Check if any packages have associated requests
      const packagesWithRequests = await prisma.package.findMany({
        where: {
          package_id: {
            in: packageIds,
          },
        },
        include: {
          Request: true,
        },
      });

      const packagesWithAssociatedRequests = packagesWithRequests.filter(
        pkg => pkg.Request.length > 0
      );

      if (packagesWithAssociatedRequests.length > 0) {
        return NextResponse.json(
          {
            success: false,
            error: 'Cannot delete packages with associated requests',
            packages_with_requests: packagesWithAssociatedRequests.map(pkg => ({
              package_id: pkg.package_id,
              package_title: pkg.package_title,
              request_count: pkg.Request.length,
            })),
          },
          { status: 400 }
        );
      }

      result = await prisma.package.deleteMany({
        where: {
          package_id: {
            in: packageIds,
          },
        },
      });

      return NextResponse.json({
        success: true,
        message: `Deleted ${result.count} packages successfully`,
        deleted_count: result.count,
        package_ids: packageIds,
      });
    }
  } catch (error) {
    console.error('Error performing bulk operation:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to perform bulk operation',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
