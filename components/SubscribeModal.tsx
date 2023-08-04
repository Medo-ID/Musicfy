"use client"

import { useState } from "react"
import { Price, ProductWithPrice } from "@/types"
import Modal from "./Modal"
import Button from "./Button"
import { useUser } from "@/hooks/useUser"
import toast from "react-hot-toast"
import { postData } from "@/libs/helpers"
import { getStripe } from "@/libs/stripeClient"
import useSubscribeModal from "@/hooks/useSubscribeModal"

interface SubscribeModalProps{
    products: ProductWithPrice[]
}

const priceFormat = (price: Price) => {
    const priceString = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: price.currency,
        minimumFractionDigits: 0
    }).format((price?.unit_amount || 0) / 100)

    return priceString
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({products}) => {
    const { user, isLoading, subscription } = useUser()
    const [priceIdLoading, setPriceIdLoading] = useState<string>()
    const subscribeModal = useSubscribeModal()

    const onChange = (open: boolean) => {
        if (!open) {
          subscribeModal.onClose();
        }
      }

    const handleCheckout = async(price: Price) => {
        setPriceIdLoading(price.id)

        if(!user){
            setPriceIdLoading(undefined)
            return toast.error('Must be logged in!')
        }

        if(subscription){
            setPriceIdLoading(undefined)
            return toast.error('You are already a premium member')
        }

        try {
            const { sessionId } = await postData({
                url: '/api/create-checkout-session',
                data: { price }
            })

            const stripe = await getStripe()
            stripe?.redirectToCheckout({ sessionId })
        } catch (error) {
            toast.error((error as Error)?.message)
        } finally {
            setPriceIdLoading(undefined)
        }
    }
    
    let content = (
        <div className="text-center">
            No products is available
        </div>
    )

    if(products.length){
        content = (
            <div>
                {products.map((product) => {
                    if(!product.prices?.length){
                        return (
                            <div key={product.id}>
                                No prices available
                            </div>
                        )
                    }

                    return product.prices.map((price) => (
                        <Button 
                            key={price.id}
                            onClick={() => handleCheckout(price)}
                            disabled={isLoading || price.id === priceIdLoading}
                            className="mb-4"
                        >
                            {`Subscribe for ${priceFormat(price)} a ${price.interval}`}
                        </Button>
                    ))
                })}
            </div>
        )
    }

    if(subscription){
        content = (
            <div className="text-center">
                You are already a Musicfy Premium member
            </div>
        )
    }

    return (
        <Modal
            title="Only for premium users"
            description="Listen to music with Musicfy Premium"
            isOpen
            onChange={onChange}
        >
            {content}
        </Modal>
    )
}

export default SubscribeModal