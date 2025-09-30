
# JPATHNEC - Fashion E-commerce Store

A modern full-stack e-commerce platform for men's and women's clothing, built with Laravel backend and React frontend using Inertia.js for seamless SPA experience.

---

**Note:** This project is currently under active development. The live store will be available soon at [https://jpathnec.com](https://jpathnec.com).

---

## 🚀 Features

- **Laravel 11** - Robust PHP framework with modern features
- **Inertia.js** - Modern monolithic development with SPA benefits
- **React 19** - Latest React with improved rendering and concurrent features
- **Vite** - Lightning-fast build tool and development server
- **TailwindCSS v4** - Latest utility-first CSS framework with CSS-first configuration
- **Radix UI** - Accessible component primitives for building the design system
- **Laravel Fortify** - Authentication scaffolding with 2FA support
- **MySQL Database** - Reliable relational database for product and user management
- **Responsive Design** - Mobile-first approach for optimal shopping experience
- **Modern UI Components** - Pre-built components for e-commerce functionality

## 📋 Prerequisites

- PHP 8.2 or higher
- Composer
- Node.js (v18.x or higher)
- MySQL 8.0 or higher
- WAMP/XAMPP or similar local development environment

## 🛠️ Installation

1. Clone the repository and install PHP dependencies:

   ```bash
   composer install
   ```

2. Install Node.js dependencies:

   ```bash
   npm install
   ```

3. Set up environment configuration:

   ```bash
   cp .env.example .env
   php artisan key:generate
   ```

4. Configure your database in `.env` file:

   ```env
   DB_CONNECTION=mysql
   DB_HOST=127.0.0.1
   DB_PORT=3306
   DB_DATABASE=jpathnec
   DB_USERNAME=root
   DB_PASSWORD=
   ```

5. Run database migrations:

   ```bash
   php artisan migrate
   ```

6. Start the development servers:

   ```bash
   # Terminal 1 - Laravel backend
   php artisan serve

   # Terminal 2 - Vite frontend
   npm run dev
   ```

## 📁 Project Structure

```text
jpathnec/
├── app/
│   ├── Http/Controllers/    # API and web controllers
│   ├── Models/             # Eloquent models (User, Product, Order, etc.)
│   └── Providers/          # Service providers
├── database/
│   ├── migrations/         # Database schema migrations
│   ├── seeders/           # Database seeders for sample data
│   └── factories/         # Model factories for testing
├── public/                # Public web assets
├── resources/
│   ├── css/               # Tailwind CSS styles
│   ├── js/                # React components and pages
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Inertia.js page components
│   │   ├── layouts/       # Layout components
│   │   └── types/         # TypeScript definitions
│   └── views/             # Blade templates
├── routes/
│   ├── web.php           # Web routes
│   ├── auth.php          # Authentication routes
│   └── settings.php      # Settings routes
├── .env                  # Environment configuration
├── composer.json         # PHP dependencies
├── package.json          # Node.js dependencies
└── vite.config.ts        # Vite configuration
```

## 🧩 Adding Routes & Pages

This project uses Inertia.js for routing. To add new pages:

1. **Create a Laravel route** in `routes/web.php`:

   ```php
   Route::get('/shop/{category?}', [ShopController::class, 'index'])->name('shop');
   Route::get('/product/{id}', [ProductController::class, 'show'])->name('product.show');
   ```

2. **Create an Inertia page component** in `resources/js/pages/`:

   ```tsx
   // resources/js/pages/Shop/Index.tsx
   import { Head } from '@inertiajs/react';
   import AppLayout from '@/layouts/AppLayout';

   export default function ShopIndex({ products, category }) {
     return (
       <AppLayout>
         <Head title={`Shop ${category || 'All'} - JPATHNEC`} />
         <div className="container mx-auto px-4">
           <h1>Shop {category}</h1>
           {/* Product grid */}
         </div>
       </AppLayout>
     );
   }
   ```

3. **Return the Inertia response** from your controller:

   ```php
   return Inertia::render('Shop/Index', [
     'products' => $products,
     'category' => $category,
   ]);
   ```

## 🎨 Styling & Components

This project uses **Tailwind CSS v4** with modern CSS-first configuration:

- **CSS-first theming** using `@theme` directive in `app.css`
- **Radix UI primitives** for accessible components
- **Custom design system** with consistent color palette and spacing
- **Dark mode support** with CSS custom properties
- **Responsive design** optimized for mobile-first shopping experience
- **Component library** built with shadcn/ui patterns

## 🛍️ E-commerce Features

- **Product Catalog** - Men's and women's clothing categories
- **Shopping Cart** - Session-based cart management
- **User Authentication** - Registration, login with 2FA support
- **Order Management** - Order history and tracking
- **Admin Dashboard** - Product and order management
- **Search & Filtering** - Find products by category, size, color, price
- **Responsive Design** - Optimized for mobile shopping

## 📦 Deployment

1. **Build frontend assets**:

   ```bash
   npm run build
   ```

2. **Optimize Laravel for production**:

   ```bash
   php artisan config:cache
   php artisan route:cache
   php artisan view:cache
   ```

3. **Set production environment variables** in `.env`:

   ```env
   APP_ENV=production
   APP_DEBUG=false
   ```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit changes: `git commit -am 'Add new feature'`
4. Push to branch: `git push origin feature/new-feature`
5. Submit a pull request

## 📄 License

This project is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).

---

**JPATHNEC** - Modern Fashion E-commerce Platform
Built with Laravel 11, Inertia.js, React 19, and Tailwind CSS v4
