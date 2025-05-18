import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/header";
import Footer from "@/components/footer";

export const metadata: Metadata = {
  title: "React test",
  description: "lolololol",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col bg-gray-900 text-white">
          <Header/>
          <main className="flex-grow pt-32 px-6 lg:px-8 content-center">
            {children}
          </main>
          <Footer/>
        </div>
      </body>
    </html>
  );
}
