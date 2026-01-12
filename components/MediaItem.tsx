"use client";

import { useLoadImage } from "@/hooks/useLoadImage";
import { usePlayer } from "@/hooks/usePlayer";
import { Song } from "@/types";
import Image from "next/image";
import { useLayoutEffect, useRef, useState } from "react";

interface MediaItemProps {
  data: Song;
  onClick?: (id: string) => void;
}

export const MediaItem: React.FC<MediaItemProps> = ({ data, onClick }) => {
  const imageURL = useLoadImage(data);
  const player = usePlayer();

  const titleRef = useRef<HTMLParagraphElement>(null);
  const [titleMoveDistance, setTileMoveDistance] = useState(0);

  const authorRef = useRef<HTMLParagraphElement>(null);
  const [authorMoveDistance, setauthorMoveDistance] = useState(0);

  // useLayoutEffect ensures we measure after the DOM is rendered but before the user sees it
  useLayoutEffect(() => {
    const updateDistances = () => {
      if (titleRef.current) {
        const distance =
          titleRef.current.scrollWidth - titleRef.current.clientWidth;
        setTileMoveDistance(distance > 0 ? distance : 0);
      }
      if (authorRef.current) {
        const distance =
          authorRef.current.scrollWidth - authorRef.current.clientWidth;
        setauthorMoveDistance(distance > 0 ? distance : 0);
      }
    };

    updateDistances();

    // Handle window resizing to keep distances accurate
    window.addEventListener("resize", updateDistances);
    return () => window.removeEventListener("resize", updateDistances);
  }, [data.title, data.author]);

  const handleOnClick = () => {
    if (onClick) {
      return onClick(data.id);
    }

    return player.setId(data.id);
  };

  return (
    <div
      onClick={handleOnClick}
      className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
    >
      <div className="relative rounded-md min-h-12 min-w-12 overflow-hidden">
        <Image
          src={imageURL || "/images/music-placeholder.png"}
          alt="Media Item Image"
          fill
          className="object-cover"
          unoptimized
          loading="eager"
        />
      </div>
      <div className="flex flex-col gap-y-1 overflow-hidden max-w-50 md:max-w-91.25">
        <p
          ref={titleRef}
          className="text-white text-sm whitespace-nowrap sliding-animation"
          style={
            {
              // Inject the dynamic value as a CSS variable
              "--move-distance": `-${titleMoveDistance}px`,
            } as React.CSSProperties
          }
        >
          {data.title}
        </p>
        <p
          ref={authorRef}
          className="text-neutral-400 text-xs whitespace-nowrap sliding-animation"
          style={
            {
              // Inject the dynamic value as a CSS variable
              "--move-distance": `-${authorMoveDistance}px`,
            } as React.CSSProperties
          }
        >
          {data.author}
        </p>
      </div>
    </div>
  );
};
