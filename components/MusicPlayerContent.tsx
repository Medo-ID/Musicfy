"use client"
//@ts-ignore
import useSound from "use-sound"
import { Song } from "@/types"
import MediaItem from "./MediaItem"
import LikeButton from "./LikeButton"
import { BsPauseFill, BsPlayFill } from "react-icons/bs"
import { AiFillStepBackward, AiFillStepForward } from "react-icons/ai"
import { HiSpeakerXMark, HiSpeakerWave } from "react-icons/hi2"
import Slider from "./Slider"
import usePlayer from "@/hooks/usePlayer"
import { useState, useEffect } from "react"

interface MusicPlayerContentProps{
    song: Song
    songUrl: string
}

const MusicPlayerContent: React.FC<MusicPlayerContentProps> = ({song, songUrl}) => {
    const player = usePlayer()
    const [volume, setVolume] = useState<number>(1)
    const [isPlaying, setIsPlaying] = useState<boolean>(false)

    const Icon = isPlaying ? BsPauseFill : BsPlayFill
    const VolumeIcon = volume === 0 ? HiSpeakerXMark : HiSpeakerWave

    const onPlayNext = () => {
        if(player.ids.length === 0){
            return
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId)
        const nextSong = player.ids[currentIndex + 1]

        if(!nextSong){
            return player.setId(player.ids[0])
        }

        player.setId(nextSong)
    }
    
    const onPlayPrevious = () => {
        if(player.ids.length === 0){
            return
        }

        const currentIndex = player.ids.findIndex((id) => id === player.activeId)
        const previousSong = player.ids[currentIndex - 1]

        if(!previousSong){
            return player.setId(player.ids[player.ids.length-1])
        }

        player.setId(previousSong)
    }

    const [play, {pause, sound}] = useSound(
        songUrl,
        {
            volume: volume,
            onplay: () => setIsPlaying(true),
            onend: () => {
                setIsPlaying(false)
                onPlayNext()
            },
            onpause: () => setIsPlaying(false),
            format: ['mp3']
        }
    )

    useEffect(() => {
        sound?.play()

        return () => {
            sound?.unload()
        }
    }, [sound])

    const handlePlay = () => {
        if(!isPlaying){
            play()
        } else {
            pause()
        }
    }

    const toggleMute = () => {
        if(volume === 0){
            setVolume(1)
        } else {
            setVolume(0)
        }
    }

    return (
        <div className="flex justify-between md:flex md:justify-around h-full">
            <div className="flex w-full justify-start md:ml-5">
                <div className="flex items-center gap-x-4">
                    <MediaItem data={song} />
                    <LikeButton songId={song.id} />
                </div>
            </div>

            {/**Mobile view */}
            <div className="flex md:hidden col-auto w-full justify-end items-center">
                <div
                    onClick={handlePlay}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-600 p-1 cursor-pointer"
                >
                    <Icon size={30} className="text-white" />
                </div>
            </div>
            
            {/**Desktop view */}
            <div className="hidden h-full md:flex w-full max-w-[722px] justify-center items-center gap-x-6">
                
                <AiFillStepBackward
                    onClick={onPlayPrevious}
                    size={30}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
                
                <div
                    onClick={handlePlay}
                    className="h-10 w-10 flex items-center justify-center rounded-full bg-orange-600 p-1 cursor-pointer"
                >
                    <Icon size={30} className="text-white" />
                </div>
                
                <AiFillStepForward
                    onClick={onPlayNext}
                    size={30}
                    className="text-neutral-400 cursor-pointer hover:text-white transition"
                />
            
            </div>

            <div className="hidden md:flex md:mr-5 w-full justify-end pr-2">
                <div className="flex items-center gap-x-2 w-[120px]">
                    <VolumeIcon
                        onClick={toggleMute}
                        className="cursor-pointer"
                        size={30}
                    />
                    <Slider 
                        value={volume}
                        onChange={(value) => setVolume(value)}
                    />
                </div>
            </div>

        </div>
    
    )
}

export default MusicPlayerContent