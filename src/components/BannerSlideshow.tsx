import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';
import { BannerAdv } from '../types';
import { 
  ChevronLeft, 
  ChevronRight, 
  Sparkles, 
  ArrowRight, 
  Pause, 
  Play,
  Flame,
  Award,
  ShieldCheck,
  TrendingUp
} from 'lucide-react';

interface BannerSlideshowProps {
  className?: string;
  autoplayIntervalMs?: number;
  onBannerCtaClick?: (banner: BannerAdv) => void;
}

export const BannerSlideshow: React.FC<BannerSlideshowProps> = ({
  className = '',
  autoplayIntervalMs = 5000,
  onBannerCtaClick
}) => {
  const { banners, language, setOfferingFilter, setActiveTab } = useApp();
  
  // Filter only active banners sorted by display order
  const activeBanners = banners
    .filter(b => b.isActive)
    .sort((a, b) => a.order - b.order);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-advance slideshow
  useEffect(() => {
    if (!isPlaying || isHovered || activeBanners.length <= 1) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex(prev => (prev + 1) % activeBanners.length);
    }, autoplayIntervalMs);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, isHovered, activeBanners.length, autoplayIntervalMs, currentIndex]);

  if (activeBanners.length === 0) {
    return null;
  }

  const currentBanner = activeBanners[currentIndex] || activeBanners[0];

  const handleNext = () => {
    setCurrentIndex(prev => (prev + 1) % activeBanners.length);
  };

  const handlePrev = () => {
    setCurrentIndex(prev => (prev - 1 + activeBanners.length) % activeBanners.length);
  };

  const handleCta = (banner: BannerAdv) => {
    if (onBannerCtaClick) {
      onBannerCtaClick(banner);
      return;
    }

    // Default CTA action
    if (banner.ctaCategory) {
      setOfferingFilter(banner.ctaCategory);
    }
    if (banner.ctaLinkTab) {
      setActiveTab(banner.ctaLinkTab);
    } else {
      setActiveTab('marketplace');
    }

    // Smooth scroll down to products section if on page
    const productsEl = document.getElementById('products-section');
    if (productsEl) {
      productsEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div 
      className={`relative w-full rounded-3xl overflow-hidden shadow-2xl border border-slate-800 bg-slate-950 group select-none ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Slides Container */}
      <div className="relative min-h-[360px] sm:min-h-[420px] md:min-h-[460px] lg:min-h-[480px] w-full flex items-center overflow-hidden">
        
        {/* Slides rendering with crossfade and subtle zoom */}
        {activeBanners.map((banner, index) => {
          const isActive = index === currentIndex;
          return (
            <div
              key={banner.id}
              className={`absolute inset-0 w-full h-full transition-all duration-700 ease-out ${
                isActive 
                  ? 'opacity-100 z-10 scale-100' 
                  : 'opacity-0 z-0 scale-105 pointer-events-none'
              }`}
            >
              {/* Background Image */}
              <img
                src={banner.imageUrl}
                alt={banner.title}
                className="w-full h-full object-cover object-center"
              />

              {/* Gradient Overlays for High Legibility */}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent w-full md:w-3/4" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
              <div className="absolute inset-0 bg-radial-at-c from-transparent via-slate-950/20 to-slate-950/70" />

              {/* Slide Content */}
              <div className="relative z-20 h-full max-w-4xl px-6 sm:px-10 md:px-14 py-10 sm:py-16 flex flex-col justify-center space-y-4 sm:space-y-5">
                
                {/* Badge Tag */}
                {(banner.badge || banner.badgeKm) && (
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-gradient-to-r from-amber-500/20 to-blue-500/20 border border-amber-500/30 backdrop-blur-md self-start animate-in fade-in slide-in-from-bottom-2 duration-300">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                    <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-amber-300 drop-shadow-xs">
                      {language === 'km' && banner.badgeKm ? banner.badgeKm : banner.badge}
                    </span>
                  </div>
                )}

                {/* Banner Title */}
                <h2 className="text-2xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15] drop-shadow-md max-w-2xl">
                  {language === 'km' && banner.titleKm ? banner.titleKm : banner.title}
                </h2>

                {/* Banner Subtitle / Description */}
                <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-xl leading-relaxed drop-shadow-sm font-medium">
                  {language === 'km' && banner.subtitleKm ? banner.subtitleKm : banner.subtitle}
                </p>

                {/* Call to Action Button */}
                <div className="pt-2 sm:pt-4 flex flex-wrap items-center gap-3">
                  <button
                    onClick={() => handleCta(banner)}
                    className="group/btn relative px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl shadow-amber-500/25 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2.5 cursor-pointer"
                  >
                    <span>
                      {language === 'km' && banner.ctaTextKm ? banner.ctaTextKm : banner.ctaText}
                    </span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover/btn:translate-x-1" />
                  </button>

                  <div className="hidden sm:flex items-center gap-2 text-xs text-slate-400 bg-black/40 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-white/10 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
                    <span>NBC Bakong Verified · Escrow Protected</span>
                  </div>
                </div>

              </div>
            </div>
          );
        })}

      </div>

      {/* Navigation Arrows (Prev / Next) */}
      {activeBanners.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous slide"
            className="absolute left-3 sm:left-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-2xl bg-black/40 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md border border-white/15 transition-all hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 group-hover:opacity-100"
          >
            <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next slide"
            className="absolute right-3 sm:right-5 top-1/2 -translate-y-1/2 z-30 p-2.5 sm:p-3 rounded-2xl bg-black/40 hover:bg-black/80 text-white/80 hover:text-white backdrop-blur-md border border-white/15 transition-all hover:scale-110 active:scale-95 opacity-80 sm:opacity-0 group-hover:opacity-100"
          >
            <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </>
      )}

      {/* Bottom Bar: Slide Indicators & Controls */}
      <div className="absolute bottom-4 right-4 sm:bottom-6 sm:right-8 z-30 flex items-center gap-3 bg-black/60 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-white/10 shadow-lg">
        
        {/* Play / Pause Toggle */}
        <button
          onClick={() => setIsPlaying(!isPlaying)}
          title={isPlaying ? 'Pause slideshow' : 'Play slideshow'}
          className="text-white/70 hover:text-white transition-colors"
        >
          {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
        </button>

        {/* Slide Counter */}
        <span className="text-[11px] font-mono text-slate-300 font-bold">
          0{currentIndex + 1} / 0{activeBanners.length}
        </span>

        {/* Indicators Dots */}
        <div className="flex items-center gap-1.5 pl-1 border-l border-white/20">
          {activeBanners.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              aria-label={`Go to slide ${idx + 1}`}
              className={`transition-all rounded-full ${
                idx === currentIndex
                  ? 'w-6 h-2 bg-gradient-to-r from-amber-400 to-yellow-300'
                  : 'w-2 h-2 bg-white/30 hover:bg-white/60'
              }`}
            />
          ))}
        </div>
      </div>

    </div>
  );
};
