import Sidebar from "@/components/Sidebar";
import "./globals.css";
import type { Metadata } from "next";
import { Figtree } from "next/font/google";
import UserProvider from "@/providers/UserProvider";
import ModalProvider from "@/providers/ModalProvider";
import ToasterProvider from "@/providers/ToasterProvider";
import MusicPlayer from "@/components/MusicPlayer";
import { getActiveProductsWithPrices } from "@/actions/products-actions";
import { getSongsByUser } from "@/actions/songs-actions";

const font = Figtree({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Musicfy - Share & Discover New Music",
  description: "Listen and discover music!",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const userSongs = await getSongsByUser();
  const products = await getActiveProductsWithPrices();

  return (
    <html lang="en">
      <body className={font.className}>
        <ToasterProvider />
        <UserProvider>
          <ModalProvider products={products} />
          <Sidebar songs={userSongs}>{children}</Sidebar>
          <MusicPlayer />
        </UserProvider>
      </body>
    </html>
  );
}
