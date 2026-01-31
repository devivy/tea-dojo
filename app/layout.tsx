import type { Metadata } from "next";
import "./globals.css";
import { CartProvider } from "@/lib/cart-context";
import { StoreProvider } from "@/lib/store-context";

export const metadata: Metadata = {
  title: "Tea Dojo - Premium Tea & Beverages",
  description: "Order your favorite tea drinks with loyalty rewards",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <StoreProvider>
          <CartProvider>
            {children}
          </CartProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
