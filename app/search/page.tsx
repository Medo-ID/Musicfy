import getSongsBy_Title from "@/actions/getSongsBy_Title"
import Header from "@/components/Header"
import SearchInput from "@/components/SearchInput"
import SearchContent from "./components/SearchContent"

interface SearchProps{
    searchParams: {
        title: string
    }
}

export const revalidate = 0

const Search = async ({searchParams}: SearchProps) => {
    const songs = await getSongsBy_Title(searchParams.title)

    return (
        <div
            className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto"
        >
            <Header className="bg-gradient-to-b from-neutral-600">
                <div className="mb-2 flex flex-col gap-y-6">
                    <h1 className="text-white text-3xl font-semibold">
                        Search
                    </h1>
                    <SearchInput />
                </div>
            </Header>
            <SearchContent songs={songs} />
        </div>
    )
}

export default Search