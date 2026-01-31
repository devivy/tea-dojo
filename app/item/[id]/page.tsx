'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useCart } from '@/lib/cart-context';
import Link from 'next/link';

interface MenuItem {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
}

const ADD_ONS = [
  { name: 'Tapioca Pearls', price: 0.8 },
  { name: 'Grass Jelly', price: 0.8 },
  { name: 'Pudding', price: 1.0 },
  { name: 'Aloe Vera', price: 0.8 },
];

export default function ItemPage() {
  const router = useRouter();
  const params = useParams();
  const { addItem } = useCart();
  const [item, setItem] = useState<MenuItem | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [sweetness, setSweetness] = useState('normal');
  const [ice, setIce] = useState('normal');
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [notes, setNotes] = useState('');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const id = params.id as string;
    fetch(`/api/menu/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setItem(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error('Error loading item:', error);
        setLoading(false);
      });
  }, [params.id]);

  const toggleAddOn = (addOnName: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addOnName)
        ? prev.filter((name) => name !== addOnName)
        : [...prev, addOnName]
    );
  };

  const calculateTotal = () => {
    if (!item) return 0;
    const addOnsTotal = selectedAddOns.reduce((sum, addOnName) => {
      const addOn = ADD_ONS.find((a) => a.name === addOnName);
      return sum + (addOn?.price || 0);
    }, 0);
    return (item.price + addOnsTotal) * quantity;
  };

  const handleAddToCart = () => {
    if (!item) return;

    addItem({
      menuItemId: item.id,
      name: item.name,
      price: item.price,
      quantity,
      sweetness,
      ice,
      addOns: selectedAddOns,
      notes: notes || undefined,
    });

    router.push('/menu');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-900"></div>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-xl text-gray-600 mb-4">Item not found</p>
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
        {/* Back Button */}
        <Link
          href="/menu"
          className="inline-flex items-center text-amber-600 hover:text-amber-700 mb-6"
        >
          ← Back to Menu
        </Link>

        {/* Item Card */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Item Image */}
          <div className="h-64 bg-gradient-to-br from-amber-200 to-orange-300 flex items-center justify-center">
            <span className="text-8xl">🍵</span>
          </div>

          {/* Item Details */}
          <div className="p-6">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{item.name}</h1>
            <p className="text-gray-600 mb-4">{item.description}</p>
            <p className="text-3xl font-bold text-amber-600 mb-6">
              ${item.price.toFixed(2)}
            </p>

            {/* Sweetness */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Sweetness Level
              </label>
              <div className="grid grid-cols-4 gap-2">
                {['normal', 'less', 'half', 'zero'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setSweetness(level)}
                    className={`py-2 px-4 rounded-lg border-2 transition ${
                      sweetness === level
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-gray-300 hover:border-amber-400'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Ice Level */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Ice Level
              </label>
              <div className="grid grid-cols-3 gap-2">
                {['normal', 'less', 'no'].map((level) => (
                  <button
                    key={level}
                    onClick={() => setIce(level)}
                    className={`py-2 px-4 rounded-lg border-2 transition ${
                      ice === level
                        ? 'border-amber-600 bg-amber-50 text-amber-900'
                        : 'border-gray-300 hover:border-amber-400'
                    }`}
                  >
                    {level.charAt(0).toUpperCase() + level.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Add-ons */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Add-ons
              </label>
              <div className="space-y-2">
                {ADD_ONS.map((addOn) => (
                  <label
                    key={addOn.name}
                    className="flex items-center justify-between p-3 border-2 border-gray-300 rounded-lg hover:border-amber-400 cursor-pointer transition"
                  >
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        checked={selectedAddOns.includes(addOn.name)}
                        onChange={() => toggleAddOn(addOn.name)}
                        className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500"
                      />
                      <span className="ml-3 text-gray-800">{addOn.name}</span>
                    </div>
                    <span className="text-amber-600 font-semibold">
                      +${addOn.price.toFixed(2)}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Special Instructions (Optional)
              </label>
              <textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Any special requests?"
                className="w-full p-3 border-2 border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
                rows={3}
              />
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Quantity
              </label>
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  -
                </button>
                <span className="text-2xl font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                >
                  +
                </button>
              </div>
            </div>

            {/* Add to Cart Button */}
            <button
              onClick={handleAddToCart}
              className="w-full bg-amber-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition"
            >
              Add to Cart - ${calculateTotal().toFixed(2)}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
