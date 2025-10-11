import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// GET /api/adones/stats - Get add-ons statistics
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || 'all'; // all, week, month, year

    // Calculate date filter based on period
    let dateFilter = {};
    const now = new Date();
    
    switch (period) {
      case 'week':
        dateFilter = {
          createdAt: {
            gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
          },
        };
        break;
      case 'month':
        dateFilter = {
          createdAt: {
            gte: new Date(now.getFullYear(), now.getMonth(), 1),
          },
        };
        break;
      case 'year':
        dateFilter = {
          createdAt: {
            gte: new Date(now.getFullYear(), 0, 1),
          },
        };
        break;
      default:
        dateFilter = {};
    }

    // Get total add-ons count
    const totalAdOnes = await prisma.adOne.count();

    // Get add-ons count for the period
    const periodAdOnes = await prisma.adOne.count({
      where: dateFilter,
    });

    // Get total revenue from add-ons
    const revenueData = await prisma.adOne.aggregate({
      _sum: {
        ad_price: true,
      },
      _avg: {
        ad_price: true,
      },
      _min: {
        ad_price: true,
      },
      _max: {
        ad_price: true,
      },
    });

    // Get add-ons usage statistics
    const usageStats = await prisma.adOne.findMany({
      select: {
        ad_id: true,
        ad_title: true,
        ad_price: true,
        _count: {
          select: {
            Request: true,
          },
        },
      },
      orderBy: {
        Request: {
          _count: 'desc',
        },
      },
      take: 10,
    });

    // Get recent add-ons
    const recentAdOnes = await prisma.adOne.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 5,
      select: {
        ad_id: true,
        ad_title: true,
        ad_price: true,
        createdAt: true,
      },
    });

    // Get add-ons by price range
    const priceRanges = await Promise.all([
      prisma.adOne.count({
        where: {
          ad_price: {
            lt: 50,
          },
        },
      }),
      prisma.adOne.count({
        where: {
          ad_price: {
            gte: 50,
            lt: 100,
          },
        },
      }),
      prisma.adOne.count({
        where: {
          ad_price: {
            gte: 100,
            lt: 200,
          },
        },
      }),
      prisma.adOne.count({
        where: {
          ad_price: {
            gte: 200,
          },
        },
      }),
    ]);

    // Calculate total requests using add-ons
    const totalRequestsWithAdOnes = await prisma.request.count({
      where: {
        AdOne: {
          some: {},
        },
      },
    });

    // Calculate average add-ons per request
    const avgAdOnesPerRequest = totalRequestsWithAdOnes > 0 
      ? await prisma.request.aggregate({
          _avg: {
            AdOne: {
              _count: true,
            },
          },
        })
      : { _avg: { AdOne: { _count: 0 } } };

    return NextResponse.json({
      success: true,
      data: {
        overview: {
          totalAdOnes,
          periodAdOnes,
          totalRequestsWithAdOnes,
          avgAdOnesPerRequest: avgAdOnesPerRequest._avg.AdOne?._count || 0,
        },
        revenue: {
          total: revenueData._sum.ad_price || 0,
          average: revenueData._avg.ad_price || 0,
          minimum: revenueData._min.ad_price || 0,
          maximum: revenueData._max.ad_price || 0,
        },
        usage: {
          mostUsed: usageStats,
          recent: recentAdOnes,
        },
        distribution: {
          priceRanges: {
            under50: priceRanges[0],
            between50And100: priceRanges[1],
            between100And200: priceRanges[2],
            over200: priceRanges[3],
          },
        },
        period,
      },
    });
  } catch (error) {
    console.error('Error fetching add-ons statistics:', error);
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch add-ons statistics',
        error: error.message,
      },
      { status: 500 }
    );
  }
}
