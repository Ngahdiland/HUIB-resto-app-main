import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

const ordersFile = path.join(process.cwd(), 'data', 'orders.json');
const paymentsFile = path.join(process.cwd(), 'data', 'payments.json');
const usersFile = path.join(process.cwd(), 'data', 'users.json');

export async function GET(req: NextRequest) {
  try {
    // Read data files
    let orders = [];
    let payments = [];
    let users = [];

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

    // Calculate statistics
    const totalOrders = orders.length;
    const totalRevenue = orders.reduce((sum, order) => sum + (order.total || 0), 0);
    const completedPayments = payments.filter(p => p.status === 'completed');
    const totalRevenueFromPayments = completedPayments.reduce((sum, p) => sum + (p.amountPaid || 0), 0);
    const totalUsers = users.length;

    // Calculate order status breakdown
    const orderStatusCounts = orders.reduce((acc, order) => {
      const status = order.status || 'pending';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Calculate top selling products
    const productSales: Record<string, { sales: number; revenue: number }> = {};
    orders.forEach(order => {
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

    // Get recent orders (last 5)
    const recentOrders = orders
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
      const dayOrders = orders.filter(order => {
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
    const peakHours = orders.reduce((acc, order) => {
      const hour = new Date(order.date).getHours();
      const hourStr = `${hour}:00 ${hour < 12 ? 'AM' : 'PM'}`;
      acc[hourStr] = (acc[hourStr] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const peakHoursData = Object.entries(peakHours)
      .map(([hour, orders]) => ({ hour, orders }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 7);

    return NextResponse.json({
      stats: {
        totalOrders,
        totalRevenue,
        totalRevenueFromPayments,
        totalUsers,
        avgOrderValue: totalOrders > 0 ? totalRevenue / totalOrders : 0
      },
      orderStatusCounts,
      topProducts,
      recentOrders,
      revenueTrend,
      peakHoursData
    }, { status: 200 });

  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json({ error: 'Server error.' }, { status: 500 });
  }
} 