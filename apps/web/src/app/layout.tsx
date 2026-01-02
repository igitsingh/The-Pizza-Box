import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { Toaster } from 'sonner';
import HolidayBanner from "@/components/HolidayBanner";
import CallbackButton from '@/components/CallbackButton';
import WhatsAppButton from '@/components/WhatsAppButton';

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "The Pizza Box – Best Pizza in Meerut | Top-Rated Pizza Delivery near me",
  description: "Order fresh, locally-made veg pizzas, burgers, & snacks from The Pizza Box, Meerut. #1 Rated for taste in Prabhat Nagar. Fast delivery & best prices. Check our menu!",
  openGraph: {
    title: "The Pizza Box – #1 Pizza Brand in Meerut",
    description: "Freshly made, loaded veg pizzas delivered hot across Meerut. Visit for best deals!",
    url: "https://thepizzabox.in",
    type: "website",
    siteName: "The Pizza Box",
    locale: "en_IN",
  },
  twitter: {
    card: "summary_large_image",
    title: "The Pizza Box Meerut | Best Pizza Delivery",
    description: "Fresh & affordable veg pizzas delivered in 30 mins. Order now!",
  },
  keywords: [
    "best pizza in meerut",
    "pizza delivery meerut",
    "top rated pizza prabhat nagar",
    "veg pizza meerut",
    "the pizza box meerut",
    "pizza under 200 meerut",
    "late night food delivery meerut",
    "best cheese burst pizza meerut",
    "paneer pizza meerut",
    "pizza online meerut"
  ],
  authors: [{ name: "The Pizza Box" }],
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    "name": "The Pizza Box",
    "image": "https://thepizzabox.in/logo.png",
    "url": "https://thepizzabox.in",
    "telephone": "+917014681829",
    "address": {
      "@type": "PostalAddress",
      "streetAddress": "Prabhat Nagar",
      "addressLocality": "Meerut",
      "addressRegion": "Uttar Pradesh",
      "postalCode": "250001",
      "addressCountry": "IN"
    },
    "geo": {
      "@type": "GeoCoordinates",
      "latitude": 28.9845,
      "longitude": 77.7064
    },
    "openingHoursSpecification": {
      "@type": "OpeningHoursSpecification",
      "dayOfWeek": [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ],
      "opens": "11:00",
      "closes": "23:59"
    },
    "menu": "https://thepizzabox.in/menu",
    "servesCuisine": ["Pizza", "Burgers", "Italian", "Vegetarian"],
    "priceRange": "₹₹",
    "paymentAccepted": "Cash, Credit Card, UPI, Digital Wallet",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "reviewCount": "1250",
      "bestRating": "5"
    }
  };

  return (
    <html lang="en">
      <head>
        <script src="https://checkout.razorpay.com/v1/checkout.js" async></script>
      </head>
      <body className={inter.className}>
        <JsonLd data={organizationSchema} />
        <HolidayBanner />
        <Navbar />
        <main className="min-h-screen bg-gray-50">{children}</main>
        <Footer />
        <CallbackButton />
        <WhatsAppButton />
        <Toaster />
      </body>
    </html>
  );
}
