"use client";

import { MoonLoader } from "react-spinners";

import Box from "@/components/Box";

const Loading = () => {
  return ( 
    <Box classname="h-full flex items-center justify-center">
      <MoonLoader color="rgb(234 88 12)" size={40} />
    </Box>
  );
}
 
export default Loading;