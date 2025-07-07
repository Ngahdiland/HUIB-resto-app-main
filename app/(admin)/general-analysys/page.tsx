"use client";
import React, { useState } from 'react';
import { FaChartLine, FaChartBar, FaChartPie, FaDownload, FaCalendar, FaFilter, FaArrowUp, FaArrowDown, FaUsers, FaShoppingCart, FaDollarSign, FaStar, FaMapMarkerAlt, FaClock } from 'react-icons/fa';
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

const GeneralAnalysis = () => {
  const [dateRange, setDateRange] = useState('30');
  const [selectedMetric, setSelectedMetric] = useState('revenue');

  // Sample analytics data
  const analyticsData = {
    overview: {
      totalRevenue: 45678.50,
      totalOrders: 1234,
      totalCustomers: 2847,
      averageRating: 4.8,
      revenueChange: 15.3,
      ordersChange: 8.2,
      customersChange: 12.5,
      ratingChange: 0.2
    },
    revenueData: [
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
    ],
    topProducts: [
      { name: 'Pizza Margherita', sales: 156, revenue: 2028.00, growth: 12.5 },
      { name: 'Burger Deluxe', sales: 142, revenue: 1418.58, growth: 8.3 },
      { name: 'Sushi Platter', sales: 98, revenue: 1960.02, growth: 15.7 },
      { name: 'Pasta Carbonara', sales: 87, revenue: 1042.13, growth: 5.2 },
      { name: 'Chicken Wings', sales: 76, revenue: 683.24, growth: 9.8 }
    ],
    customerSegments: [
      { segment: 'New Customers', count: 456, percentage: 32 },
      { segment: 'Returning Customers', count: 678, percentage: 48 },
      { segment: 'VIP Customers', count: 234, percentage: 16 },
      { segment: 'Inactive Customers', count: 48, percentage: 4 }
    ],
    orderStatus: [
      { status: 'Delivered', count: 892, percentage: 72 },
      { status: 'In Transit', count: 156, percentage: 13 },
      { status: 'Preparing', count: 98, percentage: 8 },
      { status: 'Pending', count: 88, percentage: 7 }
    ],
    peakHours: [
      { hour: '12:00 PM', orders: 45 },
      { hour: '1:00 PM', orders: 52 },
      { hour: '2:00 PM', orders: 38 },
      { hour: '6:00 PM', orders: 62 },
      { hour: '7:00 PM', orders: 71 },
      { hour: '8:00 PM', orders: 78 },
      { hour: '9:00 PM', orders: 65 }
    ],
    topLocations: [
      { location: 'Downtown', orders: 234, revenue: 3456.78 },
      { location: 'Westside', orders: 189, revenue: 2789.45 },
      { location: 'Eastside', orders: 156, revenue: 2345.67 },
      { location: 'Northside', orders: 123, revenue: 1890.34 },
      { location: 'Southside', orders: 98, revenue: 1456.78 }
    ]
  };

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />;
  };

  // Chart configurations
  const revenueChartData = {
    labels: analyticsData.revenueData.map(item => item.date),
    datasets: [
      {
        label: selectedMetric === 'revenue' ? 'Revenue (FCFA)' : 'Orders',
        data: analyticsData.revenueData.map(item => 
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

  const customerSegmentsData = {
    labels: analyticsData.customerSegments.map(item => item.segment),
    datasets: [
      {
        data: analyticsData.customerSegments.map(item => item.percentage),
        backgroundColor: [
          '#3B82F6', // Blue
          '#10B981', // Green
          '#8B5CF6', // Purple
          '#6B7280', // Gray
        ],
        borderColor: [
          '#3B82F6',
          '#10B981',
          '#8B5CF6',
          '#6B7280',
        ],
        borderWidth: 2,
        hoverOffset: 4,
      }
    ]
  };

  const customerSegmentsOptions = {
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
            const segment = analyticsData.customerSegments[context.dataIndex];
            return `${segment.segment}: ${segment.count} customers (${segment.percentage}%)`;
          }
        }
      }
    }
  };

  const peakHoursData = {
    labels: analyticsData.peakHours.map(item => item.hour),
    datasets: [
      {
        label: 'Orders',
        data: analyticsData.peakHours.map(item => item.orders),
        backgroundColor: 'rgba(220, 38, 38, 0.8)',
        borderColor: '#DC2626',
        borderWidth: 2,
        borderRadius: 4,
        borderSkipped: false,
      }
    ]
  };

  const peakHoursOptions = {
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
          <h1 className="text-3xl font-bold text-gray-800">General Analysis</h1>
          <p className="text-gray-600">Comprehensive business analytics and insights</p>
        </div>
        <div className="flex gap-3">
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
            <option value="365">Last year</option>
          </select>
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2">
            <FaDownload />
            Export Report
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalRevenue.toLocaleString()} FCFA</p>
              <div className="flex items-center mt-2">
                {getChangeIcon(analyticsData.overview.revenueChange)}
                <span className={`text-sm ${getChangeColor(analyticsData.overview.revenueChange)}`}>
                  {analyticsData.overview.revenueChange}%
                </span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaDollarSign className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Orders</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalOrders.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {getChangeIcon(analyticsData.overview.ordersChange)}
                <span className={`text-sm ${getChangeColor(analyticsData.overview.ordersChange)}`}>
                  {analyticsData.overview.ordersChange}%
                </span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaShoppingCart className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Customers</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.overview.totalCustomers.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                {getChangeIcon(analyticsData.overview.customersChange)}
                <span className={`text-sm ${getChangeColor(analyticsData.overview.customersChange)}`}>
                  {analyticsData.overview.customersChange}%
                </span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaUsers className="text-2xl" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average Rating</p>
              <p className="text-2xl font-bold text-gray-800">{analyticsData.overview.averageRating}</p>
              <div className="flex items-center mt-2">
                {getChangeIcon(analyticsData.overview.ratingChange)}
                <span className={`text-sm ${getChangeColor(analyticsData.overview.ratingChange)}`}>
                  {analyticsData.overview.ratingChange}
                </span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaStar className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-800">Revenue Trend</h3>
            <div className="flex gap-2">
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

        {/* Customer Segments */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Customer Segments</h3>
          <div className="h-64">
            <Doughnut data={customerSegmentsData} options={customerSegmentsOptions} />
          </div>
        </div>
      </div>

      {/* Peak Hours Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Peak Order Hours</h3>
        <div className="h-64">
          <Bar data={peakHoursData} options={peakHoursOptions} />
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Products</h3>
          <div className="space-y-4">
            {analyticsData.topProducts.map((product, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-red-100 text-red-600 rounded-full flex items-center justify-center text-sm font-semibold">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{product.name}</p>
                    <p className="text-sm text-gray-500">{product.sales} sales</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{product.revenue.toFixed(0)} FCFA</p>
                  <p className={`text-xs ${getChangeColor(product.growth)}`}>
                    +{product.growth}%
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          <div className="space-y-4">
            {analyticsData.orderStatus.map((status, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    status.status === 'Delivered' ? 'bg-green-500' :
                    status.status === 'In Transit' ? 'bg-blue-500' :
                    status.status === 'Preparing' ? 'bg-yellow-500' : 'bg-gray-500'
                  }`}></div>
                  <span className="text-sm font-medium text-gray-700">{status.status}</span>
                </div>
                <div className="text-right">
                  <p className="text-sm font-semibold text-gray-800">{status.count}</p>
                  <p className="text-xs text-gray-500">{status.percentage}%</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Peak Hours */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Peak Order Hours</h3>
          <div className="space-y-3">
            {analyticsData.peakHours.map((hour, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaClock className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{hour.hour}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(hour.orders / 78) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{hour.orders}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Location Analytics */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Delivery Locations</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Location
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Orders
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Avg Order Value
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Growth
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {analyticsData.topLocations.map((location, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-red-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{location.location}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {location.orders}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                    {location.revenue.toFixed(0)} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {(location.revenue / location.orders).toFixed(0)} FCFA
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      +{Math.floor(Math.random() * 20) + 5}%
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Revenue Growth</p>
                <p className="text-xs text-gray-600">Revenue increased by 15.3% compared to last period</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Customer Acquisition</p>
                <p className="text-xs text-gray-600">New customer signups increased by 12.5%</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Peak Hours</p>
                <p className="text-xs text-gray-600">Most orders are placed between 6-8 PM</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="w-2 h-2 bg-purple-500 rounded-full mt-2"></div>
              <div>
                <p className="text-sm font-medium text-gray-800">Top Product</p>
                <p className="text-xs text-gray-600">Pizza Margherita is the best-selling item</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
          <div className="space-y-4">
            <div className="p-3 bg-blue-50 border-l-4 border-blue-400">
              <p className="text-sm font-medium text-blue-800">Increase Marketing</p>
              <p className="text-xs text-blue-600">Consider increasing marketing spend during peak hours</p>
            </div>
            <div className="p-3 bg-green-50 border-l-4 border-green-400">
              <p className="text-sm font-medium text-green-800">Inventory Management</p>
              <p className="text-xs text-green-600">Stock up on popular items like Pizza Margherita</p>
            </div>
            <div className="p-3 bg-yellow-50 border-l-4 border-yellow-400">
              <p className="text-sm font-medium text-yellow-800">Delivery Optimization</p>
              <p className="text-xs text-yellow-600">Consider adding more delivery partners for downtown area</p>
            </div>
            <div className="p-3 bg-purple-50 border-l-4 border-purple-400">
              <p className="text-sm font-medium text-purple-800">Customer Retention</p>
              <p className="text-xs text-purple-600">Focus on retaining returning customers (48% of total)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralAnalysis;
