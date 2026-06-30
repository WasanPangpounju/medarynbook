"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { slides as defaultSlides } from "@/data/content";
import type { Slide } from "@/data/content";

type HeroSlideshowProps = {
  slides?: Slide[];
};

export default function HeroSlideshow({ slides = defaultSlides }: HeroSlideshowProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const isHoveringRef = useRef(false);

  useEffect(() => {
    const interval = setInterval(() => {
      if (isHoveringRef.current) return;
      setCurrentIndex((prev) => (prev + 1) % slides.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [slides.length]);

  const goPrev = () => {
    setCurrentIndex((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const goNext = () => {
    setCurrentIndex((prev) => (prev + 1) % slides.length);
  };

  return (
    <div
      className="relative w-full"
      onMouseEnter={() => {
        isHoveringRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveringRef.current = false;
      }}
    >
      <div className="relative aspect-square w-full overflow-hidden rounded-sm">
        <div
          className="flex h-full transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {slides.map((slide) => (
            <a
              key={slide.src}
              href={slide.url}
              target="_blank"
              rel="noopener noreferrer"
              className="relative h-full w-full flex-shrink-0"
            >
              <Image
                src={slide.src}
                alt={slide.caption}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </a>
          ))}
        </div>

        <button
          type="button"
          onClick={goPrev}
          aria-label="ภาพก่อนหน้า"
          className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 transition-colors"
        >
          <ChevronLeft size={20} className="text-ink" />
        </button>
        <button
          type="button"
          onClick={goNext}
          aria-label="ภาพถัดไป"
          className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white rounded-full p-1.5 transition-colors"
        >
          <ChevronRight size={20} className="text-ink" />
        </button>
      </div>

      <div className="flex items-center justify-between border-t border-black/5 bg-white px-4 py-3">
        <span className="text-[12px] text-ink truncate pr-3">
          {slides[currentIndex]?.caption}
        </span>
        <div className="flex items-center gap-1.5 shrink-0">
          {slides.map((slide, index) => (
            <button
              key={slide.src}
              type="button"
              aria-label={`ไปยังภาพที่ ${index + 1}`}
              onClick={() => setCurrentIndex(index)}
              className={`h-2 transition-all duration-250 ${
                index === currentIndex
                  ? "w-[22px] rounded bg-sage"
                  : "w-2 rounded-full bg-sage/25"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
