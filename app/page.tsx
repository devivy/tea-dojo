import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-6xl font-bold text-amber-900 mb-4">🍵 Tea Dojo</h1>
        <p className="text-xl text-gray-700 mb-8">
          Premium Tea & Beverages with Loyalty Rewards
        </p>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">
            Select Your Store
          </h2>
          <div className="space-y-4">
            <Link
              href="/scan?store=store-orchard"
              className="block w-full bg-amber-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition"
            >
              Tea Dojo Orchard
              <p className="text-sm opacity-90">123 Orchard Road</p>
            </Link>
            <Link
              href="/scan?store=store-marina"
              className="block w-full bg-amber-600 text-white py-4 rounded-lg font-semibold text-lg hover:bg-amber-700 transition"
            >
              Tea Dojo Marina Bay
              <p className="text-sm opacity-90">456 Marina Bay Sands</p>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-2">🎯</div>
            <h3 className="font-bold text-gray-800 mb-2">Easy Ordering</h3>
            <p className="text-sm text-gray-600">
              Browse menu, customize drinks, and order in seconds
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-2">⭐</div>
            <h3 className="font-bold text-gray-800 mb-2">Loyalty Rewards</h3>
            <p className="text-sm text-gray-600">
              Earn points with every purchase and unlock rewards
            </p>
          </div>
          <div className="bg-white rounded-lg p-6 shadow-md">
            <div className="text-3xl mb-2">🎫</div>
            <h3 className="font-bold text-gray-800 mb-2">Exclusive Vouchers</h3>
            <p className="text-sm text-gray-600">
              Get special discounts and promotions
            </p>
          </div>
        </div>

        <div className="mt-8 space-x-4">
          <Link
            href="/admin/menu"
            className="text-amber-600 hover:underline text-sm"
          >
            Admin Panel
          </Link>
          <Link
            href="/terminal"
            className="text-amber-600 hover:underline text-sm"
          >
            POS Terminal
          </Link>
        </div>
      </div>
    </div>
  );
}
