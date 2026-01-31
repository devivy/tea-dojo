'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';

interface Order {
  id: string;
  orderNumber: string;
  status: string;
  total: number;
  pointsEarned: number;
  createdAt: string;
  store: {
    name: string;
    address: string | null;
  };
  user: {
    name: string | null;
    loyaltyPoints: number;
  } | null;
  orderItems: Array<{
    id: string;
    quantity: number;
    price: number;
    sweetness: string | null;
    ice: string | null;
    addOns: string | null;
    menuItem: {
      name: string;
    };
  }>;
}

export default function OrderConfirmationPage() {
  const params = useParams();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const id = params.id as string;
    fetch(`/api/orders/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setOrder(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading order:', error);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-900"></div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Order not found</p>
          <Link href="/menu" className="text-amber-600 hover:underline">
            Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Success Message */}
        <div className="bg-white rounded-lg shadow-lg p-8 mb-6 text-center">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-green-600 mb-2">
            Order Confirmed!
          </h1>
          <p className="text-gray-600 mb-4">
            Thank you for your order. Your drinks will be ready soon!
          </p>
          <div className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 inline-block">
            <p className="text-sm text-gray-600 mb-1">Order Number</p>
            <p className="text-2xl font-bold text-amber-900">{order.orderNumber}</p>
          </div>
        </div>

        {/* Loyalty Points */}
        {order.user && (
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg shadow-lg p-6 mb-6 text-white">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-sm opacity-90 mb-1">Points Earned</p>
                <p className="text-3xl font-bold">+{order.pointsEarned}</p>
              </div>
              <div className="text-right">
                <p className="text-sm opacity-90 mb-1">Total Points</p>
                <p className="text-3xl font-bold">{order.user.loyaltyPoints}</p>
              </div>
            </div>
          </div>
        )}

        {/* Order Details */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Details</h2>
          
          <div className="mb-4">
            <p className="text-sm text-gray-600">Store</p>
            <p className="font-semibold text-gray-800">{order.store.name}</p>
            {order.store.address && (
              <p className="text-sm text-gray-600">{order.store.address}</p>
            )}
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">Status</p>
            <span className="inline-block bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </span>
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <h3 className="font-semibold text-gray-800 mb-3">Items</h3>
            {order.orderItems.map((item) => (
              <div key={item.id} className="mb-3 pb-3 border-b border-gray-100 last:border-0">
                <div className="flex justify-between items-start mb-1">
                  <span className="font-medium text-gray-800">
                    {item.quantity}x {item.menuItem.name}
                  </span>
                  <span className="text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
                <div className="text-sm text-gray-600">
                  {item.sweetness && <span>Sweetness: {item.sweetness} </span>}
                  {item.ice && <span>• Ice: {item.ice}</span>}
                  {item.addOns && (
                    <div>Add-ons: {JSON.parse(item.addOns).join(', ')}</div>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t border-gray-200 pt-4 mt-4">
            <div className="flex justify-between text-2xl font-bold text-gray-800">
              <span>Total</span>
              <span>${order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="space-y-3">
          <Link
            href="/menu"
            className="block w-full bg-amber-600 text-white text-center py-4 rounded-lg font-semibold hover:bg-amber-700 transition"
          >
            Order Again
          </Link>
          <Link
            href="/"
            className="block w-full bg-white text-amber-600 text-center py-4 rounded-lg font-semibold border-2 border-amber-600 hover:bg-amber-50 transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
