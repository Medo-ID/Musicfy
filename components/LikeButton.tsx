"use client";

import useAuthModal from "@/hooks/useAuthModal";
import { useUser } from "@/hooks/useUser";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiFillHeart, AiOutlineHeart } from "react-icons/ai";

interface LikeButtonProps {
  songId: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({ songId }) => {
  const supabase = createClient();
  const router = useRouter();
  const authModal = useAuthModal();
  const { user } = useUser();

  const [isLiked, setIsLiked] = useState<boolean>(false);

  useEffect(() => {
    if (!user?.id) {
      return;
    }

    const fetchData = async () => {
      const { data, error } = await supabase
        .from("liked_songs")
        .select("*")
        .eq("user_id", user.id)
        .eq("song_id", songId)
        .single();

      if (!error && data) {
        setIsLiked(true);
      }
    };

    fetchData();
  }, [songId, supabase, user?.id]);

  const handleLike = async () => {
    if (!user) {
      return authModal.onOpen();
    }

    if (isLiked) {
      const { error } = await supabase
        .from("liked_songs")
        .delete()
        .eq("user_id", user.id)
        .eq("song_id", songId);

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(false);
      }
    } else {
      const { error } = await supabase.from("liked_songs").insert({
        song_id: songId,
        user_id: user.id,
      });

      if (error) {
        toast.error(error.message);
      } else {
        setIsLiked(true);
        toast.success("Song Liked!");
      }
    }

    router.refresh();
  };

  const Icon = isLiked ? AiFillHeart : AiOutlineHeart;

  return (
    <button onClick={handleLike} className="hover:opacity-75 transition">
      <Icon color={isLiked ? "rgb(234 88 12)" : "white"} size={25} />
    </button>
  );
};

export default LikeButton;
