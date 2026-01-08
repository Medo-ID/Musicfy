import { Song } from "@/types";
import { createClient } from "@/utils/supabase/client";

const useLoadImage = (song: Song) => {
  const supabase = createClient();

  if (!song) {
    return null;
  }

  const { data: imageData } = supabase.storage
    .from("images")
    .getPublicUrl(song.image_path);

  return imageData.publicUrl;
};

export default useLoadImage;
