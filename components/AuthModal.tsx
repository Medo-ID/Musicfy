"use client"

import { useSessionContext, useSupabaseClient } from "@supabase/auth-helpers-react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Auth } from "@supabase/auth-ui-react"
import { ThemeSupa } from "@supabase/auth-ui-shared"

import Modal from "./Modal"
import useAuthModal from "@/hooks/useAuthModal"

const AuthModal = () => {
    const supabaseClient = useSupabaseClient()
    const {session} = useSessionContext()
    const router = useRouter()
    const {onClose, isOpen} = useAuthModal()

    useEffect(() => {
        if(session){
            router.refresh()
            onClose()
        }
    }, [session, onClose, router])
    

    const onChange = (open: boolean) => {
        if(!open){
            onClose()
        }
    }

    return (
        <Modal
            title="Welcome back"
            description="Login to your account"
            isOpen={isOpen}
            onChange={onChange}
        >
            <Auth 
                supabaseClient={supabaseClient}
                providers={['google', 'github']}
                magicLink
                theme="dark"
                appearance={{
                    theme: ThemeSupa,
                    variables: {
                        default: {
                            colors: {
                                brand: '#404040',
                                brandAccent: 'rgb(234 88 12)',
                                dividerBackground: 'rgb(234 88 12)'
                            },
                            radii: {
                                borderRadiusButton: '5px',
                                inputBorderRadius: '5px',
                            }
                        }
                    }
                }}
            />
        
        </Modal>
    )
}

export default AuthModal