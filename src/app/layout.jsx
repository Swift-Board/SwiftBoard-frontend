import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import NextTopLoader from "nextjs-toploader";
import Navbar from "@/components/Navbar";
import { ThemeProvider } from "./contexts/ThemeContext";
import { LocationProvider } from "./contexts/LocationContext";
import Footer from "@/components/Footer";
import { NotificationProvider } from "@/components/Notification";
import { AuthProvider } from "./contexts/AuthContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
// lt saeada
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
            <NotificationProvider>
              <AuthProvider>
                <Navbar />
                {children}
                <Footer />
              </AuthProvider>
            </NotificationProvider>
          </LocationProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
