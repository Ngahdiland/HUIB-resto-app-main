import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');
const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');
const usersFile = path.join(process.cwd(), 'data', 'users.json');
const recordedOrdersFile = path.join(process.cwd(), 'data', 'recorded-data.json');

export async function GET(req: NextRequest) {
  try {
    // Read data files
    let orders = [];
    let payments = [];
    let users = [];
    let recordedOrders = [];

    if (fs.existsSync(ordersFile)) {
      const ordersData = fs.readFileSync(ordersFile, 'utf-8');
      orders = ordersData ? JSON.parse(ordersData) : [];
    }

    if (fs.existsSync(paymentsFile)) {
      const paymentsData = fs.readFileSync(paymentsFile, 'utf-8');
      payments = paymentsData ? JSON.parse(paymentsData) : [];
    }

    if (fs.existsSync(usersFile)) {
      const usersData = fs.readFileSync(usersFile, 'utf-8');
      users = usersData ? JSON.parse(usersData) : [];
    }

    if (fs.existsSync(recordedOrdersFile)) {
      const recordedOrdersData = fs.readFileSync(recordedOrdersFile, 'utf-8');
      recordedOrders = recordedOrdersData ? JSON.parse(recordedOrdersData) : [];
    }

    // Only include paid recorded orders
    const paidRecordedOrders = recordedOrders.filter((order: any) => order.status === 'paid');

    // Merge orders and paid recorded orders for stats
    const allOrders = [...orders, ...paidRecordedOrders];

    // Calculate statistics
    const totalOrders = allOrders.length;
    const totalRevenue = allOrders.reduce((sum, order) => sum + (order.total || 0), 0);
    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalRevenueFromPayments = completedPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const totalUsers = users.length;

    // Calculate order status breakdown
    const orderStatusCounts = allOrders.reduce((acc, order) => {
      const status = order.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate top selling products
    const productSales: Record<string, { sales: number; revenue: number }> = {};
    allOrders.forEach(order => {
      order.items?.forEach((item: any) => {
        if (!productSales[item.name]) {
          productSales[item.name] = { sales: 0, revenue: 0 };
        }
        productSales[item.name].sales += item.quantity || 1;
        productSales[item.name].revenue += (item.price || 0) * (item.quantity || 1);
      });
    });

    const topProducts = Object.entries(productSales)
      .map(([name, data]) => ({
        name,
        sales: data.sales,
        revenue: data.revenue
      }))
      .sort((a, b) => b.sales - a.sales)
      .slice(0, 5);

    // Calculate top customers by order count and revenue
    const customerStats: Record<string, { orders: number; revenue: number; avgOrderValue: number }> = {};
    allOrders.forEach(order => {
      const email = order.email;
      if (!customerStats[email]) {
        customerStats[email] = { orders: 0, revenue: 0, avgOrderValue: 0 };
      }
      customerStats[email].orders += 1;
      customerStats[email].revenue += order.total || 0;
    });

    // Calculate average order value for each customer
    Object.keys(customerStats).forEach(email => {
      customerStats[email].avgOrderValue = customerStats[email].revenue / customerStats[email].orders;
    });

    const topCustomers = Object.entries(customerStats)
      .map(([email, stats]) => ({
        email,
        orders: stats.orders,
        revenue: stats.revenue,
        avgOrderValue: stats.avgOrderValue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Calculate delivery locations (regions from users)
    const userRegions: Record<string, { users: number; orders: number; revenue: number }> = {};
    users.forEach(user => {
      const region = user.region || 'Unknown';
      if (!userRegions[region]) {
        userRegions[region] = { users: 0, orders: 0, revenue: 0 };
      }
      userRegions[region].users += 1;
    });

    // Add order data to regions
    allOrders.forEach(order => {
      const user = users.find(u => u.email === order.email);
      const region = user?.region || 'Unknown';
      if (userRegions[region]) {
        userRegions[region].orders += 1;
        userRegions[region].revenue += order.total || 0;
      }
    });

    const topDeliveryLocations = Object.entries(userRegions)
      .map(([region, stats]) => ({
        region,
        users: stats.users,
        orders: stats.orders,
        revenue: stats.revenue
      }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5);

    // Get recent orders (last 5)
    const recentOrders = allOrders
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5)
      .map(order => ({
        id: order.id,
        customer: order.email,
        items: order.items?.length || 0,
        total: order.total,
        status: order.status,
        date: order.date
      }));

    // Calculate revenue trend (last 7 days)
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - i);
      return date.toISOString().split('T')[0];
    }).reverse();

    const revenueTrend = last7Days.map(date => {
      const dayOrders = allOrders.filter(order => {
        const orderDate = new Date(order.date).toISOString().split('T')[0];
        return orderDate === date;
      });
      return {
        date,
        revenue: dayOrders.reduce((sum, order) => sum + (order.total || 0), 0),
        orders: dayOrders.length
      };
    });

    // Calculate peak hours (simplified - just count orders by hour)
    const peakHours = allOrders.reduce((acc, order) => {
      const hour = new Date(order.date).getHours();
      const hourStr = `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`;
      acc[hourStr] = (acc[hourStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const peakHoursData = Object.entries(peakHours)
      .map(([hour, orders]) => ({ hour, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 7);

    // Calculate key insights
    const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;
    const deliveredOrders = orderStatusCounts.delivered || 0;
    const deliveryRate = totalOrders > 0 ? (deliveredOrders / totalOrders) * 100 : 0;
    const pendingOrders = orderStatusCounts.pending || 0;
    const preparingOrders = orderStatusCounts.preparing || 0;
    const activeOrders = pendingOrders + preparingOrders;

    // Generate insights
    const insights = [
      {
        title: 'Delivery Success Rate',
        value: `${deliveryRate.toFixed(1)}%`,
        description: `${deliveredOrders} out of ${totalOrders} orders delivered successfully`,
        type: deliveryRate > 80 ? 'positive' : deliveryRate > 60 ? 'neutral' : 'negative'
      },
      {
        title: 'Active Orders',
        value: activeOrders.toString(),
        description: `${pendingOrders} pending, ${preparingOrders} preparing`,
        type: 'info'
      },
      {
        title: 'Average Order Value',
        value: `${Math.round(avgOrderValue).toLocaleString()} FCFA`,
        description: 'Revenue per order',
        type: 'positive'
      },
      {
        title: 'Customer Retention',
        value: `${topCustomers.length > 0 ? Math.round((topCustomers[0].orders / totalOrders) * 100) : 0}%`,
        description: 'Top customer contribution',
        type: 'info'
      }
    ];

    // Generate recommendations
    const recommendations = [];
    
    if (deliveryRate < 80) {
      recommendations.push({
        title: 'Improve Delivery Speed',
        description: 'Consider optimizing delivery routes and adding more delivery personnel',
        priority: 'high'
      });
    }

    if (activeOrders > 10) {
      recommendations.push({
        title: 'Process Pending Orders',
        description: `${activeOrders} orders need attention. Focus on order processing.`,
        priority: 'high'
      });
    }

    if (avgOrderValue < 5000) {
      recommendations.push({
        title: 'Increase Order Value',
        description: 'Consider upselling strategies and combo offers',
        priority: 'medium'
      });
    }

    if (topProducts.length > 0 && topProducts[0].sales < 5) {
      recommendations.push({
        title: 'Promote Top Products',
        description: 'Highlight best-selling items to increase sales',
        priority: 'medium'
      });
    }

    if (recommendations.length === 0) {
      recommendations.push({
        title: 'Business is Performing Well',
        description: 'All metrics are within optimal ranges. Keep up the good work!',
        priority: 'low'
      });
    }

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        totalRevenueFromPayments,
        totalUsers,
        avgOrderValue,
        deliveryRate,
        activeOrders
      },
      orderStatusCounts,
      topProducts,
      topCustomers,
      topDeliveryLocations,
      recentOrders,
      revenueTrend,
      peakHoursData,
      insights,
      recommendations
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 