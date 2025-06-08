import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "./contexts/ThemeContext";
import Navbar from "./components/Navbar";
import { LocationProvider } from "./contexts/LocationContext";

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
