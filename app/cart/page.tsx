'use client';

import { useCart } from '@/lib/cart-context';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CartPage() {
  const router = useRouter();
  const { items, removeItem, updateQuantity, total, clearCart } = useCart();

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
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-amber-900">Your Cart</h1>
          <Link
            href="/menu"
            className="text-amber-600 hover:text-amber-700 hover:underline"
          >
            ← Continue Shopping
          </Link>
        </div>

        {/* Cart Items */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          {items.map((item, index) => (
            <div
              key={`${item.menuItemId}-${index}`}
              className="flex justify-between items-start border-b border-gray-200 py-4 last:border-0"
            >
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-800 mb-1">
                  {item.name}
                </h3>
                <div className="text-sm text-gray-600 space-y-1">
                  {item.sweetness && <p>Sweetness: {item.sweetness}</p>}
                  {item.ice && <p>Ice: {item.ice}</p>}
                  {item.addOns && item.addOns.length > 0 && (
                    <p>Add-ons: {item.addOns.join(', ')}</p>
                  )}
                  {item.notes && <p className="italic">Note: {item.notes}</p>}
                </div>
                <p className="text-amber-600 font-semibold mt-2">
                  ${item.price.toFixed(2)} each
                </p>
              </div>

              <div className="flex items-center space-x-4 ml-4">
                {/* Quantity Controls */}
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity - 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    -
                  </button>
                  <span className="font-semibold w-8 text-center">{item.quantity}</span>
                  <button
                    onClick={() => updateQuantity(item.menuItemId, item.quantity + 1)}
                    className="w-8 h-8 bg-gray-200 rounded hover:bg-gray-300 transition"
                  >
                    +
                  </button>
                </div>

                {/* Item Total */}
                <div className="w-20 text-right">
                  <p className="font-bold text-gray-800">
                    ${(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>

                {/* Remove Button */}
                <button
                  onClick={() => removeItem(item.menuItemId)}
                  className="text-red-500 hover:text-red-700 transition"
                >
                  ✕
                </button>
              </div>
            </div>
          ))}

          {/* Clear Cart Button */}
          <button
            onClick={clearCart}
            className="mt-4 text-sm text-red-500 hover:text-red-700 hover:underline"
          >
            Clear Cart
          </button>
        </div>

        {/* Order Summary */}
        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>${total.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Tax (8%)</span>
              <span>${(total * 0.08).toFixed(2)}</span>
            </div>
            <div className="border-t border-gray-300 pt-2 mt-2">
              <div className="flex justify-between text-xl font-bold text-gray-800">
                <span>Total</span>
                <span>${(total * 1.08).toFixed(2)}</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => router.push('/checkout')}
            className="w-full bg-amber-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition"
          >
            Proceed to Checkout
          </button>
        </div>
      </div>
    </div>
  );
}
