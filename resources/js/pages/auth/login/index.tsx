import React, { useState } from 'react';
import { Link } from '@inertiajs/react';
import { useForm } from '@inertiajs/react';
import Header from '../../../components/ui/header';
import Button from '../../../components/ui/button';
import Input from '../../../components/ui/input';
import Icon from '../../../components/AppIcon';

interface LoginProps {
  canResetPassword?: boolean;
  status?: string;
}

interface LoginForm { 
  email: string;
  password: string;
  remember: boolean;
}

const Login: React.FC<LoginProps> = ({ canResetPassword = false, status }) => {
  const { data, setData, post, processing, errors, reset } = useForm<LoginForm>({
    email: '',
    password: '',
    remember: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    post('/login', {
      onFinish: () => reset('password'),
    });
  };

//   const handleSocialLogin = (provider: string) => {
//     // You can implement social login later
//     console.log(`Social login with ${provider}`);
//   };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      <Header />
      <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Login Form */}
            <div className="bg-background rounded-lg shadow-elevation-md p-8">
              <div className="text-center mb-8">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Icon name="ShoppingBag" size={32} className="text-primary" />
                  <h1 className="text-2xl font-bold text-foreground">Welcome Back</h1>
                </div>
                <p className="text-muted-foreground">
                  Sign in to your account to continue shopping
                </p>
              </div>

              {/* Status Message */}
              {status && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-sm text-green-700">{status}</p>
                </div>
              )}

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
                      Or sign in with email
                    </span>
                  </div>
                </div>
              </div> */}

              {/* Login Form */}
              <form onSubmit={handleSubmit} className="space-y-6">
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
                  {errors.password && (
                    <p className="mt-2 text-sm text-destructive">{errors.password}</p>
                  )}
                </div>

                <div className="flex items-center justify-between">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={data.remember}
                      onChange={(e) => setData('remember', e.target.checked)}
                      className="rounded border-gray-300 text-primary shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50"
                    />
                    <span className="ml-2 text-sm text-foreground">Remember me</span>
                  </label>

                  {canResetPassword && (
                    <Link
                      href="/forgot-password"
                      className="text-sm text-primary hover:underline"
                    >
                      Forgot password?
                    </Link>
                  )}
                </div>

                <Button
                  type="submit"
                  className="w-full"
                  disabled={processing}
                >
                  {processing ? (
                    <div className="flex items-center gap-2">
                      <Icon name="Loader2" size={18} className="animate-spin" />
                      Signing in...
                    </div>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Register Link */}
              <div className="mt-8 text-center">
                <p className="text-muted-foreground">
                  Don't have an account?{' '}
                  <Link
                    href="/register"
                    className="text-primary hover:underline font-medium transition-colors"
                  >
                    Create one here
                  </Link>
                </p>
              </div>
            </div>

            {/* Right Column - Benefits & Features */}
            <div className="space-y-6">
              {/* Welcome Back Section */}
              <div className="bg-background rounded-lg shadow-elevation-md p-6">
                <h3 className="text-lg font-semibold text-foreground mb-4">
                  Welcome Back!
                </h3>
                <p className="text-muted-foreground mb-4">
                  Access your account to enjoy personalized shopping experience and exclusive member benefits.
                </p>

                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                      <Icon name="Package" size={16} className="text-primary" />
                    </div>
                    <span className="text-sm text-foreground">Track your orders</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-secondary/10 rounded-full flex items-center justify-center">
                      <Icon name="Heart" size={16} className="text-secondary" />
                    </div>
                    <span className="text-sm text-foreground">Access your wishlist</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-accent/10 rounded-full flex items-center justify-center">
                      <Icon name="Percent" size={16} className="text-accent" />
                    </div>
                    <span className="text-sm text-foreground">Exclusive member discounts</span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <div className="bg-background rounded-lg shadow-elevation-md p-6">
                <div className="flex items-start space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <Icon name="Shield" size={16} className="text-green-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-foreground text-sm mb-1">Secure Login</h4>
                    <p className="text-xs text-muted-foreground">
                      Your account is protected with industry-standard encryption and security measures.
                    </p>
                  </div>
                </div>
              </div>

              {/* Customer Support */}
              <div className="bg-background rounded-lg shadow-elevation-md p-6">
                <h4 className="font-medium text-foreground text-sm mb-3">Need Help?</h4>
                <p className="text-xs text-muted-foreground mb-3">
                  Our customer support team is here to help you with any questions or issues.
                </p>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Icon name="MessageCircle" size={14} className="mr-1" />
                    Live Chat
                  </Button>
                  <Button variant="outline" size="sm">
                    <Icon name="Phone" size={14} className="mr-1" />
                    Call Us
                  </Button>
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

export default Login;
