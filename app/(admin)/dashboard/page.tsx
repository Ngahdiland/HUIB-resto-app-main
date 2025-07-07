"use client";
import React, { useState } from 'react';
import { FaUsers, FaShoppingCart, FaDollarSign, FaStar, FaArrowUp, FaArrowDown, FaChartLine, FaChartBar, FaChartPie } from 'react-icons/fa';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const Dashboard = () => {
  const [selectedMetric, setSelectedMetric] = useState('revenue');
  const [timeRange, setTimeRange] = useState('7');

  // Sample data - replace with real API calls
  const stats = [
    {
      title: 'Total Users',
      value: '2,847',
      change: '+12.5%',
      trend: 'up',
      icon: <FaUsers className="text-2xl" />,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Orders',
      value: '1,234',
      change: '+8.2%',
      trend: 'up',
      icon: <FaShoppingCart className="text-2xl" />,
      color: 'bg-green-500'
    },
    {
      title: 'Revenue',
      value: '45,678 FCFA',
      change: '+15.3%',
      trend: 'up',
      icon: <FaDollarSign className="text-2xl" />,
      color: 'bg-yellow-500'
    },
    {
      title: 'Avg Rating',
      value: '4.8',
      change: '+0.2',
      trend: 'up',
      icon: <FaStar className="text-2xl" />,
      color: 'bg-purple-500'
    }
  ];

  const recentOrders = [
    {
      id: 'ORD-001',
      customer: 'John Doe',
      items: 3,
      total: 45.99,
      status: 'delivered',
      date: '2024-01-15 14:30'
    },
    {
      id: 'ORD-002',
      customer: 'Jane Smith',
      items: 2,
      total: 32.50,
      status: 'preparing',
      date: '2024-01-15 13:45'
    },
    {
      id: 'ORD-003',
      customer: 'Mike Johnson',
      items: 4,
      total: 67.25,
      status: 'pending',
      date: '2024-01-15 13:20'
    },
    {
      id: 'ORD-004',
      customer: 'Sarah Wilson',
      items: 1,
      total: 18.99,
      status: 'delivering',
      date: '2024-01-15 12:55'
    }
  ];

  const topProducts = [
    { name: 'Pizza Margherita', sales: 156, revenue: 2028.00 },
    { name: 'Burger Deluxe', sales: 142, revenue: 1418.58 },
    { name: 'Sushi Platter', sales: 98, revenue: 1960.02 },
    { name: 'Pasta Carbonara', sales: 87, revenue: 1042.13 },
    { name: 'Chicken Wings', sales: 76, revenue: 683.24 }
  ];

  // Chart data
  const chartData = [
    { date: 'Jan 1', revenue: 1200, orders: 45 },
    { date: 'Jan 2', revenue: 1350, orders: 52 },
    { date: 'Jan 3', revenue: 980, orders: 38 },
    { date: 'Jan 4', revenue: 1650, orders: 62 },
    { date: 'Jan 5', revenue: 1420, orders: 55 },
    { date: 'Jan 6', revenue: 1890, orders: 71 },
    { date: 'Jan 7', revenue: 2100, orders: 78 },
    { date: 'Jan 8', revenue: 1850, orders: 68 },
    { date: 'Jan 9', revenue: 2200, orders: 82 },
    { date: 'Jan 10', revenue: 1950, orders: 73 },
    { date: 'Jan 11', revenue: 2400, orders: 89 },
    { date: 'Jan 12', revenue: 2100, orders: 78 },
    { date: 'Jan 13', revenue: 1800, orders: 67 },
    { date: 'Jan 14', revenue: 2300, orders: 85 }
  ];

  const orderStatusData = [
    { status: 'Delivered', count: 892, percentage: 72 },
    { status: 'In Transit', count: 156, percentage: 13 },
    { status: 'Preparing', count: 98, percentage: 8 },
    { status: 'Pending', count: 88, percentage: 7 }
  ];

  const peakHoursData = [
    { hour: '12:00 PM', orders: 45 },
    { hour: '1:00 PM', orders: 52 },
    { hour: '2:00 PM', orders: 38 },
    { hour: '6:00 PM', orders: 62 },
    { hour: '7:00 PM', orders: 71 },
    { hour: '8:00 PM', orders: 78 },
    { hour: '9:00 PM', orders: 65 }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delivering': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  // Chart configurations
  const revenueChartData = {
    labels: chartData.map(item => item.date),
    datasets: [
      {
        label: selectedMetric === 'revenue' ? 'Revenue (FCFA)' : 'Orders',
        data: chartData.map(item => 
          selectedMetric === 'revenue' ? item.revenue : item.orders
        ),
        borderColor: '#DC2626',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#DC2626',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 4,
        pointHoverRadius: 6,
      }
    ]
  };

  const revenueChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#DC2626',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context: any) {
            return selectedMetric === 'revenue' 
              ? `Revenue: ${context.parsed.y.toLocaleString()} FCFA`
              : `Orders: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          callback: function(value: any) {
            return selectedMetric === 'revenue' 
              ? `${value.toLocaleString()} FCFA`
              : value;
          }
        }
      }
    },
    elements: {
      point: {
        hoverBackgroundColor: '#DC2626',
      }
    }
  };

  const orderStatusChartData = {
    labels: orderStatusData.map(item => item.status),
    datasets: [
      {
        data: orderStatusData.map(item => item.percentage),
        backgroundColor: [
          '#10B981', // Green
          '#3B82F6', // Blue
          '#F59E0B', // Yellow
          '#6B7280', // Gray
        ],
        borderColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
          '#6B7280',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      }
    ]
  };

  const orderStatusChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          padding: 20,
          usePointStyle: true,
          font: {
            size: 12
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#DC2626',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            const status = orderStatusData[context.dataIndex];
            return `${status.status}: ${status.count} orders (${status.percentage}%)`;
          }
        }
      }
    }
  };

  const peakHoursChartData = {
    labels: peakHoursData.map(item => item.hour),
    datasets: [
      {
        label: 'Orders',
        data: peakHoursData.map(item => item.orders),
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: '#DC2626',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const peakHoursChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleColor: '#fff',
        bodyColor: '#fff',
        borderColor: '#DC2626',
        borderWidth: 1,
        cornerRadius: 8,
        callbacks: {
          label: function(context: any) {
            return `Orders: ${context.parsed.y}`;
          }
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          beginAtZero: true
        }
      }
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard</h1>
          <p className="text-gray-600">Welcome back! Here's what's happening with your business.</p>
        </div>
        <div className="flex gap-3">
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors">
            Generate Report
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-2xl font-bold text-gray-800">{stat.value}</p>
                <div className="flex items-center mt-2">
                  {stat.trend === 'up' ? (
                    <FaArrowUp className="text-green-500 text-sm mr-1" />
                  ) : (
                    <FaArrowDown className="text-red-500 text-sm mr-1" />
                  )}
                  <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                    {stat.change}
                  </span>
                  <span className="text-sm text-gray-500 ml-1">from last month</span>
                </div>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Charts and Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Overview</h3>
            <div className="flex gap-2">
              <select
                value={timeRange}
                onChange={(e) => setTimeRange(e.target.value)}
                className="text-sm border border-gray-300 rounded px-2 py-1"
              >
                <option value="7">Last 7 days</option>
                <option value="30">Last 30 days</option>
                <option value="90">Last 3 months</option>
              </select>
              <button
                onClick={() => setSelectedMetric('revenue')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'revenue' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Revenue
              </button>
              <button
                onClick={() => setSelectedMetric('orders')}
                className={`px-3 py-1 text-sm rounded ${
                  selectedMetric === 'orders' ? 'bg-red-600 text-white' : 'bg-gray-100 text-gray-700'
                }`}
              >
                Orders
              </button>
            </div>
          </div>
          <div className="h-64">
            <Line data={revenueChartData} options={revenueChartOptions} />
          </div>
        </div>

        {/* Order Status Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          <div className="h-64">
            <Doughnut data={orderStatusChartData} options={orderStatusChartOptions} />
          </div>
        </div>
      </div>

      {/* Additional Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Peak Hours Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Peak Order Hours</h3>
          <div className="h-64">
            <Bar data={peakHoursChartData} options={peakHoursChartOptions} />
          </div>
        </div>

        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Selling Products</h3>
          <div className="space-y-4">
            {topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-600">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{product.revenue.toFixed(0)} FCFA</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-800">Recent Orders</h3>
            <button className="text-red-600 hover:text-red-700 text-sm font-medium">
              View All Orders
            </button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Order ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Items
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Total
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {order.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.customer}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.items}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.total.toFixed(0)} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(order.status)}`}>
                      {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {order.date}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button className="w-full text-left p-3 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors">
              Add New Product
            </button>
            <button className="w-full text-left p-3 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors">
              View All Orders
            </button>
            <button className="w-full text-left p-3 bg-green-50 text-green-700 rounded-lg hover:bg-green-100 transition-colors">
              Manage Users
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">System Status</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Database</span>
              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Payment Gateway</span>
              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Online
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Email Service</span>
              <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                Online
              </span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="text-sm">
              <p className="text-gray-800">New order received</p>
              <p className="text-gray-500">2 minutes ago</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-800">Product updated</p>
              <p className="text-gray-500">15 minutes ago</p>
            </div>
            <div className="text-sm">
              <p className="text-gray-800">New user registered</p>
              <p className="text-gray-500">1 hour ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
