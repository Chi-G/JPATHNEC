import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import Header from '../../../components/ui/header';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import Icon from '../../../components/AppIcon';

interface RegisterForm {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

const Register: React.FC = () => {
  const { data, setData, post, processing, errors, reset } = useForm<RegisterForm>({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/register', {
      onFinish: () => reset('password', 'password_confirmation'),
    });
  };

//   const handleSocialLogin = (provider: string) => {
//     // You can implement social login later
//     console.log(`Social login with ${provider}`);
//   };

  const getPasswordStrength = (password: string) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.match(/[a-z]/) && password.match(/[A-Z]/)) strength++;
    if (password.match(/\d/)) strength++;
    if (password.match(/[^a-zA-Z\d]/)) strength++;
    return strength;
  };

  const passwordStrength = getPasswordStrength(data.password);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Registration Form */}
            <div className="bg-background rounded-lg shadow-elevation-md p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Icon name="ShoppingBag" size={32} className="text-primary" />
                  <h1 className="text-2xl font-bold text-foreground">Join JPATHNEC</h1>
                </div>
                <p className="text-muted-foreground">
                  Create your account to unlock personalized shopping and exclusive offers
                </p>
              </div>

              {/* Social Login Options */}
              {/* <div className="mb-8">
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('google')}
                    className="flex items-center justify-center gap-2"
                  >
                    <Icon name="Chrome" size={18} />
                    Google
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => handleSocialLogin('facebook')}
                    className="flex items-center justify-center gap-2"
                  >
                    <Icon name="Facebook" size={18} />
                    Facebook
                  </Button>
                </div>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-background text-muted-foreground">
                      Or register with email
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Registration Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-foreground mb-2">
                    Full Name
                  </label>
                  <Input
                    id="name"
                    type="text"
                    value={data.name}
                    onChange={(e) => setData('name', e.target.value)}
                    placeholder="Enter your full name"
                    className={errors.name ? 'border-destructive' : ''}
                    required
                  />
                  {errors.name && (
                    <p className="mt-2 text-sm text-destructive">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-foreground mb-2">
                    Email Address
                  </label>
                  <Input
                    id="email"
                    type="email"
                    value={data.email}
                    onChange={(e) => setData('email', e.target.value)}
                    placeholder="Enter your email"
                    className={errors.email ? 'border-destructive' : ''}
                    required
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-foreground mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password"
                      type={showPassword ? 'text' : 'password'}
                      value={data.password}
                      onChange={(e) => setData('password', e.target.value)}
                      placeholder="Enter your password"
                      className={errors.password ? 'border-destructive pr-10' : 'pr-10'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPassword ? 'Hide password' : 'Show password'}
                    >
                      <Icon name={showPassword ? 'EyeOff' : 'Eye'} size={18} />
                    </button>
                  </div>

                  {/* Password Strength Indicator */}
                  {data.password && (
                    <div className="mt-2">
                      <div className="flex items-center space-x-2 mb-1">
                        <div className="flex space-x-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 w-4 rounded ${
                                i < passwordStrength
                                  ? passwordStrength <= 2
                                    ? 'bg-red-500'
                                    : passwordStrength === 3
                                    ? 'bg-yellow-500'
                                    : 'bg-green-500'
                                  : 'bg-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {passwordStrength <= 1 && 'Weak'}
                          {passwordStrength === 2 && 'Fair'}
                          {passwordStrength === 3 && 'Good'}
                          {passwordStrength === 4 && 'Strong'}
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Use at least 8 characters with a mix of letters, numbers & symbols
                      </p>
                    </div>
                  )}

                  {errors.password && (
                    <p className="mt-2 text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="password_confirmation" className="block text-sm font-medium text-foreground mb-2">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Input
                      id="password_confirmation"
                      type={showPasswordConfirmation ? 'text' : 'password'}
                      value={data.password_confirmation}
                      onChange={(e) => setData('password_confirmation', e.target.value)}
                      placeholder="Confirm your password"
                      className={errors.password_confirmation ? 'border-destructive pr-10' : 'pr-10'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPasswordConfirmation(!showPasswordConfirmation)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      aria-label={showPasswordConfirmation ? 'Hide password' : 'Show password'}
                    >
                      <Icon name={showPasswordConfirmation ? 'EyeOff' : 'Eye'} size={18} />
                    </button>
                  </div>
                  {errors.password_confirmation && (
                    <p className="mt-2 text-sm text-destructive">{errors.password_confirmation}</p>
                  )}
                </div>

                <div>
                  <label className="flex items-start space-x-3">
                    <input
                      type="checkbox"
                      required
                      className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 mt-1"
                    />
                    <span className="text-sm text-foreground">
                      I agree to the{' '}
                      <Link href="/terms" className="text-primary hover:underline">
                        Terms of Service
                      </Link>{' '}
                      and{' '}
                      <Link href="/privacy" className="text-primary hover:underline">
                        Privacy Policy
                      </Link>
                    </span>
                  </label>
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <Icon name="Loader2" size={18} className="animate-spin" />
                      Creating account...
                    </div>
                  ) : (
                    'Create Account'
                  )}
                </Button>
              </form>

              {/* Login Link */}
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Already have an account?{' '}
                  <Link
                    href="/login"
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column - Trust Signals & Benefits */}
            <div className="space-y-6">
              {/* Benefits Section */}
              <div className="bg-background rounded-lg shadow-elevation-md p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Member Benefits
                </h3>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Icon name="Percent" size={16} className="text-secondary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">Exclusive Discounts</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Get up to 20% off on your first order and access member-only sales
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <Icon name="Truck" size={16} className="text-accent" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">Free Shipping</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Enjoy free shipping on orders over ₦50 and priority delivery
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="Heart" size={16} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">Wishlist & Favorites</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        Save your favorite items and get notified when they go on sale
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-success/10 rounded-full flex items-center justify-center">
                      <Icon name="RotateCcw" size={16} className="text-success" />
                    </div>
                    <div>
                      <h4 className="font-medium text-foreground text-sm">Easy Returns</h4>
                      <p className="text-xs text-muted-foreground mt-1">
                        30-day hassle-free returns and exchanges with prepaid labels
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Security Section */}
              <div className="bg-background rounded-lg shadow-elevation-md p-6">
                <div className="flex items-start space-x-3 mb-4">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="Shield" size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm">Secure & Private</h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your personal information is protected with bank-level security
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Testimonial */}
              <div className="bg-background rounded-lg shadow-elevation-md p-6">
                <div className="flex items-center space-x-1 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Icon key={i} name="Star" size={16} className="text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-sm text-foreground mb-3">
                  "JPATHNEC has the best quality clothing at amazing prices. The customer service is outstanding and shipping is always fast!"
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Icon name="User" size={16} className="text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">Sarah Johnson</p>
                    <p className="text-xs text-muted-foreground">Verified Customer</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} JPATHNEC. All rights reserved.
            </p>
            <div className="flex items-center justify-center space-x-6 mt-4">
              <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Register;
