"use client";
//@ts-ignore
import useSound from "use-sound";
import { Song } from "@/types";
import { MediaItem } from "./MediaItem";
import { LikeButton } from "./LikeButton";
import { BsPauseFill, BsPlayFill } from "react-icons/bs";
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai";
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2";
import { Slider } from "./ui/Slider";
import { usePlayer } from "@/hooks/usePlayer";
import { useState, useEffect, useRef } from "react";
import { setPlayerCookie } from "@/libs/helpers";

interface MusicPlayerContentProps {
  song: Song;
  songUrl: string;
}

export const MusicPlayerContent: React.FC<MusicPlayerContentProps> = ({
  song,
  songUrl,
}) => {
  const player = usePlayer();

  // Local UI state
  const [volume, setVolume] = useState<number>(1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [seconds, setSeconds] = useState(0);

  // Track whether the user (or autoplay-next) intends playback.
  // This prevents options changes (like volume) from auto-starting playback.
  const hasUserPlayedRef = useRef(false);

  const [play, { pause, sound, duration }] = useSound(songUrl, {
    volume,
    onplay: () => setIsPlaying(true),
    onend: () => {
      setIsPlaying(false);
      // Ensure next track will autoplay because this one ended while playing
      hasUserPlayedRef.current = true;
      onPlayNext();
    },
    onpause: () => {
      setIsPlaying(false);
      // user paused; clear intent
      hasUserPlayedRef.current = false;
    },
    format: ["mp3"],
  });

  // Keep cookie in sync (server reads this on refresh)
  useEffect(() => {
    setPlayerCookie({
      activeId: player.activeId,
      ids: player.ids,
      volume,
    });
  }, [player.activeId, player.ids, volume]);

  useEffect(() => {
    sound?.play();

    return () => {
      sound?.unload();
    };
  }, [sound]);

  useEffect(() => {
    if (!sound || !isPlaying) return;

    const id = setInterval(() => {
      setSeconds(sound.seek());
    }, 1000);

    return () => clearInterval(id);
  }, [sound, isPlaying]);

  const handlePlay = () => {
    // mark intent and toggle
    if (isPlaying) {
      // pausing: remove intent
      hasUserPlayedRef.current = false;
      pause();
    } else {
      hasUserPlayedRef.current = true;
      play();
    }
  };

  const toggleMute = () => {
    const next = volume === 0 ? 1 : 0;
    setVolume(next);
    player.setVolume(next);
  };

  const handleVolumeChange = (value: number) => {
    // only update volume and player store; do NOT set play intent
    setVolume(value);
    player.setVolume(value);
  };

  const handleSeek = (value: number) => {
    setSeconds(value);
    sound?.seek(value);
  };

  const onPlayNext = () => {
    if (!player.ids.length) return;

    // if currently playing, ensure next track should autoplay
    hasUserPlayedRef.current = isPlaying;

    const index = player.ids.indexOf(player.activeId!);
    player.setId(player.ids[index + 1] ?? player.ids[0]);
  };

  const onPlayPrevious = () => {
    if (!player.ids.length) return;

    hasUserPlayedRef.current = isPlaying;

    const index = player.ids.indexOf(player.activeId!);
    player.setId(player.ids[index - 1] ?? player.ids[player.ids.length - 1]);
  };

  // Keep local UI volume in sync with player store (set by cookie on initial load)
  useEffect(() => {
    if (typeof player.volume === "number" && player.volume !== volume) {
      setVolume(player.volume);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [player.volume]);

  const durationInSeconds = duration ? duration / 1000 : 0;
  const Icon = isPlaying ? BsPauseFill : BsPlayFill;
  const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave;

  return (
    <div className="flex flex-col h-full w-full px-2 md:px-5">
      {/* Main Controls Row */}
      <div className="flex justify-between items-center h-full w-full">
        {/* 1. Left: Media Info (Desktop & Mobile) */}
        <div className="flex w-full justify-start overflow-hidden min-w-37.5">
          <div className="flex items-center gap-x-4 max-w-full">
            <MediaItem data={song} />
            <div className="hidden sm:block">
              <LikeButton songId={song.id} />
            </div>
          </div>
        </div>

        {/* 2. Center: Playback Controls (Desktop Only) */}
        <div className="hidden md:flex flex-col items-center justify-center w-full max-w-100 lg:max-w-150 gap-y-2">
          <div className="flex items-center gap-x-6">
            <AiFillStepBackward
              onClick={onPlayPrevious}
              size={24}
              className="text-neutral-400 cursor-pointer hover:text-white transition"
            />
            <div
              onClick={handlePlay}
              className="h-9 w-9 flex items-center justify-center rounded-full bg-orange-600 cursor-pointer hover:scale-105 transition"
            >
              <Icon size={24} className="text-white" />
            </div>
            <AiFillStepForward
              onClick={onPlayNext}
              size={24}
              className="text-neutral-400 cursor-pointer hover:text-white transition"
            />
          </div>

          {/* Timeline Desktop */}
          <div className="flex items-center gap-x-3 w-full">
            <span className="text-[10px] text-neutral-400 min-w-8.75 text-right">
              {formatTime(seconds)}
            </span>
            <Slider
              value={seconds}
              max={durationInSeconds}
              step={1}
              onChange={handleSeek}
            />
            <span className="text-[10px] text-neutral-400 min-w-8.75">
              {formatTime(durationInSeconds)}
            </span>
          </div>
        </div>

        {/* 3. Right: Volume (Desktop) / Play Button (Mobile) */}
        <div className="flex w-full justify-end items-center">
          {/* Desktop Volume */}
          <div className="hidden md:flex items-center gap-x-2 w-30">
            <VolumeIcon
              onClick={toggleMute}
              className="cursor-pointer text-neutral-400 hover:text-white"
              size={25}
            />
            <Slider value={volume} onChange={(value) => setVolume(value)} />
          </div>

          {/* Mobile Mini-Controls */}
          <div className="flex md:hidden items-center gap-x-3">
            <LikeButton songId={song.id} />
            <div
              onClick={handlePlay}
              className="h-10 w-10 flex items-center justify-center rounded-full bg-white p-1 cursor-pointer"
            >
              <Icon size={30} className="text-black" />
            </div>
          </div>
        </div>
      </div>

      {/* 4. Bottom: Timeline (Mobile Only) */}
      <div className="md:hidden flex flex-col w-full pb-2 px-1">
        <Slider
          value={seconds}
          max={durationInSeconds}
          step={1}
          onChange={handleSeek}
        />
        <div className="flex justify-between w-full text-[10px] text-neutral-400 -mt-1">
          <span>{formatTime(seconds)}</span>
          <span>{formatTime(durationInSeconds)}</span>
        </div>
      </div>
    </div>
  );
};

// Helper to format 75 seconds into "1:15"
const formatTime = (secs: number) => {
  const minutes = Math.floor(secs / 60);
  const seconds = Math.floor(secs % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};
