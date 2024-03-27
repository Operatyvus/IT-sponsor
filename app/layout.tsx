import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Footer from "./components/Footer/Footer";
import Navigation from "./components/Navigation/Navigation";
import Providers from "./api/utils/providers";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "IT rėmėjas",
  description: "Sujungiame IT projektus su specialistais",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
          <Providers>
            <Navigation />
            <div className="flex flex-col min-h-screen justify-center">
              <main className="flex-grow">
                {children}
              </main>
              <Footer />
            </div>
          </Providers>
      </body>
    </html>
  );
}
