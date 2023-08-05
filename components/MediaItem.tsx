"use client"

import useLoadImage from "@/hooks/useLoadImage"
import usePlayer from "@/hooks/usePlayer"
import { Song } from "@/types"
import Image from "next/image"

interface MediaItemProps{
    data: Song
    onClick?: (id: string) => void
}

const MediaItem: React.FC<MediaItemProps> = ({ data, onClick}) => {
    const imageURL = useLoadImage(data)
    const player = usePlayer()

    const handleOnClick = () => {
        if(onClick){
            return onClick(data.id)
        }

        //TODO: DEFAULT TURN ON PLAYER
        return player.setId(data.id)
    }

  return (
    <div
        onClick={handleOnClick}
        className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md"
    >
        <div 
            className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden"
        >
            <Image 
                src={imageURL || '/images/music-placeholder.png'}
                alt="Media Item Image"
                fill
                className="object-cover"
            />
        </div>
        <div className="flex flex-col gap-y-1 overflow-hidden">
            <p className="text-white truncate">
                {data.title}
            </p>
            <p className="text-neutral-400 text-sm truncate">
                {data.author}
            </p>
        </div>
    </div>
  )
}

export default MediaItem