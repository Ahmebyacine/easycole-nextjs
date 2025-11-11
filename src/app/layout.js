import { Toaster } from "sonner";
import "./globals.css";
import { Cairo } from "next/font/google";

const cairoSans = Cairo({
  variable: "--font-cairo-sans",
  subsets: ["arabic"],
});

export const metadata = {
  title: "Easycole Next.js App",
  description: "Easycole LMS Platform built with Next.js",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body className={`${cairoSans.className} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
