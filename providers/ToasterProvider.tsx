"use client"

import { Toaster } from "react-hot-toast"

const ToasterProvider = () => {
  return (
    <Toaster 
        toastOptions={{
            duration: 3000,
            style: {
                background: '#333',
                color: '#fff'
            }
        }}
    />
  )
}

export default ToasterProvider