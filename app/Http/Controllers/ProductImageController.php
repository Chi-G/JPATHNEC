<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use App\Models\Product;
use App\Models\ProductImage;

class ProductImageController extends Controller
{
    /**
     * Upload product image
     */
    public function upload(Request $request, Product $product)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ]);

        if ($request->hasFile('image')) {
            $file = $request->file('image');
            
            // Generate unique filename
            $filename = 'product-' . $product->id . '-' . Str::random(8) . '.' . $file->getClientOriginalExtension();
            
            // Store in storage/app/public/products
            $path = $file->storeAs('products', $filename, 'public');
            
            // Create database record
            $productImage = ProductImage::create([
                'product_id' => $product->id,
                'image_path' => $path,
                'alt_text' => $product->name . ' Image',
                'is_primary' => ProductImage::where('product_id', $product->id)->count() === 0,
                'sort_order' => ProductImage::where('product_id', $product->id)->max('sort_order') + 1,
            ]);

            return response()->json([
                'success' => true,
                'image' => [
                    'id' => $productImage->id,
                    'url' => Storage::url($path),
                    'path' => $path,
                    'is_primary' => $productImage->is_primary,
                ]
            ]);
        }

        return response()->json(['success' => false, 'message' => 'No file uploaded'], 400);
    }

    /**
     * Delete product image
     */
    public function delete(ProductImage $productImage)
    {
        // Delete file from storage
        if (Storage::disk('public')->exists($productImage->image_path)) {
            Storage::disk('public')->delete($productImage->image_path);
        }

        // Delete database record
        $productImage->delete();

        return response()->json(['success' => true]);
    }

    /**
     * Set image as primary
     */
    public function setPrimary(ProductImage $productImage)
    {
        // Remove primary flag from other images
        ProductImage::where('product_id', $productImage->product_id)
            ->update(['is_primary' => false]);

        // Set this image as primary
        $productImage->update(['is_primary' => true]);

        return response()->json(['success' => true]);
    }
}