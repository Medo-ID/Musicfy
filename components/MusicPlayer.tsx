"use client";

import { useGetSongById } from "@/hooks/useGetSongById";
import { useLoadSongUrl } from "@/hooks/useLoadSongUrl";
import { usePlayer } from "@/hooks/usePlayer";
import { MusicPlayerContent } from "./MusicPlayerContent";
import { useEffect } from "react";

export const MusicPlayer = ({ initialPlayerState }: any) => {
  const player = usePlayer();
  const { song } = useGetSongById(player.activeId);
  const songUrl = useLoadSongUrl(song!);

  useEffect(() => {
    if (!player.hydrated && initialPlayerState) {
      player.setInitialState(initialPlayerState);
    }
  }, [player, initialPlayerState]);

  if (!player.activeId) return null;

  if (!song || !songUrl || !player.activeId) {
    return null;
  }

  return (
    <div className="fixed bottom-0 bg-black w-full py-2 px-2">
      <MusicPlayerContent key={song.id} song={song} songUrl={songUrl} />
    </div>
  );
};
