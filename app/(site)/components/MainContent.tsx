"use client"

import SongItem from "@/components/SongItem"
import { Song } from "@/types"

interface MainContentProps{
    songs: Song[]
}

const MainContent: React.FC<MainContentProps> = ({songs}) => {
    if(songs.length === 0){
        return(
            <div className="mt-4 text-neutral-400 text-center text-base">
                No songs available yet
            </div>
        )
    }
  return (
    <div 
        className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            xl:grid-cols-5
            2xl:grid-cols-8
            gap-4
            mt-4
        "
    >
        {songs.map((song) => (
            <SongItem 
                key={song.id}
                onClick={() => {}}
                data={song}
            />
        ))}
    </div>
  )
}

export default MainContent