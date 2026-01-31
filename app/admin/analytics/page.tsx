'use client';

import { useEffect, useState } from 'react';

interface Analytics {
  topItems: Array<{ name: string; count: number; revenue: number }>;
  ordersByHour: Array<{ hour: number; count: number }>;
  customerSegments: { new: number; returning: number };
  voucherRedemptions: Array<{ code: string; count: number; discount: number }>;
  totalOrders: number;
  totalRevenue: number;
}

export default function AdminAnalyticsPage() {
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      const response = await fetch('/api/admin/analytics');
      const data = await response.json();
      setAnalytics(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading analytics:', error);
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading analytics...</div>;
  }

  if (!analytics) {
    return <div>Failed to load analytics</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics Dashboard</h2>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Orders</p>
          <p className="text-3xl font-bold text-amber-600">{analytics.totalOrders}</p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Total Revenue</p>
          <p className="text-3xl font-bold text-green-600">
            ${analytics.totalRevenue.toFixed(2)}
          </p>
        </div>
        <div className="bg-white rounded-lg shadow-md p-6">
          <p className="text-sm text-gray-600 mb-1">Average Order Value</p>
          <p className="text-3xl font-bold text-blue-600">
            ${analytics.totalOrders > 0 ? (analytics.totalRevenue / analytics.totalOrders).toFixed(2) : '0.00'}
          </p>
        </div>
      </div>

      {/* Top Items */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Top Selling Items</h3>
        <div className="space-y-3">
          {analytics.topItems.map((item, index) => (
            <div key={index} className="flex justify-between items-center border-b pb-2">
              <div>
                <span className="font-semibold">{index + 1}. {item.name}</span>
                <span className="text-sm text-gray-600 ml-2">({item.count} orders)</span>
              </div>
              <span className="font-bold text-green-600">${item.revenue.toFixed(2)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Orders by Hour */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Orders by Hour</h3>
        <div className="space-y-2">
          {analytics.ordersByHour.map((hourData) => (
            <div key={hourData.hour} className="flex items-center">
              <span className="w-16 text-sm text-gray-600">
                {hourData.hour}:00
              </span>
              <div className="flex-1 bg-gray-200 rounded-full h-6 ml-4">
                <div
                  className="bg-amber-600 h-6 rounded-full flex items-center justify-end pr-2"
                  style={{
                    width: `${(hourData.count / Math.max(...analytics.ordersByHour.map(h => h.count))) * 100}%`,
                  }}
                >
                  <span className="text-xs text-white font-semibold">
                    {hourData.count}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Customer Segments */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h3 className="text-xl font-bold mb-4">Customer Segments</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <p className="text-2xl font-bold text-blue-600">
              {analytics.customerSegments.new}
            </p>
            <p className="text-sm text-gray-600">New Customers</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <p className="text-2xl font-bold text-green-600">
              {analytics.customerSegments.returning}
            </p>
            <p className="text-sm text-gray-600">Returning Customers</p>
          </div>
        </div>
      </div>

      {/* Voucher Redemptions */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-bold mb-4">Voucher Redemptions</h3>
        {analytics.voucherRedemptions.length > 0 ? (
          <div className="space-y-3">
            {analytics.voucherRedemptions.map((voucher, index) => (
              <div key={index} className="flex justify-between items-center border-b pb-2">
                <div>
                  <span className="font-semibold">{voucher.code}</span>
                  <span className="text-sm text-gray-600 ml-2">({voucher.count} uses)</span>
                </div>
                <span className="font-bold text-red-600">
                  -${voucher.discount.toFixed(2)}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No voucher redemptions yet</p>
        )}
      </div>
    </div>
  );
}
