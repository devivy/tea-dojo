'use client';

import { useEffect, useState } from 'react';

interface Voucher {
  code: string;
  title: string;
  description: string | null;
  type: string;
  value: number;
  minOrderValue: number;
  maxDiscount: number | null;
  usageLimit: number | null;
  usageCount: number;
  minOrders: number;
  expiresAt: string | null;
  isActive: boolean;
}

export default function AdminVouchersPage() {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showAIStudio, setShowAIStudio] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    title: '',
    description: '',
    type: 'percentage',
    value: '',
    minOrderValue: '0',
    maxDiscount: '',
    usageLimit: '',
    minOrders: '0',
    expiresAt: '',
  });

  const [aiStudioData, setAiStudioData] = useState({
    segment: '',
    goal: '',
  });

  const [aiGenerating, setAiGenerating] = useState(false);
  const [aiResult, setAiResult] = useState<any>(null);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const response = await fetch('/api/admin/vouchers');
      const data = await response.json();
      setVouchers(data);
      setLoading(false);
    } catch (error) {
      console.error('Error loading vouchers:', error);
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch('/api/admin/vouchers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          value: parseFloat(formData.value),
          minOrderValue: parseFloat(formData.minOrderValue),
          maxDiscount: formData.maxDiscount
            ? parseFloat(formData.maxDiscount)
            : null,
          usageLimit: formData.usageLimit
            ? parseInt(formData.usageLimit)
            : null,
          minOrders: parseInt(formData.minOrders),
          expiresAt: formData.expiresAt || null,
        }),
      });

      if (response.ok) {
        loadVouchers();
        resetForm();
      } else {
        alert('Failed to create voucher');
      }
    } catch (error) {
      alert('Error creating voucher');
    }
  };

  const handleToggleActive = async (code: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/vouchers/${code}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        loadVouchers();
      }
    } catch (error) {
      alert('Error updating voucher');
    }
  };

  const handleGenerateAIPromo = async () => {
    if (!aiStudioData.segment || !aiStudioData.goal) {
      alert('Please fill in both segment and goal');
      return;
    }

    setAiGenerating(true);

    try {
      const response = await fetch('/api/admin/vouchers/ai-generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(aiStudioData),
      });

      const data = await response.json();

      if (response.ok) {
        setAiResult(data);
      } else {
        alert('Failed to generate promo');
      }
    } catch (error) {
      alert('Error generating promo');
    } finally {
      setAiGenerating(false);
    }
  };

  const handleSaveAIPromo = () => {
    if (!aiResult) return;

    setFormData({
      code: aiResult.code,
      title: aiResult.title,
      description: aiResult.description,
      type: aiResult.type,
      value: aiResult.value.toString(),
      minOrderValue: aiResult.minOrderValue.toString(),
      maxDiscount: aiResult.maxDiscount?.toString() || '',
      usageLimit: aiResult.usageLimit?.toString() || '',
      minOrders: aiResult.minOrders.toString(),
      expiresAt: aiResult.expiresAt || '',
    });

    setShowAIStudio(false);
    setShowForm(true);
    setAiResult(null);
  };

  const resetForm = () => {
    setFormData({
      code: '',
      title: '',
      description: '',
      type: 'percentage',
      value: '',
      minOrderValue: '0',
      maxDiscount: '',
      usageLimit: '',
      minOrders: '0',
      expiresAt: '',
    });
    setShowForm(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Voucher Management</h2>
        <div className="space-x-2">
          <button
            onClick={() => setShowAIStudio(!showAIStudio)}
            className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
          >
            🤖 AI Promo Studio
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="bg-amber-600 text-white px-4 py-2 rounded-lg hover:bg-amber-700 transition"
          >
            {showForm ? 'Cancel' : '+ Add Voucher'}
          </button>
        </div>
      </div>

      {/* AI Promo Studio */}
      {showAIStudio && (
        <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4 text-purple-900">
            🤖 AI Promo Studio
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Let AI generate a targeted promotion based on your segment and goal
          </p>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Target Segment
              </label>
              <input
                type="text"
                value={aiStudioData.segment}
                onChange={(e) =>
                  setAiStudioData({ ...aiStudioData, segment: e.target.value })
                }
                placeholder="e.g., New customers, Loyal customers with 5+ orders"
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Campaign Goal
              </label>
              <input
                type="text"
                value={aiStudioData.goal}
                onChange={(e) =>
                  setAiStudioData({ ...aiStudioData, goal: e.target.value })
                }
                placeholder="e.g., Increase order frequency, Boost average order value"
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-purple-600 focus:outline-none"
              />
            </div>

            <button
              onClick={handleGenerateAIPromo}
              disabled={aiGenerating}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:opacity-50"
            >
              {aiGenerating ? 'Generating...' : '✨ Generate Promo'}
            </button>
          </div>

          {/* AI Result */}
          {aiResult && (
            <div className="mt-6 bg-white rounded-lg p-4 border-2 border-purple-300">
              <h4 className="font-bold text-lg mb-2">{aiResult.title}</h4>
              <p className="text-sm text-gray-600 mb-3">{aiResult.description}</p>
              <div className="grid grid-cols-2 gap-2 text-sm mb-4">
                <div>
                  <span className="font-semibold">Code:</span> {aiResult.code}
                </div>
                <div>
                  <span className="font-semibold">Type:</span> {aiResult.type}
                </div>
                <div>
                  <span className="font-semibold">Value:</span>{' '}
                  {aiResult.type === 'percentage'
                    ? `${aiResult.value}%`
                    : `$${aiResult.value}`}
                </div>
                <div>
                  <span className="font-semibold">Min Order:</span> $
                  {aiResult.minOrderValue}
                </div>
              </div>
              <div className="bg-purple-50 p-3 rounded mb-4">
                <p className="text-sm font-semibold mb-1">Push Copy:</p>
                <p className="text-sm">{aiResult.pushCopy}</p>
              </div>
              <button
                onClick={handleSaveAIPromo}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
              >
                Save as Voucher
              </button>
            </div>
          )}
        </div>
      )}

      {/* Manual Form */}
      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold mb-4">Add New Voucher</h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Code
                </label>
                <input
                  type="text"
                  value={formData.code}
                  onChange={(e) =>
                    setFormData({ ...formData, code: e.target.value.toUpperCase() })
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) =>
                    setFormData({ ...formData, title: e.target.value })
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
                rows={2}
              />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type
                </label>
                <select
                  value={formData.type}
                  onChange={(e) =>
                    setFormData({ ...formData, type: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
                >
                  <option value="percentage">Percentage</option>
                  <option value="fixed">Fixed Amount</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Value
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.value}
                  onChange={(e) =>
                    setFormData({ ...formData, value: e.target.value })
                  }
                  required
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Max Discount ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.maxDiscount}
                  onChange={(e) =>
                    setFormData({ ...formData, maxDiscount: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Min Order Value ($)
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.minOrderValue}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrderValue: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Usage Limit
                </label>
                <input
                  type="number"
                  value={formData.usageLimit}
                  onChange={(e) =>
                    setFormData({ ...formData, usageLimit: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Min Orders (Segment)
                </label>
                <input
                  type="number"
                  value={formData.minOrders}
                  onChange={(e) =>
                    setFormData({ ...formData, minOrders: e.target.value })
                  }
                  className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Date
              </label>
              <input
                type="date"
                value={formData.expiresAt}
                onChange={(e) =>
                  setFormData({ ...formData, expiresAt: e.target.value })
                }
                className="w-full p-2 border border-gray-300 rounded-lg focus:border-amber-600 focus:outline-none"
              />
            </div>

            <div className="flex space-x-2">
              <button
                type="submit"
                className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition"
              >
                Create Voucher
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Vouchers List */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Code
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Title
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Value
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Usage
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
            {vouchers.map((voucher) => (
              <tr key={voucher.code}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-bold text-gray-900">
                    {voucher.code}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {voucher.title}
                  </div>
                  <div className="text-sm text-gray-500">
                    {voucher.description}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {voucher.type}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {voucher.type === 'percentage'
                      ? `${voucher.value}%`
                      : `$${voucher.value}`}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">
                    {voucher.usageCount}
                    {voucher.usageLimit ? ` / ${voucher.usageLimit}` : ''}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      voucher.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {voucher.isActive ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <button
                    onClick={() =>
                      handleToggleActive(voucher.code, voucher.isActive)
                    }
                    className="text-blue-600 hover:text-blue-900"
                  >
                    {voucher.isActive ? 'Disable' : 'Enable'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
