'use client';

import { useEffect, useState } from 'react';

interface GrabOrder {
  id: string;
  grabOrderId: string;
  customerName: string | null;
  customerPhone: string | null;
  items: string;
  total: number;
  status: string;
  isImported: boolean;
  createdAt: string;
}

export default function AdminGrabSyncPage() {
  const [grabOrders, setGrabOrders] = useState<GrabOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState<string | null>(null);

  useEffect(() => {
    loadGrabOrders();
  }, []);

  const loadGrabOrders = async () => {
    try {
      const response = await fetch('/api/admin/grab-orders');
      const data = await response.json();
      setGrabOrders(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading Grab orders:', error);
      setLoading(false);
    }
  };

  const handleImport = async (grabOrderId: string) => {
    setImporting(grabOrderId);

    try {
      const response = await fetch('/api/admin/grab-orders/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grabOrderId }),
      });

      if (response.ok) {
        loadGrabOrders();
        alert('Order imported successfully!');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to import order');
      }
    } catch (error) {
      alert('Error importing order');
    } finally {
      setImporting(null);
    }
  };

  if (loading) {
    return <div>Loading Grab orders...</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Grab Order Sync</h2>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> Grab orders are received via webhook at{' '}
          <code className="bg-blue-100 px-2 py-1 rounded">POST /api/grab/webhook</code>.
          Import them here to convert into internal orders.
        </p>
      </div>

      {grabOrders.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <p className="text-gray-600">No Grab orders found</p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Grab Order ID
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
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {grabOrders.map((order) => {
                const items = JSON.parse(order.items);
                return (
                  <tr key={order.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {order.grabOrderId}
                      </div>
                      <div className="text-xs text-gray-500">
                        {new Date(order.createdAt).toLocaleString()}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {order.customerName || 'N/A'}
                      </div>
                      <div className="text-xs text-gray-500">
                        {order.customerPhone || 'N/A'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">
                        {items.map((item: any, idx: number) => (
                          <div key={idx}>
                            {item.quantity}x {item.name}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-semibold text-gray-900">
                        ${order.total.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          order.isImported
                            ? 'bg-green-100 text-green-800'
                            : 'bg-yellow-100 text-yellow-800'
                        }`}
                      >
                        {order.isImported ? 'Imported' : 'Pending'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {!order.isImported ? (
                        <button
                          onClick={() => handleImport(order.id)}
                          disabled={importing === order.id}
                          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition disabled:opacity-50"
                        >
                          {importing === order.id ? 'Importing...' : 'Import'}
                        </button>
                      ) : (
                        <span className="text-gray-500">Completed</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
