"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { BsPlayFill, BsShuffle } from "react-icons/bs";

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
  const { isOpen, onOpen } = useAuthModal();
  const { isLoading, user } = useUser();

  // hook likely handles the global player queue
  const onPlay = useOnPlay(songs);

  useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/");
      onOpen();
    }
  }, [isLoading, user, router, isOpen, onOpen]);

  const handlePlay = (id?: string) => {
    // Play from the beginning or a specific ID
    onPlay(id || songs[0].id);
  };

  const handleShuffle = () => {
    const shuffled = shuffleSongs(songs);
    // Logic should pass the shuffled array to your player's queue state
    onPlay(shuffled[0].id);
  };

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
        <div
          onClick={() => handlePlay()}
          className="h-12 w-12 flex items-center justify-center rounded-full bg-orange-600 cursor-pointer hover:scale-105 transition"
        >
          <BsPlayFill size={32} className="text-white" />
        </div>
        <div
          onClick={handleShuffle}
          className="transition flex items-center justify-center text-neutral-400 hover:text-white cursor-pointer"
          aria-label="Shuffle"
        >
          <BsShuffle size={32} />
        </div>
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
