"use client";

import AuthModal from "@/components/AuthModal";
import { UploadModal } from "@/components/UploadModal";
import SubscribeModal from "@/components/SubscribeModal";
import { ProductWithPrice } from "@/types";

interface ModalProviderProps {
  products: ProductWithPrice[];
}

export function ModalProvider({ products }: ModalProviderProps) {
  return (
    <>
      <AuthModal />
      <UploadModal />
      <SubscribeModal products={products} />
    </>
  );
}
