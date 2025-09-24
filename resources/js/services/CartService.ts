/**
 * API service for cart operations
 * This handles AJAX calls to Laravel API endpoints
 */

import { apiRoutes } from '../utils/routes';

interface CartItem {
  product_id: number;
  quantity: number;
  size?: string;
  color?: string;
}

interface ApiResponse {
  success: boolean;
  message: string;
  data?: unknown;
}

class CartService {
  /**
   * Add item to cart
   */
  static async addToCart(item: CartItem): Promise<ApiResponse> {
    try {
      const response = await fetch(apiRoutes.cartAdd, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        body: JSON.stringify(item),
      });

      return await response.json();
    } catch (error) {
      console.error('Error adding to cart:', error);
      return {
        success: false,
        message: 'Failed to add item to cart',
      };
    }
  }

  /**
   * Update cart item quantity
   */
  static async updateCartItem(itemId: number, quantity: number): Promise<ApiResponse> {
    try {
      const response = await fetch(apiRoutes.cartUpdate(itemId), {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
        body: JSON.stringify({ quantity }),
      });

      return await response.json();
    } catch (error) {
      console.error('Error updating cart item:', error);
      return {
        success: false,
        message: 'Failed to update cart item',
      };
    }
  }

  /**
   * Remove item from cart
   */
  static async removeFromCart(itemId: number): Promise<ApiResponse> {
    try {
      const response = await fetch(apiRoutes.cartRemove(itemId), {
        method: 'DELETE',
        headers: {
          'X-CSRF-TOKEN': this.getCsrfToken(),
        },
      });

      return await response.json();
    } catch (error) {
      console.error('Error removing from cart:', error);
      return {
        success: false,
        message: 'Failed to remove item from cart',
      };
    }
  }

  /**
   * Get CSRF token for Laravel
   */
  private static getCsrfToken(): string {
    const token = document.querySelector('meta[name="csrf-token"]')?.getAttribute('content');
    if (!token) {
      console.warn('CSRF token not found. Make sure it\'s included in your layout.');
      return '';
    }
    return token;
  }
}

export default CartService;