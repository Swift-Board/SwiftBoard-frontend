import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import { LocationProvider } from "./contexts/LocationContext";
import NextTopLoader from "nextjs-toploader";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "SwiftBoard - Home",
  description: "Travel right, travel fast.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <NextTopLoader
          color="#8B0000"
          showSpinner={false}
          easing="ease"
          speed={200}
        />
        <ThemeProvider>
          <LocationProvider>
            <Navbar />
            {children}
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
