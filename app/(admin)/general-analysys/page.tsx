"use client";
import React, { useState, useEffect } from 'react';
import { FaChartLine, FaChartBar, FaChartPie, FaDownload, FaCalendar, FaFilter, FaArrowUp, FaArrowDown, FaUsers, FaShoppingCart, FaDollarSign, FaStar, FaMapMarkerAlt, FaClock, FaUserFriends, FaLightbulb, FaCheckCircle, FaExclamationTriangle, FaInfoCircle } from 'react-icons/fa';
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
  const [analyticsData, setAnalyticsData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch analytics data
  useEffect(() => {
    const fetchAnalyticsData = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/dashboard/stats');
        if (response.ok) {
          const data = await response.json();
          setAnalyticsData(data);
        } else {
          console.error('Failed to fetch analytics data');
        }
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, []);

  const getChangeColor = (change: number) => {
    return change >= 0 ? 'text-green-600' : 'text-red-600';
  };

  const getChangeIcon = (change: number) => {
    return change >= 0 ? <FaArrowUp className="text-green-500" /> : <FaArrowDown className="text-red-500" />;
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'positive': return 'text-green-600';
      case 'negative': return 'text-red-600';
      case 'neutral': return 'text-yellow-600';
      default: return 'text-blue-600';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-red-500 bg-red-50';
      case 'medium': return 'border-yellow-500 bg-yellow-50';
      case 'low': return 'border-green-500 bg-green-50';
      default: return 'border-gray-500 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'preparing': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'delivering': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Loading analytics data...</div>
      </div>
    );
  }

  if (!analyticsData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Failed to load analytics data</div>
      </div>
    );
  }

  // Calculate insights from real data
  const stats = analyticsData.stats;
  const orderStatusCounts = analyticsData.orderStatusCounts || {};
  const topProducts = analyticsData.topProducts || [];
  const topCustomers = analyticsData.topCustomers || [];
  const topDeliveryLocations = analyticsData.topDeliveryLocations || [];
  const insights = analyticsData.insights || [];
  const recommendations = analyticsData.recommendations || [];
  const revenueTrend = analyticsData.revenueTrend || [];
  const peakHoursData = analyticsData.peakHoursData || [];

  // Calculate order status data for chart
  const orderStatusData = Object.entries(orderStatusCounts).map(([status, count]: [string, any]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
    percentage: Math.round((count / stats.totalOrders) * 100)
  }));

  // Chart configurations
  const revenueChartData = {
    labels: revenueTrend.map((item: any) => item.date),
    datasets: [
      {
        label: selectedMetric === 'revenue' ? 'Revenue (FCFA)' : 'Orders',
        data: revenueTrend.map((item: any) => 
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
    labels: orderStatusData.map((item: any) => item.status),
    datasets: [
      {
        data: orderStatusData.map((item: any) => item.percentage),
        backgroundColor: [
          '#10B981', // Green
          '#3B82F6', // Blue
          '#F59E0B', // Yellow
          '#6B7280', // Gray
          '#8B5CF6', // Purple
        ],
        borderColor: [
          '#10B981',
          '#3B82F6',
          '#F59E0B',
          '#6B7280',
          '#8B5CF6',
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
    labels: peakHoursData.map((item: any) => item.hour),
    datasets: [
      {
        label: 'Orders',
        data: peakHoursData.map((item: any) => item.orders),
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

  // Generate CSV report
  function handleGenerateReport() {
    let csv = '';
    // Revenue/Orders Chart Data
    csv += `General Analysis Report (${dateRange} days)\n`;
    csv += 'Date,Revenue,Orders\n';
    revenueTrend.forEach((row: any) => {
      csv += `${row.date},${row.revenue},${row.orders}\n`;
    });
    csv += '\n';
    // Top Products
    csv += 'Top Products\n';
    csv += 'Product,Sales,Revenue\n';
    topProducts.forEach((p: any) => {
      csv += `${p.name},${p.sales},${p.revenue}\n`;
    });
    csv += '\n';
    // Top Customers
    csv += 'Top Customers\n';
    csv += 'Email,Orders,Revenue,AvgOrderValue\n';
    topCustomers.forEach((c: any) => {
      csv += `${c.email},${c.orders},${c.revenue},${c.avgOrderValue}\n`;
    });
    csv += '\n';
    // Top Delivery Locations
    csv += 'Top Delivery Locations\n';
    csv += 'Region,Users,Orders,Revenue\n';
    topDeliveryLocations.forEach((l: any) => {
      csv += `${l.region},${l.users},${l.orders},${l.revenue}\n`;
    });
    csv += '\n';
    // Order Status
    csv += 'Order Status Distribution\n';
    csv += 'Status,Count,Percentage\n';
    orderStatusData.forEach((s: any) => {
      csv += `${s.status},${s.count},${s.percentage}%\n`;
    });
    csv += '\n';
    // Download
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `general_analysis_report_${dateRange}days_${new Date().toISOString().slice(0,10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

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
          <button className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2" onClick={handleGenerateReport}>
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
              <p className="text-2xl font-bold text-gray-800">{stats.totalRevenue.toLocaleString()} FCFA</p>
              <div className="flex items-center mt-2">
                <FaArrowUp className="text-green-500 text-sm mr-1" />
                <span className="text-sm text-green-600">+0%</span>
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
              <p className="text-2xl font-bold text-gray-800">{stats.totalOrders.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <FaArrowUp className="text-green-500 text-sm mr-1" />
                <span className="text-sm text-green-600">+0%</span>
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
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-800">{stats.totalUsers.toLocaleString()}</p>
              <div className="flex items-center mt-2">
                <FaArrowUp className="text-green-500 text-sm mr-1" />
                <span className="text-sm text-green-600">+0%</span>
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
              <p className="text-sm font-medium text-gray-600">Avg Order Value</p>
              <p className="text-2xl font-bold text-gray-800">{Math.round(stats.avgOrderValue).toLocaleString()} FCFA</p>
              <div className="flex items-center mt-2">
                <FaArrowUp className="text-green-500 text-sm mr-1" />
                <span className="text-sm text-green-600">+0%</span>
                <span className="text-sm text-gray-500 ml-1">from last period</span>
              </div>
            </div>
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaDollarSign className="text-2xl" />
            </div>
          </div>
        </div>
      </div>

      {/* Key Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {insights.map((insight: any, index: number) => (
          <div key={index} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center justify-between mb-4">
              <FaLightbulb className={`text-2xl ${getInsightColor(insight.type)}`} />
              <span className={`text-xs px-2 py-1 rounded-full ${getInsightColor(insight.type)} bg-opacity-10`}>
                {insight.type}
              </span>
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">{insight.title}</h3>
            <p className="text-2xl font-bold text-gray-800 mb-2">{insight.value}</p>
            <p className="text-sm text-gray-600">{insight.description}</p>
          </div>
        ))}
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

        {/* Order Status Chart */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          <div className="h-64">
            <Doughnut data={orderStatusChartData} options={orderStatusChartOptions} />
          </div>
        </div>
      </div>

      {/* Peak Hours Chart */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Peak Order Hours</h3>
        <div className="h-64">
          <Bar data={peakHoursChartData} options={peakHoursChartOptions} />
        </div>
      </div>

      {/* Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top Products */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Top Performing Products</h3>
          <div className="space-y-4">
            {topProducts.map((product: any, index: number) => (
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
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order Status */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Order Status Distribution</h3>
          <div className="space-y-4">
            {orderStatusData.map((status: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full ${
                    status.status === 'Delivered' ? 'bg-green-500' :
                    status.status === 'Delivering' ? 'bg-blue-500' :
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
            {peakHoursData.map((hour: any, index: number) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <FaClock className="text-gray-400" />
                  <span className="text-sm font-medium text-gray-700">{hour.hour}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-20 bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-red-600 h-2 rounded-full" 
                      style={{ width: `${(hour.orders / Math.max(...peakHoursData.map((h: any) => h.orders))) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-sm font-semibold text-gray-800">{hour.orders}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Top Customers and Delivery Locations */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Customers */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaUserFriends className="text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">Top Customers</h3>
          </div>
          <div className="space-y-4">
            {topCustomers.map((customer: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{customer.email}</p>
                    <p className="text-sm text-gray-600">{customer.orders} orders</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{customer.revenue.toFixed(0)} FCFA</p>
                  <p className="text-xs text-gray-500">Avg: {customer.avgOrderValue.toFixed(0)} FCFA</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Delivery Locations */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center gap-2 mb-4">
            <FaMapMarkerAlt className="text-red-600" />
            <h3 className="text-lg font-semibold text-gray-800">Top Delivery Locations</h3>
          </div>
          <div className="space-y-4">
            {topDeliveryLocations.map((location: any, index: number) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-semibold mr-3">
                    {index + 1}
                  </div>
                  <div>
                    <p className="font-medium text-gray-800">{location.region}</p>
                    <p className="text-sm text-gray-600">{location.users} users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-800">{location.orders} orders</p>
                  <p className="text-xs text-gray-500">{location.revenue.toFixed(0)} FCFA</p>
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
                  Users
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
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {topDeliveryLocations.map((location: any, index: number) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <FaMapMarkerAlt className="text-red-500 mr-2" />
                      <span className="text-sm font-medium text-gray-900">{location.region}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {location.users}
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Insights and Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Insights</h3>
          <div className="space-y-4">
            {insights.map((insight: any, index: number) => (
              <div key={index} className="flex items-start space-x-3">
                <div className={`w-2 h-2 rounded-full mt-2 ${
                  insight.type === 'positive' ? 'bg-green-500' :
                  insight.type === 'negative' ? 'bg-red-500' :
                  insight.type === 'neutral' ? 'bg-yellow-500' : 'bg-blue-500'
                }`}></div>
                <div>
                  <p className="text-sm font-medium text-gray-800">{insight.title}</p>
                  <p className="text-xs text-gray-600">{insight.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Recommendations</h3>
          <div className="space-y-4">
            {recommendations.map((rec: any, index: number) => (
              <div key={index} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(rec.priority)}`}>
                <div className="flex items-start gap-3">
                  {rec.priority === 'high' ? (
                    <FaExclamationTriangle className="text-red-500 mt-1" />
                  ) : rec.priority === 'medium' ? (
                    <FaInfoCircle className="text-yellow-500 mt-1" />
                  ) : (
                    <FaCheckCircle className="text-green-500 mt-1" />
                  )}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-1">{rec.title}</h4>
                    <p className="text-sm text-gray-600">{rec.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GeneralAnalysis;
