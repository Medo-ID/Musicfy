"use client"

import * as RadixSlider from "@radix-ui/react-slider"

interface SliderProps{
    value?: number
    onChange?: (value: number) => void 
}

const Slider: React.FC<SliderProps> = ({value = 1, onChange}) => {
    const handleOnChange = (newValue: number[]) => {
        onChange?.(newValue[0])
    }

    return (

        <RadixSlider.Root
            className="relative flex items-center select-none touch-none w-full h-10"
            defaultValue={[1]}
            value={[value]}
            onValueChange={handleOnChange}
            max={1}
            step={0.1}
            aria-label="Valume"
        >
            <RadixSlider.Track
                className="bg-neutral-600 relative grow rounded-full h-[3px]"
            >
                <RadixSlider.Range
                    className="absolute bg-orange-500 rounded-full h-full"
                />
            </RadixSlider.Track>
                <RadixSlider.Thumb
                    className="block w-4 h-4 bg-orange-600 rounded-full"
                    aria-label="Volume"
                />
        </RadixSlider.Root>
    )
}

export default Slider