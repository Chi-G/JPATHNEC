import React from 'react';
import { Link } from '@inertiajs/react';
import Image from '../../../components/AppImage';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';

interface FeaturedItem {
  name: string;
  icon: string;
}

interface Category {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  stats: string;
  featured: FeaturedItem[];
}

interface AdditionalCategory {
  name: string;
  icon: string;
  link: string;
}

const CategoryShowcase: React.FC = () => {
  const categories: Category[] = [
    {
      id: 'mens',
      title: "Men\\'s Collection",
      description: "Discover premium men\\'s apparel and footwear",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&h=400&fit=crop",
      link: "/product-list?category=mens",
      stats: "500+ Products",
      featured: [
        { name: "T-Shirts", icon: "Shirt" },
        { name: "Sneakers", icon: "Footprints" },
        { name: "Corporate", icon: "Briefcase" }
      ]
    },
    {
      id: 'womens',
      title: "Women\\'s Collection",
      description: "Elegant women\\'s fashion and accessories",
      image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg?w=600&h=400&fit=crop",
      link: "/product-list?category=womens",
      stats: "450+ Products",
      featured: [
        { name: "Polos", icon: "Shirt" },
        { name: "Sandals", icon: "Footprints" },
        { name: "Trousers", icon: "Shirt" }
      ]
    }
  ];

  return (
    <section className="py-16 bg-muted">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Shop by Category
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore our carefully curated collections designed for modern lifestyles
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {categories && categories.length > 0 ? (
            categories.map((category: Category) => (
            <div
              key={category.id}
              className="group relative bg-card rounded-2xl overflow-hidden shadow-elevation-md hover:shadow-elevation-md transition-all duration-300"
            >
              <div className="relative h-64 md:h-80 overflow-hidden">
                <Image
                  src={category.image}
                  alt={category.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />

                {/* Content Overlay */}
                <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                  <div className="text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="px-3 py-1 bg-white bg-opacity-20 rounded-full text-sm font-medium">
                        {category.stats}
                      </span>
                    </div>
                    <h3 className="text-2xl md:text-3xl font-bold mb-2">
                      {category.title}
                    </h3>
                    <p className="text-white/90 mb-4">
                      {category.description}
                    </p>

                    {/* Featured Items */}
                    <div className="flex items-center gap-4 mb-6">
                      {category.featured && category.featured.length > 0 &&
                        category.featured.map((item: FeaturedItem, index: number) => (
                        <div key={index} className="flex items-center gap-2">
                          <Icon name={item.icon} size={16} className="text-white/80" />
                          <span className="text-sm text-white/80">{item.name}</span>
                        </div>
                        ))
                      }
                    </div>

                    <Link href={category.link}>
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

        {/* Additional Categories */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-12">
          {(() => {
            const additionalCategories: AdditionalCategory[] = [
              { name: "New Arrivals", icon: "Sparkles", link: "/product-list?filter=new" },
              { name: "Best Sellers", icon: "TrendingUp", link: "/product-list?filter=bestsellers" },
              { name: "Sale Items", icon: "Tag", link: "/product-list?filter=sale" },
              { name: "Premium", icon: "Crown", link: "/product-list?filter=premium" }
            ];
            return additionalCategories.map((item: AdditionalCategory, index: number) => (
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
            ));
          })()}
        </div>
      </div>
    </section>
  );
};

export default CategoryShowcase;
