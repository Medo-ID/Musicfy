import { Header } from "@/components/Header";
import SearchInput from "@/components/SearchInput";
import { SearchContent } from "./components/SearchContent";
import { getSongsByTitle } from "@/actions/songs-actions";

interface SearchProps {
  searchParams: Promise<{
    title: string;
  }>;
}

export default async function Search({ searchParams }: SearchProps) {
  const { title } = await searchParams;
  const songs = await getSongsByTitle(title);

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="bg-gradient-to-b from-neutral-600">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold">Search</h1>
          <SearchInput />
        </div>
      </Header>
      <SearchContent songs={songs} />
    </div>
  );
}
