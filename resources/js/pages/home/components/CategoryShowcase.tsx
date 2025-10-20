import React from 'react';
import { Link } from '@inertiajs/react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';
import { Category } from '../../../types';

interface FeaturedItem {
  name: string;
  icon: string;
}

interface CategoryShowcaseProps {
  categories: Category[];
}

const CategoryShowcase: React.FC<CategoryShowcaseProps> = ({ categories }) => {
  const additionalCategories = [
    { name: 'New Arrivals', icon: 'Sparkles', link: '/product-list/new' },
    { name: 'Best Sellers', icon: 'TrendingUp', link: '/product-list/bestsellers' },
    { name: 'Sale Items', icon: 'Tag', link: '/product-list/sale' },
    { name: 'Premium', icon: 'Crown', link: '/product-list/premium' },
  ];

  const featuredItems: FeaturedItem[] = [
    { name: 'T-Shirts', icon: 'Shirt' },
    { name: 'Sneakers', icon: 'Footprints' },
    { name: 'Corporate', icon: 'Briefcase' },
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">Shop by Category</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collections designed for modern lifestyles
          </p>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories && categories.length > 0 ? (
            categories.map((category) => (
              <div
                key={category.id}
                className="group relative bg-card rounded-2xl overflow-hidden shadow-elevation-md hover:shadow-elevation-md transition-all duration-300"
              >
                <div className="relative h-64 md:h-80 overflow-hidden">
                  <Image
                    src={category.image}
                    alt={category.name}
                    // keep cover but prefer top of image so heads aren't cropped
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <div className="text-white">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-3 py-1 rounded-full text-sm font-medium bg-white/20">
                          200+ Products
                        </span>
                      </div>
                      <h3 className="text-2xl md:text-3xl font-bold mb-2">{category.name}</h3>
                      <p className="text-white/90 mb-4">{category.description}</p>
                      <div className="flex items-center gap-4 mb-6">
                        {featuredItems.map((item, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Icon name={item.icon} size={16} className="text-white/80" />
                            <span className="text-sm text-white/80">{item.name}</span>
                          </div>
                        ))}
                      </div>
                      <Link href={`/product-list/${category.id}`}>
                        <Button
                          variant="secondary"
                          size="lg"
                          iconName="ArrowRight"
                          iconPosition="right"
                          className="group-hover:scale-105 transition-transform"
                        >
                          Shop Now
                        </Button>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full text-center py-8">
              <p className="text-muted-foreground">No categories available at the moment.</p>
            </div>
          )}
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {additionalCategories.map((item, index) => (
            <Link
              key={index}
              href={item.link}
              className="group p-6 bg-card rounded-xl hover:bg-primary hover:text-primary-foreground transition-all duration-300 text-center"
            >
              <Icon
                name={item.icon}
                size={32}
                className="mx-auto mb-3 text-primary group-hover:text-primary-foreground transition-colors"
              />
              <h4 className="font-medium text-foreground group-hover:text-primary-foreground transition-colors">
                {item.name}
              </h4>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
