import React from 'react';
import Icon from '../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: "Shield",
      title: "Secure Shopping",
      description: "SSL encrypted checkout with 256-bit security"
    },
    {
      icon: "Truck",
      title: "Free Shipping",
      description: "Free delivery on orders over $75"
    },
    {
      icon: "RotateCcw",
      title: "Easy Returns",
      description: "30-day hassle-free return policy"
    },
    {
      icon: "Headphones",
      title: "24/7 Support",
      description: "Customer service available round the clock"
    }
  ];

  const testimonials = [
    {
      id: 1,
      name: "Sarah Johnson",
      rating: 5,
      comment: "Amazing quality and fast shipping! The corporate shirts fit perfectly and look professional.",
      avatar: "https://randomuser.me/api/portraits/women/32.jpg",
      verified: true
    },
    {
      id: 2,
      name: "Michael Chen",
      rating: 5,
      comment: "Great selection of men's footwear. The sneakers are comfortable and stylish.",
      avatar: "https://randomuser.me/api/portraits/men/45.jpg",
      verified: true
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      rating: 5,
      comment: "Love the women's collection! Excellent customer service and quick delivery.",
      avatar: "https://randomuser.me/api/portraits/women/28.jpg",
      verified: true
    }
  ];

  const securityBadges = [
    {
      name: "SSL Secured",
      icon: "Lock",
      description: "256-bit SSL encryption"
    },
    {
      name: "Verified Store",
      icon: "BadgeCheck",
      description: "Trusted by 50,000+ customers"
    },
    {
      name: "Secure Payment",
      icon: "CreditCard",
      description: "Multiple payment options"
    }
  ];

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Icon
        key={index}
        name="Star"
        size={14}
        className={`${
          index < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  return (
    <section className="py-16 bg-background">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        {/* Trust Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {trustFeatures?.map((feature, index) => (
            <div key={index} className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name={feature?.icon} size={32} className="text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">
                {feature?.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature?.description}
              </p>
            </div>
          ))}
        </div>

        {/* Customer Testimonials */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              What Our Customers Say
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of satisfied customers who trust JPATHNEC
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials?.map((testimonial) => (
              <div key={testimonial?.id} className="bg-card p-6 rounded-lg shadow-elevation-sm">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial?.avatar}
                    alt={testimonial?.name}
                    className="w-12 h-12 rounded-full object-cover mr-4"
                  />
                  <div>
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold text-foreground">
                        {testimonial?.name}
                      </h4>
                      {testimonial?.verified && (
                        <Icon name="BadgeCheck" size={16} className="text-primary" />
                      )}
                    </div>
                    <div className="flex items-center gap-1 mt-1">
                      {renderStars(testimonial?.rating)}
                    </div>
                  </div>
                </div>
                <p className="text-muted-foreground italic">
                  "{testimonial?.comment}"
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Security Badges */}
        <div className="border-t border-border pt-12">
          <div className="text-center mb-8">
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Shop with Confidence
            </h3>
            <p className="text-muted-foreground">
              Your security and privacy are our top priorities
            </p>
          </div>

          <div className="flex flex-wrap justify-center items-center gap-8">
            {securityBadges?.map((badge, index) => (
              <div key={index} className="flex items-center gap-3 p-4 bg-muted rounded-lg">
                <Icon name={badge?.icon} size={24} className="text-primary" />
                <div>
                  <div className="font-medium text-foreground text-sm">
                    {badge?.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {badge?.description}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-12 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">50K+</div>
              <div className="text-sm text-muted-foreground">Happy Customers</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">1M+</div>
              <div className="text-sm text-muted-foreground">Products Sold</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">99.8%</div>
              <div className="text-sm text-muted-foreground">Satisfaction Rate</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <div className="text-sm text-muted-foreground">Customer Support</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrustSignals;
