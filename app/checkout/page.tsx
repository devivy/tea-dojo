'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import { useStore } from '@/lib/store-context';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const { items, total, clearCart } = useCart();
  const { storeId } = useStore();

  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [voucherCode, setVoucherCode] = useState('');
  const [voucherDiscount, setVoucherDiscount] = useState(0);
  const [voucherError, setVoucherError] = useState('');
  const [voucherApplied, setVoucherApplied] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = total;
  const tax = subtotal * 0.08;
  const finalTotal = subtotal + tax - voucherDiscount;
  const pointsToEarn = Math.floor(finalTotal);

  const handleApplyVoucher = async () => {
    if (!voucherCode.trim()) return;

    setVoucherError('');
    setLoading(true);

    try {
      const response = await fetch('/api/vouchers/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: voucherCode.toUpperCase(),
          subtotal,
          userOrderCount: 0, // TODO: Fetch actual user order count
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setVoucherDiscount(data.discount);
        setVoucherApplied(true);
        setVoucherError('');
      } else {
        setVoucherError(data.error || 'Invalid voucher');
        setVoucherDiscount(0);
        setVoucherApplied(false);
      }
    } catch (error) {
      setVoucherError('Failed to validate voucher');
      setVoucherDiscount(0);
      setVoucherApplied(false);
    } finally {
      setLoading(false);
    }
  };

  const handlePlaceOrder = async () => {
    if (!storeId) {
      alert('Please select a store first');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId,
          items,
          voucherCode: voucherApplied ? voucherCode.toUpperCase() : null,
          userPhone: phone || null,
          userName: name || null,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        clearCart();
        router.push(`/order/${data.order.id}`);
      } else {
        alert(data.error || 'Failed to place order');
      }
    } catch (error) {
      alert('Failed to place order');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
        <div className="text-center">
          <p className="text-2xl text-gray-600 mb-6">Your cart is empty</p>
          <Link
            href="/menu"
            className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition"
          >
            Browse Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-amber-900 mb-8">Checkout</h1>

        {/* Customer Info */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Contact Information (Optional)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Provide your phone number to earn loyalty points!
          </p>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+65 9123 4567"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Voucher Code */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">
            Apply Voucher Code
          </h2>
          <div className="flex space-x-2">
            <input
              type="text"
              value={voucherCode}
              onChange={(e) => setVoucherCode(e.target.value.toUpperCase())}
              placeholder="Enter voucher code"
              disabled={voucherApplied}
              className="flex-1 p-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none disabled:bg-gray-100"
            />
            {!voucherApplied ? (
              <button
                onClick={handleApplyVoucher}
                disabled={loading || !voucherCode.trim()}
                className="bg-amber-600 text-white px-6 py-3 rounded-lg hover:bg-amber-700 transition disabled:opacity-50"
              >
                Apply
              </button>
            ) : (
              <button
                onClick={() => {
                  setVoucherApplied(false);
                  setVoucherDiscount(0);
                  setVoucherCode('');
                }}
                className="bg-red-500 text-white px-6 py-3 rounded-lg hover:bg-red-600 transition"
              >
                Remove
              </button>
            )}
          </div>
          {voucherError && (
            <p className="text-red-500 text-sm mt-2">{voucherError}</p>
          )}
          {voucherApplied && (
            <p className="text-green-600 text-sm mt-2">
              ✓ Voucher applied! You saved ${voucherDiscount.toFixed(2)}
            </p>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal ({items.length} items)</span>
              <span>${subtotal.toFixed(2)}</span>
            </div>
            {voucherDiscount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Voucher Discount</span>
                <span>-${voucherDiscount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span>${tax.toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between text-2xl font-bold text-gray-800">
                <span>Total</span>
                <span>${finalTotal.toFixed(2)}</span>
              </div>
            </div>
            {phone && (
              <div className="flex justify-between text-amber-600 font-semibold pt-2">
                <span>Points to Earn</span>
                <span>{pointsToEarn} points</span>
              </div>
            )}
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={loading}
          className="w-full bg-amber-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition disabled:opacity-50"
        >
          {loading ? 'Processing...' : 'Place Order'}
        </button>

        <Link
          href="/cart"
          className="block text-center text-amber-600 hover:underline mt-4"
        >
          ← Back to Cart
        </Link>
      </div>
    </div>
  );
}
