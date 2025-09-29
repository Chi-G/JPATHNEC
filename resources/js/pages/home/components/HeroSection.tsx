import React, { useState, useEffect } from 'react';
import { Link } from '@inertiajs/react';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';

interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  cta: string;
  link: string;
  badge?: string;
  alt?: string;
}

interface HeroSectionProps {
  heroSlides: HeroSlide[];
}

const HeroSection: React.FC<HeroSectionProps> = ({ heroSlides }) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 10000);

    return () => clearInterval(timer);
  }, [heroSlides.length]);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + heroSlides.length) % heroSlides.length);
  };

  return (
    <section className="relative h-[500px] md:h-[600px] overflow-hidden bg-gray-200">
      <div className="relative h-full">
        {heroSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === currentSlide ? 'opacity-100 visible' : 'opacity-0 invisible'
            }`}
          >
            <div className="relative h-full">
              <img
                src={slide.image}
                alt={slide.alt || slide.title}
                className="w-full h-full object-cover block"
              />
              <div className="absolute inset-0 bg-black/40"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="container mx-auto px-4">
                  <div className="max-w-2xl text-center text-white">
                    {slide.badge && (
                      <span className="inline-block px-4 py-2 bg-primary text-primary-foreground text-sm font-medium rounded-full mb-4">
                        {slide.badge}
                      </span>
                    )}
                    <h1 className="text-4xl md:text-6xl font-bold mb-4 font-inter">
                      {slide.title}
                    </h1>
                    <p className="text-xl md:text-2xl mb-4 font-medium">
                      {slide.subtitle}
                    </p>
                    <p className="text-lg mb-8 opacity-90">{slide.description}</p>
                    <Link href={slide.link}>
                      <Button size="lg" className="px-8 py-3 text-lg">
                        {slide.cta}
                        <Icon name="ArrowRight" size={20} className="ml-2" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white/20 hover:border-white/40 z-20 shadow-lg"
        aria-label="Previous slide"
      >
        <Icon name="ArrowLeft" size={24} className="text-white drop-shadow-sm" />
      </button>
      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 w-14 h-14 bg-black/30 hover:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center transition-all duration-300 border-2 border-white/20 hover:border-white/40 z-20 shadow-lg"
        aria-label="Next slide"
      >
        <Icon name="ArrowRight" size={24} className="text-white drop-shadow-sm" />
      </button>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`w-3 h-3 rounded-full transition-all duration-300 border border-white/30 ${
              index === currentSlide
                ? 'bg-white shadow-lg scale-110'
                : 'bg-white/50 hover:bg-white/70'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
};

export default HeroSection;
