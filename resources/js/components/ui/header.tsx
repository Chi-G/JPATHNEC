import React, { useState, useRef, useEffect } from 'react';
import { Link, router } from '@inertiajs/react';
import Icon from '../AppIcon';
import Button from './button';
import Input from './input';
import { buildProductListUrl } from '../../utils/routes';

interface User {
  id: number;
  name: string;
  email: string;
}

interface HeaderProps {
  user?: User | null;
  cartCount?: number;
}

const Header: React.FC<HeaderProps> = ({ user = null, cartCount = 0 }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Get current cartCount from props or fallback to 0


  // Check if user is authenticated based on user prop
  const isAuthenticated = !!user;
  const searchRef = useRef<HTMLDivElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const categories = {
    mens: {
      label: "Men's",
      path: '/product-list/mens',
      subcategories: [
        { label: 'T-Shirts', path: '/product-list/mens?t=tshirts', icon: 'Shirt' },
        { label: 'Polos', path: '/product-list/mens?t=polos', icon: 'Shirt' },
        { label: 'Corporate Shirts', path: '/product-list/mens?t=corporate', icon: 'Briefcase' },
        { label: 'Trousers', path: '/product-list/mens?t=trousers', icon: 'Shirt' },
        { label: 'Pants', path: '/product-list/mens?t=pants', icon: 'Shirt' },
        { label: 'Shoes', path: '/product-list/mens?t=shoes', icon: 'Footprints' },
        { label: 'Sneakers', path: '/product-list/mens?t=sneakers', icon: 'Footprints' },
        { label: 'Sandals', path: '/product-list/mens?t=sandals', icon: 'Footprints' },
      ]
    },
    women: {
      label: "Women's",
      path: '/product-list/women',
      subcategories: [
        { label: 'T-Shirts', path: '/product-list/women?t=tshirts', icon: 'Shirt' },
        { label: 'Polos', path: '/product-list/women?t=polos', icon: 'Shirt' },
        { label: 'Corporate Shirts', path: '/product-list/women?t=corporate', icon: 'Briefcase' },
        { label: 'Trousers', path: '/product-list/women?t=trousers', icon: 'Shirt' },
        { label: 'Pants', path: '/product-list/women?t=pants', icon: 'Shirt' },
        { label: 'Shoes', path: '/product-list/women?t=shoes', icon: 'Footprints' },
        { label: 'Sneakers', path: '/product-list/women?t=sneakers', icon: 'Footprints' },
        { label: 'Sandals', path: '/product-list/women?t=sandals', icon: 'Footprints' },
        { label: 'Slippers', path: '/product-list/women?t=slippers', icon: 'Footprints' },
      ]
    }
  };

  const recentSearches = ['Summer dresses', 'Running shoes', 'Business shirts'];
  const suggestedCategories = ['New Arrivals', 'Sale Items', 'Trending Now'];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.visit(`/product-list?search=${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryHover = (category: string) => {
    setActiveDropdown(category);
  };

  const handleCategoryLeave = () => {
    setTimeout(() => setActiveDropdown(null), 150);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleLogin = () => {
    router.visit('/login');
  };

  const handleRegister = () => {
    router.visit('/register');
  };

  const handleLogout = () => {
    router.post('/logout', {}, {
      onSuccess: () => {
        // Logout successful, user will be redirected by Laravel
      }
    });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background border-b border-border shadow-elevation-sm">
      <div className="container mx-auto px-8 md:px-12 lg:px-16">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
            <img src="/logo.png" alt="JPATHNEC Logo" width={28} height={28} className="text-primary" />
            <span className="font-inter font-bold">JPATHNEC</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-8">
            {Object.entries(categories).map(([key, category]) => (
              <div
                key={key}
                className="relative"
                onMouseEnter={() => handleCategoryHover(key)}
                onMouseLeave={handleCategoryLeave}
                ref={activeDropdown === key ? dropdownRef : null}
              >
                <Link
                  href={category.path}
                  className="text-foreground hover:text-primary transition-hover font-medium"
                >
                  {category.label}
                </Link>

                {activeDropdown === key && (
                  <div className="absolute top-full left-0 mt-2 w-64 bg-popover border border-border rounded-lg shadow-elevation-md z-50 transition-modal">
                    <div className="p-4">
                      <h3 className="font-semibold text-foreground mb-3">{category.label}</h3>
                      <div className="grid grid-cols-1 gap-2">
                        {category.subcategories.map((sub, index) => (
                          <Link
                            key={index}
                            href={sub.path}
                            className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-hover"
                          >
                            <Icon name={sub.icon} size={16} className="text-muted-foreground" />
                            <span className="text-sm text-foreground">{sub.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Search, Account, Wishlist, Cart */}
          <div className="flex items-center space-x-4">
            {/* Desktop Search */}
            <div className="hidden lg:block relative" ref={searchRef}>
              <form onSubmit={handleSearch} className="relative">
                <Input
                  type="search"
                  placeholder="Search products..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchOpen(true)}
                  className="w-64 pl-10"
                />
                <Icon
                  name="Search"
                  size={18}
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                />
              </form>

              {isSearchOpen && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-popover border border-border rounded-lg shadow-elevation-md z-50">
                  <div className="p-4">
                    {recentSearches.length > 0 && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-muted-foreground mb-2">Recent Searches</h4>
                        {recentSearches.map((search, index) => (
                          <button
                            key={index}
                            onClick={() => setSearchQuery(search)}
                            className="block w-full text-left p-2 text-sm hover:bg-muted rounded transition-hover"
                          >
                            {search}
                          </button>
                        ))}
                      </div>
                    )}
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground mb-2">Suggested</h4>
                      {suggestedCategories.map((category, index) => (
                        <Link
                          key={index}
                          href={buildProductListUrl({
                            filter: category.toLowerCase().replace(' ', '-')
                          })}
                          className="block p-2 text-sm hover:bg-muted rounded transition-hover"
                        >
                          {category}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Icon name="Search" size={20} />
            </Button>

            {/* Account/Authentication - Only show login/register when not authenticated */}
            {!isAuthenticated && (
              <div className="flex items-center gap-2">
                <Button variant="ghost" onClick={handleLogin}>
                  Login
                </Button>
                <Button variant="outline" onClick={handleRegister}>
                  Register
                </Button>
              </div>
            )}

            {/* Wishlist */}
            <Link href="/wishlist">
              <Button variant="ghost" size="icon">
                <Icon name="Heart" size={20} />
              </Button>
            </Link>

            {/* Cart */}
            <Link href="/shopping-cart" className="relative">
              <Button variant="ghost" size="icon">
                <Icon name="ShoppingCart" size={20} />
                {cartCount && cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center font-mono">
                    {cartCount}
                  </span>
                )}
              </Button>
            </Link>

            {/* Profile - Only show when user is authenticated */}
            {isAuthenticated && user && (
              <div className="relative">
                <Button
                  variant="ghost"
                  onClick={() => setActiveDropdown(activeDropdown === 'profile' ? null : 'profile')}
                  className="relative flex items-center gap-2 px-3 py-2 h-10 rounded-lg hover:bg-muted transition-colors"
                  title={`Profile: ${user.name}`}
                >
                  <div className="relative">
                    <div className="w-8 h-8 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-sm">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 border-2 border-background rounded-full"></span>
                  </div>
                  <div className="hidden md:flex flex-col items-start">
                    <span className="text-sm font-medium text-foreground leading-none">
                      {user.name.split(' ')[0]}
                    </span>
                    <span className="text-xs text-muted-foreground leading-none mt-0.5">
                      Profile
                    </span>
                  </div>
                  <Icon name="ChevronDown" size={16} className="hidden md:block text-muted-foreground ml-1" />
                </Button>

                {activeDropdown === 'profile' && (
                  <div className="absolute top-full right-0 mt-2 w-56 bg-popover border border-border rounded-lg shadow-elevation-md z-50">
                    <div className="p-2">
                      <div className="px-3 py-3 border-b border-border">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                            <Icon name="User" size={20} className="text-primary" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="py-2">
                        <Link
                          href="/settings/profile"
                          className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-hover"
                        >
                          <Icon name="User" size={16} className="mr-3 text-muted-foreground" />
                          Manage Account
                        </Link>
                        <Link
                          href="/my-orders"
                          className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-hover"
                        >
                          <Icon name="Package" size={16} className="mr-3 text-muted-foreground" />
                          My Orders
                        </Link>
                        <Link 
                          href="/wishlist"
                          className="flex items-center px-3 py-2 text-sm text-foreground hover:bg-muted rounded transition-hover"
                        >
                          <Icon name="Heart" size={16} className="mr-3 text-muted-foreground" />
                          Wishlist
                        </Link>
                      </div>

                      <div className="py-2 border-t border-border">
                        <button
                          onClick={handleLogout}
                          className="flex items-center w-full px-3 py-2 text-sm text-destructive hover:bg-destructive/10 rounded transition-hover"
                        >
                          <Icon name="LogOut" size={16} className="mr-3" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden"
              onClick={toggleMobileMenu}
            >
              <Icon name={isMobileMenuOpen ? "X" : "Menu"} size={20} />
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <form onSubmit={handleSearch}>
              <Input
                type="search"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </form>
          </div>
        )}
      </div>
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 top-16 bg-background z-50 overflow-y-auto">
          <div className="p-4">
            {/* Mobile User Profile Section */}
            {isAuthenticated && user && (
              <div className="mb-6 p-4 bg-muted/30 rounded-lg border border-border/50">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="relative">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary/80 rounded-full flex items-center justify-center text-primary-foreground font-semibold text-lg">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <span className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-background rounded-full"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-base font-semibold text-foreground truncate">{user.name}</p>
                    <p className="text-sm text-muted-foreground truncate">{user.email}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <Link
                    href="/profile"
                    className="flex items-center justify-center p-2 bg-background rounded-md hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon name="User" size={16} className="mr-2" />
                    <span className="text-sm">Profile</span>
                  </Link>
                  <Link
                    href="/orders"
                    className="flex items-center justify-center p-2 bg-background rounded-md hover:bg-muted transition-colors"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Icon name="Package" size={16} className="mr-2" />
                    <span className="text-sm">Orders</span>
                  </Link>
                </div>

                <button
                  onClick={() => {
                    handleLogout();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full mt-2 flex items-center justify-center p-2 bg-destructive/10 text-destructive rounded-md hover:bg-destructive/20 transition-colors"
                >
                  <Icon name="LogOut" size={16} className="mr-2" />
                  <span className="text-sm">Sign Out</span>
                </button>
              </div>
            )}

            {Object.entries(categories).map(([key, category]) => (
              <div key={key} className="mb-6">
                <Link
                  href={category.path}
                  className="block text-lg font-semibold text-foreground mb-3"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.label}
                </Link>
                <div className="pl-4 space-y-2">
                  {category.subcategories.map((sub, index) => (
                    <Link
                      key={index}
                      href={sub.path}
                      className="flex items-center space-x-3 p-2 rounded-md hover:bg-muted transition-hover"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <Icon name={sub.icon} size={16} className="text-muted-foreground" />
                      <span className="text-foreground">{sub.label}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
