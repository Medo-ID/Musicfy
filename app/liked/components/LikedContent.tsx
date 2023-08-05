"use client"

import LikeButton from "@/components/LikeButton"
import MediaItem from "@/components/MediaItem"
import useAuthModal from "@/hooks/useAuthModal"
import useOnPlay from "@/hooks/useOnPlay"
import { useUser } from "@/hooks/useUser"
import { Song } from "@/types"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

interface LikedContentProps{
    songs: Song[]
}

const LikedContent: React.FC<LikedContentProps> = ({songs}) => {
    const router = useRouter()
    const authModal = useAuthModal()
    const { isLoading, user } = useUser()
    const onPlay = useOnPlay(songs)

    useEffect(() => {
        if(!isLoading && !user){
            router.replace('/')
            authModal.onOpen()
        }
    }, [isLoading, user, router])

    if(songs.length === 0){
        return (
            <div
                className="flex flex-col gap-y-2 w-full px-6 text-neutral-400 text-center text-base"
            >
                No liked songs
            </div>
        )
    }

    return (
        <div className="flex flex-col gap-y-2 w-full p-6">
            {songs.map((songs) => (
                <div
                    key={songs.id}
                    className="flex items-center gap-x-4 w-full"
                >
                    
                    <div className="flex-1">
                        <MediaItem 
                            onClick={(id: string) => onPlay(id)}
                            data={songs}
                        />
                    </div>
                    
                    <LikeButton songId={songs.id} />
                
                </div>
            ))}
        </div>
    )
}

export default LikedContent