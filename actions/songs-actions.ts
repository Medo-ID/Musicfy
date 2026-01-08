"use server";

import { Song } from "@/types";
import { createClient } from "@/utils/supabase/server";

export async function getSongs(): Promise<Song[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
  }

  return (data as any) || [];
}

export async function getSongsByUser(): Promise<Song[]> {
  const supabase = await createClient();

  const { data: sessionData, error: sessionError } =
    await supabase.auth.getUser();

  if (sessionError) {
    console.log(sessionError.message);
    return [];
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .eq("user_id", sessionData.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
}

export async function getSongsByTitle(title: string): Promise<Song[]> {
  const supabase = await createClient();

  if (!title) {
    const allSongs = await getSongs();
    return allSongs;
  }

  const { data, error } = await supabase
    .from("songs")
    .select("*")
    .ilike("title", `%${title}`)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error.message);
  }

  return (data as any) || [];
}

export async function getLikedSong(): Promise<Song[]> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase
    .from("liked_songs")
    .select("*, songs(*)")
    .eq("user_id", user?.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.log(error);
    return [];
  }

  if (!data) {
    return [];
  }

  return data.map((item) => ({
    ...item.songs,
  }));
}
