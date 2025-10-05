<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Wishlist;
use App\Models\Product;

class WishlistController extends Controller
{
    public function index(Request $request)
    {
        $user = Auth::user();
        
        $query = Wishlist::where('user_id', $user->id)
            ->with(['product' => function ($q) {
                $q->select('id', 'name', 'slug', 'price', 'compare_price', 'description', 
                          'category_id', 'brand', 'is_active', 'stock_quantity', 
                          'rating', 'review_count')
                  ->with(['images' => function ($imageQuery) {
                      $imageQuery->select('id', 'product_id', 'image_path', 'is_primary')
                                 ->orderBy('sort_order');
                  }, 'category:id,name']);
            }])
            ->whereHas('product') 
            ->orderBy('created_at', 'desc');

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->whereHas('product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }

        // Category filter
        if ($request->filled('category')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->whereHas('category', function ($categoryQuery) use ($request) {
                    $categoryQuery->where('name', $request->category);
                });
            });
        }

        // Brand filter
        if ($request->filled('brand')) {
            $query->whereHas('product', function ($q) use ($request) {
                $q->where('brand', $request->brand);
            });
        }

        $wishlistItems = $query->get();

        // Sort the results
        $sortBy = $request->get('sort', 'newest');
        switch ($sortBy) {
            case 'oldest':
                $wishlistItems = $wishlistItems->sortBy('created_at');
                break;
            case 'price_low':
                $wishlistItems = $wishlistItems->sortBy(function ($item) {
                    return $item->product->price;
                });
                break;
            case 'price_high':
                $wishlistItems = $wishlistItems->sortByDesc(function ($item) {
                    return $item->product->price;
                });
                break;
            case 'name':
                $wishlistItems = $wishlistItems->sortBy(function ($item) {
                    return $item->product->name;
                });
                break;
            default: // newest
                $wishlistItems = $wishlistItems->sortByDesc('created_at');
                break;
        }

        // Transform products data
        $products = $wishlistItems->map(function ($wishlistItem) {
            $product = $wishlistItem->product;
            return [
                'id' => $product->id,
                'name' => $product->name,
                'slug' => $product->slug,
                'price' => $product->price,
                'compare_price' => $product->compare_price,
                'description' => $product->description,
                'images' => $product->images->map(function ($image) {
                    return asset('storage/' . $image->image_path);
                })->toArray(),
                'category' => $product->category ? $product->category->name : 'Uncategorized',
                'brand' => $product->brand,
                'in_stock' => $product->inStock(),
                'stock_quantity' => $product->stock_quantity,
                'rating' => $product->rating ?? 0,
                'reviews_count' => $product->review_count ?? 0,
                'added_to_wishlist_at' => $wishlistItem->created_at->toISOString(),
            ];
        })->values();

        // Get unique categories and brands for filters
        $categories = Wishlist::where('user_id', $user->id)
            ->whereHas('product')
            ->with(['product.category:id,name'])
            ->get()
            ->pluck('product.category.name')
            ->unique()
            ->filter()
            ->sort()
            ->values();

        $brands = Wishlist::where('user_id', $user->id)
            ->whereHas('product')
            ->with('product:id,brand')
            ->get()
            ->pluck('product.brand')
            ->unique()
            ->filter()
            ->sort()
            ->values();

        return Inertia::render('wishlist/index', [
            'products' => $products,
            'categories' => $categories,
            'brands' => $brands,
            'filters' => [
                'search' => $request->search,
                'category' => $request->category,
                'brand' => $request->brand,
                'sort' => $sortBy,
            ],
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();
        $productId = $request->product_id;

        // Check if already in wishlist
        $existingItem = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($existingItem) {
            return response()->json([
                'message' => 'Product is already in your wishlist',
                'in_wishlist' => true
            ], 409);
        }

        // Add to wishlist
        Wishlist::create([
            'user_id' => $user->id,
            'product_id' => $productId,
        ]);

        return response()->json([
            'message' => 'Product added to wishlist',
            'in_wishlist' => true
        ]);
    }

    public function destroy($productId)
    {
        $user = Auth::user();
        
        $wishlistItem = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if (!$wishlistItem) {
            return response()->json(['message' => 'Product not found in wishlist'], 404);
        }

        $wishlistItem->delete();

        if (request()->wantsJson()) {
            return response()->json([
                'message' => 'Product removed from wishlist',
                'in_wishlist' => false
            ]);
        }

        return redirect()->back()->with('success', 'Product removed from wishlist');
    }

    public function clear()
    {
        $user = Auth::user();
        
        Wishlist::where('user_id', $user->id)->delete();

        if (request()->wantsJson()) {
            return response()->json(['message' => 'Wishlist cleared']);
        }

        return redirect()->route('wishlist.index')->with('success', 'Wishlist cleared');
    }

    public function toggle(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
        ]);

        $user = Auth::user();
        $productId = $request->product_id;

        $wishlistItem = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->first();

        if ($wishlistItem) {
            // Remove from wishlist
            $wishlistItem->delete();
            return response()->json([
                'message' => 'Product removed from wishlist',
                'in_wishlist' => false
            ]);
        } else {
            // Add to wishlist
            Wishlist::create([
                'user_id' => $user->id,
                'product_id' => $productId,
            ]);
            return response()->json([
                'message' => 'Product added to wishlist',
                'in_wishlist' => true
            ]);
        }
    }

    public function check($productId)
    {
        $user = Auth::user();
        
        $inWishlist = Wishlist::where('user_id', $user->id)
            ->where('product_id', $productId)
            ->exists();

        return response()->json(['in_wishlist' => $inWishlist]);
    }
}