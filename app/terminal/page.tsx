'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Store {
  id: string;
  name: string;
}

interface MenuItem {
  id: string;
  name: string;
  price: number;
}

interface CartItem {
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

export default function TerminalPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [selectedStore, setSelectedStore] = useState<string>('');
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadStores();
    loadMenuItems();
  }, []);

  const loadStores = async () => {
    try {
      const response = await fetch('/api/terminal/stores');
      const data = await response.json();
      setStores(data);
      if (data.length > 0) {
        setSelectedStore(data[0].id);
      }
    } catch (error) {
      console.error('Error loading stores:', error);
    }
  };

  const loadMenuItems = async () => {
    try {
      const response = await fetch('/api/menu');
      const data = await response.json();
      setMenuItems(data);
    } catch (error) {
      console.error('Error loading menu:', error);
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.menuItemId === item.id);
      if (existing) {
        return prev.map((i) =>
          i.menuItemId === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          menuItemId: item.id,
          name: item.name,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  const removeFromCart = (menuItemId: string) => {
    setCart((prev) => prev.filter((item) => item.menuItemId !== menuItemId));
  };

  const updateQuantity = (menuItemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(menuItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.menuItemId === menuItemId ? { ...item, quantity } : item
      )
    );
  };

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleConfirmOrder = async () => {
    if (!selectedStore) {
      alert('Please select a store');
      return;
    }

    if (cart.length === 0) {
      alert('Cart is empty');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          storeId: selectedStore,
          items: cart,
          source: 'terminal',
        }),
      });

      const data = await response.json();

      if (response.ok) {
        alert(`Order ${data.order.orderNumber} created successfully!`);
        setCart([]);
      } else {
        alert(data.error || 'Failed to create order');
      }
    } catch (error) {
      alert('Error creating order');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-amber-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Tea Dojo POS Terminal</h1>
          <Link href="/" className="text-sm hover:underline">
            ← Back to Home
          </Link>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Menu Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Select Store
              </label>
              <select
                value={selectedStore}
                onChange={(e) => setSelectedStore(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
              >
                {stores.map((store) => (
                  <option key={store.id} value={store.id}>
                    {store.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold mb-4">Menu Items</h2>
              <div className="grid grid-cols-2 gap-4">
                {menuItems.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => addToCart(item)}
                    className="bg-amber-50 border-2 border-amber-200 rounded-lg p-4 hover:bg-amber-100 transition text-left"
                  >
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-amber-600 font-bold">${item.price.toFixed(2)}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Cart */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold mb-4">Current Order</h2>

              {cart.length === 0 ? (
                <p className="text-gray-500 text-center py-8">No items in cart</p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.menuItemId}
                        className="flex justify-between items-center border-b pb-2"
                      >
                        <div className="flex-1">
                          <p className="font-semibold text-sm">{item.name}</p>
                          <p className="text-xs text-gray-600">
                            ${item.price.toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center space-x-2">
                          <button
                            onClick={() =>
                              updateQuantity(item.menuItemId, item.quantity - 1)
                            }
                            className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            -
                          </button>
                          <span className="w-8 text-center font-semibold">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.menuItemId, item.quantity + 1)
                            }
                            className="w-6 h-6 bg-gray-200 rounded hover:bg-gray-300"
                          >
                            +
                          </button>
                          <button
                            onClick={() => removeFromCart(item.menuItemId)}
                            className="ml-2 text-red-500 hover:text-red-700"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t pt-4 mb-4">
                    <div className="flex justify-between text-2xl font-bold">
                      <span>Total</span>
                      <span className="text-amber-600">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <button
                    onClick={handleConfirmOrder}
                    disabled={loading}
                    className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:opacity-50"
                  >
                    {loading ? 'Processing...' : 'Confirm Order'}
                  </button>

                  <button
                    onClick={() => setCart([])}
                    className="w-full mt-2 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
                  >
                    Clear Cart
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
