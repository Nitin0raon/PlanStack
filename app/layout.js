import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inter } from 'next/font/google'
import Header from "@/components/header";
import { Toaster } from "sonner";
const inter=Inter({subsets:["latin"]})

export const metadata = {
  title: "PlanStack",
  description: "Project management app",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider 
    appearance={{
      elements:{
        formButtonPrimary:""
      }
    }}>
    <html lang="en">
      <body
        className={`${inter.className} dotted-background`}
      >
        <Header/>
        <main className="min-h-screen">{children}</main>
        <Toaster richColors/>
        <footer className=" bg-green-800 py-12 flex align-center justify-center">
          <div className="container mx-auto px-4 text-center">
            <p >this is footer</p>
          </div>
        </footer>
      </body>
    </html>
    </ClerkProvider>
  );
}
