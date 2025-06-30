import "./globals.css";
import Navbar from "../components/Navbar";
import { AuthProvider } from "@/contexts/AuthContext";

export const metadata = {
  title: "Business Card Manager",
  description: "Manage your business cards digitally",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="bg-gray-50 min-h-screen">
        <AuthProvider>
          <Navbar />
          <main className="pt-16">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
