"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { FaPlay } from "react-icons/fa";
import { BsShuffle } from "react-icons/bs";

import { Song } from "@/types";
import { useUser } from "@/hooks/useUser";
import { useOnPlay } from "@/hooks/useOnPlay";
import { useAuthModal } from "@/hooks/useAuthModal";
import { MediaItem } from "@/components/MediaItem";
import { LikeButton } from "@/components/LikeButton";

interface LikedContentProps {
  songs: Song[];
}

export function LikedContent({ songs }: LikedContentProps) {
  const router = useRouter();
  const authModal = useAuthModal();
  const { isLoading, user } = useUser();
  const [isMounted, setIsMounted] = useState(false);

  // hook likely handles the global player queue
  const onPlay = useOnPlay(songs);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
      authModal.onOpen();
    }
  }, [isLoading, user, router, authModal]);

  const handlePlay = (id?: string) => {
    // Play from the beginning or a specific ID
    onPlay(id || songs[0].id);
  };

  const handleShuffle = () => {
    const shuffled = shuffleSongs(songs);
    // Logic should pass the shuffled array to your player's queue state
    onPlay(shuffled[0].id);
  };

  if (!isMounted) return null;

  if (songs.length === 0) {
    return (
      <div className="flex flex-col gap-y-2 w-full px-6 text-neutral-400 text-center py-20">
        No liked songs.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-y-2 w-full p-6">
      {/* Action Header: Modern UI Pattern */}
      <div className="flex items-center gap-x-4 mb-8">
        <button
          onClick={() => handlePlay()}
          className="transition rounded-full flex items-center justify-center bg-orange-600 cursor-pointer hover:scale-105 p-4 group"
          aria-label="Play All"
        >
          <FaPlay
            className="text-black group-hover:scale-105 transition"
            size={20}
          />
        </button>
        <button
          onClick={handleShuffle}
          className="transition flex items-center justify-center text-neutral-400 hover:text-white"
          aria-label="Shuffle"
        >
          <BsShuffle size={24} />
        </button>
      </div>

      {/* Song List */}
      <div className="flex flex-col gap-y-2 w-full">
        {songs.map((song) => (
          <div key={song.id} className="flex items-center gap-x-4 w-full group">
            <div className="flex-1">
              <MediaItem onClick={(id: string) => handlePlay(id)} data={song} />
            </div>
            <LikeButton songId={song.id} />
          </div>
        ))}
      </div>
    </div>
  );
}

const shuffleSongs = (array: Song[]) => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};
