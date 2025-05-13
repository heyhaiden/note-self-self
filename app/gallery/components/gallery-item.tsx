"use client"

import { useState } from "react"

type GalleryItem = {
  id: number
  title: string
  content: string
  artwork: {
    id: number
    image_url: string
    alt_text: string | null
  } | null
  is_screenshot: boolean
  screenshot_url: string | null
  created_at: string
  approved_at: string | null
}

interface GalleryItemProps {
  item: GalleryItem
}

export function GalleryItem({ item }: GalleryItemProps) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const totalSlides = 2 // Artwork and Text slides

  const imageSource =
    item.artwork?.image_url ||
    (item.is_screenshot && item.screenshot_url) ||
    `/placeholder.svg?height=400&width=400&query=minimalist abstract line art, black and white, ${item.id}`

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides)
  }

  return (
    <div className="border border-gray-200 h-full flex flex-col">
      <div className="aspect-square bg-gray-50 relative overflow-hidden group">
        {/* Artwork Slide */}
        <div 
          className={`absolute inset-0 transition-transform duration-500 ease-in-out ${
            currentSlide === 0 ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <img
            src={imageSource || "/placeholder.svg"}
            alt={item.artwork?.alt_text || `Abstract representation of note: ${item.content.substring(0, 30)}...`}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Text Slide */}
        <div 
          className={`absolute inset-0 transition-transform duration-500 ease-in-out bg-white p-8 ${
            currentSlide === 1 ? 'translate-x-0' : 'translate-x-full'
          }`}
        >
          <div className="h-full flex flex-col">
            <p className="text-base font-light leading-relaxed flex-grow whitespace-pre-wrap">
              {item.content}
            </p>
          </div>
        </div>

        {/* Navigation Arrows - Only show when there's content to navigate to */}
        {currentSlide === 0 && (
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="View text content"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        )}

        {currentSlide === 1 && (
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-white/80 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            aria-label="View artwork"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m15 18-6-6 6-6"/>
            </svg>
          </button>
        )}

        {/* Slide Indicators */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                currentSlide === index ? 'bg-black' : 'bg-gray-300'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      </div>

      <div className="p-6 flex flex-col flex-grow">
        <p className="text-base font-light leading-relaxed flex-grow line-clamp-2">{item.title || item.content}</p>
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
          <div className="w-12 h-[1px] bg-black"></div>
          <span className="text-xs font-light text-gray-500"></span>
        </div>
      </div>
    </div>
  )
} 