import AppProvider from "@/context/AppProvider";
import "./globals.css";
import type { Metadata } from "next";
import { Roboto } from "next/font/google";

const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "AUSDC - Token Dashboard",
  description:
    "AUSD Token Dashboard allows you to track the transaction happening over AUSDC token on Base goerli network",
  authors: [
    { name: "Abhishek Upadhyay", url: "https://github.com/abhimarshal1" },
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={roboto.className}>
        <AppProvider>{children}</AppProvider>
      </body>
    </html>
  );
}
