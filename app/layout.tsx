import Background from '@/components/background';
import { Geist } from "next/font/google";
import "./globals.css";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const metadata = {
  metadataBase: new URL(defaultUrl),
  title: "Next.js and Supabase Starter Kit",
  description: "The fastest way to build apps with Next.js and Supabase",
};

const geistSans = Geist({
  display: "swap",
  subsets: ["latin"],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={geistSans.className} suppressHydrationWarning>
      <body className="bg-background text-foreground">
        <Background />
        <main className="main-content">
          <div className="flex-1 w-full flex flex-col gap-20 items-center">
            <div className="flex flex-col gap-20 max-w-5xl p-5">
              {children}
            </div>
            <footer className="w-full flex items-center justify-center mx-auto text-center text-xs gap-8 py-16">
            </footer>
          </div>
        </main>
      </body>
    </html>
  );
}
