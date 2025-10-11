import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/packages/stats - Get package statistics
export async function GET() {
  try {
    // Get total packages count
    const totalPackages = await prisma.package.count();

    // Get packages with request counts
    const packagesWithStats = await prisma.package.findMany({
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
    });

    // Calculate statistics
    const stats = packagesWithStats.map(pkg => ({
      package_id: pkg.package_id,
      package_title: pkg.package_title,
      package_price: pkg.package_price,
      total_requests: pkg.Request.length,
      pending_requests: pkg.Request.filter(req => req.status === 'pending').length,
      completed_requests: pkg.Request.filter(req => req.status === 'completed').length,
      rejected_requests: pkg.Request.filter(req => req.status === 'rejected').length,
      total_revenue: pkg.Request.length * pkg.package_price,
    }));

    // Overall statistics
    const totalRequests = await prisma.request.count();
    const totalRevenue = stats.reduce((sum, stat) => sum + stat.total_revenue, 0);
    const averagePackagePrice = totalPackages > 0 
      ? packagesWithStats.reduce((sum, pkg) => sum + pkg.package_price, 0) / totalPackages 
      : 0;

    // Most popular package
    const mostPopularPackage = stats.reduce((max, stat) => 
      stat.total_requests > max.total_requests ? stat : max, 
      { total_requests: 0 }
    );

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          total_packages: totalPackages,
          total_requests: totalRequests,
          total_revenue: totalRevenue,
          average_package_price: averagePackagePrice,
          most_popular_package: mostPopularPackage.total_requests > 0 ? mostPopularPackage : null,
        },
        package_stats: stats,
      },
    });
  } catch (error) {
    console.error('Error fetching package statistics:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch package statistics',
        details: error.message,
      },
      { status: 500 }
    );
  }
}
