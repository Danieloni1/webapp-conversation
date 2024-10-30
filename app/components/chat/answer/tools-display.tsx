import * as React from 'react'
import Image from 'next/image'

interface ToolsSectionProps {
    /**
     * Array of URLs pointing to tool/technology icons
     */
    Icons: string[]
    /**
     * Optional section title
     * @default "I Work With These Tools"
     */
    Title?: string
}

/**
 * A component that displays a collection of tools/technologies used
 * with a styled border and title
 */
export default function ToolsSection({
    Icons = [
        "assets/placeholder.svg"
    ],
    Title = "I Work With These Tools"
}: ToolsSectionProps) {
    return (
        <section className="w-full mx-auto p-4">
            <div className="relative pt-[10px]">
                <div className="relative border-2 border-dashed border-purple-500 rounded-[32px] p-8">
                    <div className="absolute -top-4 left-8">
                        <span className="relative block px-2 text-xl font-semibold bg-gray-100">
                            {Title}
                        </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-8 px-2">
                        {Icons.map((icon, index) => (
                            <div
                                key={index}
                                className="w-8 h-8 flex items-center justify-center"
                            >
                                <Image
                                    src={icon}
                                    alt={`Tool ${index + 1}`}
                                    width={32}
                                    height={32}
                                    className="w-full h-full object-contain"
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}