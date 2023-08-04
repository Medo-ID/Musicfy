"use client";

import { MoonLoader } from "react-spinners";

import Box from "@/components/Box";

const Loading = () => {
  return ( 
    <Box classname="h-full flex items-center justify-center">
      <MoonLoader color="#22c55e" size={40} />
    </Box>
  );
}
 
export default Loading;