import Link from 'next/link';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Admin Header */}
      <header className="bg-amber-900 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Tea Dojo Admin</h1>
            <Link href="/" className="text-sm hover:underline">
              ← Back to Site
            </Link>
          </div>
        </div>
      </header>

      {/* Admin Navigation */}
      <nav className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex space-x-8">
            <Link
              href="/admin/menu"
              className="py-4 px-2 border-b-2 border-transparent hover:border-amber-600 transition text-gray-700 hover:text-amber-900 font-medium"
            >
              Menu
            </Link>
            <Link
              href="/admin/vouchers"
              className="py-4 px-2 border-b-2 border-transparent hover:border-amber-600 transition text-gray-700 hover:text-amber-900 font-medium"
            >
              Vouchers
            </Link>
            <Link
              href="/admin/analytics"
              className="py-4 px-2 border-b-2 border-transparent hover:border-amber-600 transition text-gray-700 hover:text-amber-900 font-medium"
            >
              Analytics
            </Link>
            <Link
              href="/admin/grab-sync"
              className="py-4 px-2 border-b-2 border-transparent hover:border-amber-600 transition text-gray-700 hover:text-amber-900 font-medium"
            >
              Grab Sync
            </Link>
          </div>
        </div>
      </nav>

      {/* Admin Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
