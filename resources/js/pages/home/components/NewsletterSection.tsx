import React, { useState } from 'react';
import { router } from '@inertiajs/react';
// import toast from 'react-hot-toast';
import Input from '../../../components/ui/input';
import Button from '../../../components/ui/button';
import Icon from '../../../components/AppIcon';

interface Benefit {
  icon: string;
  title: string;
  description: string;
}

const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');

    if (!email) {
      setError('Please enter your email address');
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);

    router.post(
      '/newsletter',
      { email },
      {
        onSuccess: () => {
          setIsSubscribed(true);
          setIsLoading(false);
          setEmail('');
        //   toast.success('Newsletter subscription successful');
        },
        onError: (errors?: Record<string, string[] | string>) => {
          setIsLoading(false);
          const emailErrors = errors && (errors.email as string[] | string | undefined);
          if (emailErrors) {
            if (Array.isArray(emailErrors)) setError(emailErrors[0] || 'Invalid email');
            else setError(String(emailErrors));
          } else {
            setError('Failed to subscribe. Please try again.');
          }
        },
      }
    );
  };

  const benefits: Benefit[] = [
    {
      icon: "Tag",
      title: "Exclusive Discounts",
      description: "Get up to 30% off on new arrivals"
    },
    {
      icon: "Zap",
      title: "Early Access",
      description: "Be the first to shop new collections"
    },
    {
      icon: "Gift",
      title: "Special Offers",
      description: "Receive personalized deals and promotions"
    },
    {
      icon: "Bell",
      title: "Style Updates",
      description: "Stay updated with latest fashion trends"
    }
  ];

  if (isSubscribed) {
    return (
      <section className="py-16 bg-primary">
        <div className="container mx-auto px-8 md:px-12 lg:px-16">
          <div className="max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center mx-auto mb-6">
              <Icon name="Check" size={32} className="text-success-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-primary-foreground mb-4">
              Welcome to JPATHNEC!
            </h2>
            <p className="text-xl text-primary-foreground/90 mb-6">
              Thank you for subscribing to our newsletter. You'll receive exclusive offers and updates soon.
            </p>
            <Button
              variant="secondary"
              size="lg"
              onClick={() => setIsSubscribed(false)}
            >
              Subscribe Another Email
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-16 bg-primary">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
              Join the JPATHNEC Community
            </h2>
            <p className="text-xl text-primary-foreground/90 max-w-2xl mx-auto">
              Subscribe to our newsletter and be the first to know about new collections, exclusive offers, and style tips.
            </p>
          </div>

          {/* Benefits Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {benefits && benefits.length > 0 &&
              benefits.map((benefit: Benefit, index: number) => (
              <div key={index} className="text-center">
                <div className="w-12 h-12 bg-primary-foreground/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon name={benefit.icon} size={24} className="text-primary-foreground" />
                </div>
                <h3 className="font-semibold text-primary-foreground mb-2">
                  {benefit.title}
                </h3>
                <p className="text-sm text-primary-foreground/80">
                  {benefit.description}
                </p>
              </div>
              ))
            }
          </div>

          {/* Newsletter Form */}
          <div className="max-w-md mx-auto">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Input
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  className="bg-white"
                />
                {error && (
                  <p className="mt-2 text-sm text-destructive">{error}</p>
                )}
              </div>
              <Button
                type="submit"
                loading={isLoading}
                size="lg" 
                variant="secondary" 
                className="w-full"
                iconName="Mail"
                iconPosition="left"
              >
                Subscribe Now
              </Button>
            </form>

            <p className="text-center text-sm text-primary-foreground/70 mt-4">
              By subscribing, you agree to our Privacy Policy and Terms of Service. Unsubscribe at any time.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default NewsletterSection;
