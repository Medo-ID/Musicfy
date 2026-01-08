"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import useUploadModal from "@/hooks/useUploadModal";
import { useUser } from "@/hooks/useUser";

import Modal from "./Modal";
import Input from "./Input";
import Button from "./Button";
import { createClient } from "@/utils/supabase/client";

const UploadModal = () => {
  const uploadModal = useUploadModal();
  const { user } = useUser();
  const supabase = createClient();
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const { register, handleSubmit, reset } = useForm<FieldValues>({
    defaultValues: {
      author: "",
      title: "",
      song: null,
      image: null,
    },
  });

  const handleOnChange = (open: boolean) => {
    if (!open) {
      reset();
      uploadModal.onClose();
    }
  };

  const handleOnSubmit: SubmitHandler<FieldValues> = async (values) => {
    try {
      setIsLoading(true);

      const imageFile = values.image?.[0];
      const songFile = values.song?.[0];

      if (!imageFile || !songFile || !user) {
        toast.error("Missing fields");
        return;
      }

      const uniqueId = crypto.randomUUID();

      //UPLOAD SONGs TO SONGS BUCKET IN OUR SUPABASE STORAGE (GENERATE A PATH)
      const { data: songData, error: songError } = await supabase.storage
        .from("songs")
        .upload(`song-${values.title}-${uniqueId}`, songFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (songError) {
        setIsLoading(false);
        return toast.error("Failed to upload song");
      }

      //UPLOAD IMAGEs TO IMAGES BUCKET IN OUR SUPABASE STORAGE (GENERATE A PATH
      const { data: imageData, error: imageError } = await supabase.storage
        .from("images")
        .upload(`image-${values.title}-${uniqueId}`, imageFile, {
          cacheControl: "3600",
          upsert: false,
        });

      if (imageError) {
        setIsLoading(false);
        return toast.error("Failed to upload image");
      }

      //INSERT DATA IN OUR SUPABASE SONGS TABLE
      const { error: supabaseError } = await supabase.from("songs").insert({
        user_id: user.id,
        title: values.title,
        author: values.author,
        image_path: imageData.path,
        song_path: songData.path,
      });

      if (supabaseError) {
        setIsLoading(false);
        return toast.error(supabaseError.message);
      }

      router.refresh();
      setIsLoading(false);
      toast.success("Song Uploaded successfuly!");
      reset();
      uploadModal.onClose();
    } catch (error) {
      toast.error("Somthing went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Add a song"
      description="Upload your mp3 file here"
      isOpen={uploadModal.isOpen}
      onChange={handleOnChange}
    >
      <form
        onSubmit={handleSubmit(handleOnSubmit)}
        className="flex flex-col gap-y-4"
      >
        <Input
          id="title"
          disabled={isLoading}
          {...register("title", { required: true })}
          placeholder="Title"
        />

        <Input
          id="author"
          disabled={isLoading}
          {...register("author", { required: true })}
          placeholder="Author"
        />

        <div>
          <p className="pb-1">Upload your song</p>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept=".mp3"
            {...register("song", { required: true })}
          />
        </div>

        <div>
          <p className="pb-1">Upload your image</p>
          <Input
            id="song"
            type="file"
            disabled={isLoading}
            accept="image/*"
            {...register("image", { required: true })}
          />
        </div>

        <Button disabled={isLoading} type="submit">
          Upload Song
        </Button>
      </form>
    </Modal>
  );
};

export default UploadModal;
