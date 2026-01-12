"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Auth } from "@supabase/auth-ui-react";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { Modal } from "./ui/Modal";
import { useAuthModal } from "@/hooks/useAuthModal";
import { createClient } from "@/utils/supabase/client";

const AuthModal = () => {
  const supabase = createClient();
  const router = useRouter();
  const { onClose, isOpen } = useAuthModal();

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        onClose();
        router.refresh();
      }
    });

    return () => data.subscription.unsubscribe();
  }, [supabase, router, onClose]);

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };

  return (
    <Modal
      title="Welcome back"
      description="Login to your account"
      isOpen={isOpen}
      onChange={onChange}
    >
      <Auth
        supabaseClient={supabase}
        providers={["google", "github"]}
        magicLink
        theme="dark"
        appearance={{
          theme: ThemeSupa,
          variables: {
            default: {
              colors: {
                brand: "#404040",
                brandAccent: "rgb(234 88 12)",
                dividerBackground: "rgb(234 88 12)",
              },
              radii: {
                borderRadiusButton: "5px",
                inputBorderRadius: "5px",
              },
            },
          },
        }}
      />
    </Modal>
  );
};

export default AuthModal;
