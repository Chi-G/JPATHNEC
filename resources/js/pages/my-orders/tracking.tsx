import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Package, Clock, Truck, CheckCircle, XCircle, MapPin } from 'lucide-react';
import Header from '../../components/ui/header';
import WhatsAppContact from '../../components/ui/whatsapp-contact';
import { format } from 'date-fns';

interface OrderItem {
  id: number;
  product_name: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  product_image: string;
  image_url: string;
  formatted_unit_price: string;
  formatted_total_price: string;
}

interface Order {
  id: number;
  order_number: string;
  status: string;
  total_amount: number;
  formatted_total: string;
  created_at: string;
  shipped_at?: string;
  delivered_at?: string;
  tracking_number?: string;
  status_updated_at?: string;
  current_location?: string;
  status_description?: string;
  shipping_address: {
    full_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
  };
  items: OrderItem[];
}

interface Props {
  order: Order;
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  cartCount: number;
}

export default function OrderTracking({ order, auth, cartCount }: Props) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />;
      case 'processing': return <Package className="h-4 w-4" />;
      case 'shipped': return <Truck className="h-4 w-4" />;
      case 'delivered': return <CheckCircle className="h-4 w-4" />;
      case 'cancelled': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'processing': return 'bg-blue-100 text-blue-800';
      case 'shipped': return 'bg-purple-100 text-purple-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getProgressPercentage = () => {
    switch(order.status) {
      case 'pending': return 25;
      case 'processing': return 50;
      case 'shipped': return 75;
      case 'delivered': return 100;
      case 'cancelled': 
      case 'refunded': return 0;
      default: return 25;
    }
  };

  // Generate status history from existing order data
  const generateStatusHistory = () => {
    const history = [];

    // Add creation status
    history.push({
      status: 'pending',
      timestamp: order.created_at,
      description: 'Order placed and confirmed',
      icon: <Clock className="h-4 w-4" />,
    });

    // Add shipped status if available
    if (order.shipped_at) {
      history.push({
        status: 'shipped',
        timestamp: order.shipped_at,
        description: `Order shipped${order.tracking_number ? ` (Tracking: ${order.tracking_number})` : ''}`,
        icon: <Truck className="h-4 w-4" />,
      });
    }

    // Add delivered status if available
    if (order.delivered_at) {
      history.push({
        status: 'delivered',
        timestamp: order.delivered_at,
        description: 'Order delivered successfully',
        icon: <CheckCircle className="h-4 w-4" />,
      });
    }

    // Add current status if different and status_updated_at exists
    if (order.status_updated_at && !['pending', 'shipped', 'delivered'].includes(order.status)) {
      history.push({
        status: order.status,
        timestamp: order.status_updated_at,
        description: order.status_description || order.status.charAt(0).toUpperCase() + order.status.slice(1),
        location: order.current_location,
        icon: getStatusIcon(order.status),
      });
    }

    return history.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
  };

  const statusHistory = generateStatusHistory();
  const progressPercentage = getProgressPercentage();

  return (
    <>
      <Head title={`Order Tracking - ${order.order_number}`} />
      <Header user={auth.user} cartCount={cartCount} />

      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <div className="flex items-center space-x-2 text-sm text-gray-500 mb-8">
            <Link href="/my-orders" className="hover:text-gray-700">
              My Orders
            </Link>
            <ChevronRight className="h-4 w-4" />
            <span className="text-gray-900 font-medium">#{order.order_number}</span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Status Header */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900">Order #{order.order_number}</h1>
                    <p className="text-sm text-gray-600 mt-1">
                      Placed on {format(new Date(order.created_at), 'MMMM dd, yyyy')}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.status)}`}>
                      {getStatusIcon(order.status)}
                      <span className="ml-2 capitalize">{order.status}</span>
                    </span>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Order Progress</span>
                    <span>{progressPercentage}%</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-blue-600 transition-all duration-300 ease-out"
                      style={{width: `${progressPercentage}%`}}
                    />
                  </div>
                </div>

                {order.tracking_number && (
                  <div className="mt-4 p-4 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-900">Tracking Number</p>
                    <p className="text-sm text-blue-700 font-mono mt-1">{order.tracking_number}</p>
                  </div>
                )}

                {order.current_location && (
                  <div className="mt-4 flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <span>Current Location: {order.current_location}</span>
                  </div>
                )}

                {order.status_description && (
                  <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">{order.status_description}</p>
                  </div>
                )}
              </div>

              {/* Order Timeline */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Timeline</h2>
                
                <div className="space-y-6">
                  {statusHistory.map((entry, index) => (
                    <div key={index} className="flex items-start space-x-4">
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm ${
                        index === 0 ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {entry.icon}
                      </div>
                      
                      <div className="flex-grow min-w-0">
                        <div className="flex items-center justify-between">
                          <h3 className="text-sm font-medium text-gray-900 capitalize">
                            {entry.status}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {format(new Date(entry.timestamp), 'MMM dd, yyyy HH:mm')}
                          </p>
                        </div>
                        
                        <p className="text-sm text-gray-600 mt-1">
                          {entry.description}
                        </p>
                        
                        {entry.location && (
                          <div className="flex items-center mt-2 text-xs text-gray-500">
                            <MapPin className="h-3 w-3 mr-1" />
                            {entry.location}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-6">Order Items</h2>
                
                <div className="space-y-4">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center space-x-4 py-4 border-b border-gray-200 last:border-b-0">
                      <img
                        src={item.image_url}
                        alt={item.product_name}
                        className="w-16 h-16 object-cover rounded-md"
                      />
                      
                      <div className="flex-grow">
                        <h3 className="text-sm font-medium text-gray-900">{item.product_name}</h3>
                        <p className="text-sm text-gray-600">Quantity: {item.quantity}</p>
                        <p className="text-sm text-gray-600">Price: {item.formatted_unit_price}</p>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{item.formatted_total_price}</p>
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-semibold text-gray-900">Total</span>
                    <span className="text-lg font-semibold text-gray-900">{order.formatted_total}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Contact Support */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Need Help?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Have questions about your order? Contact us directly for personalized assistance.
                </p>
                
                <WhatsAppContact
                  context="tracking"
                  orderId={order.order_number}
                  className="w-full justify-center"
                />
              </div>

              {/* Shipping Address */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Shipping Address</h3>
                <div className="text-sm text-gray-600 space-y-1">
                  <p className="font-medium text-gray-900">{order.shipping_address.full_name}</p>
                  <p>{order.shipping_address.address_line_1}</p>
                  {order.shipping_address.address_line_2 && (
                    <p>{order.shipping_address.address_line_2}</p>
                  )}
                  <p>
                    {order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}
                  </p>
                  <p>{order.shipping_address.country}</p>
                  {order.shipping_address.phone && (
                    <p className="pt-2 text-blue-600">{order.shipping_address.phone}</p>
                  )}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-lg shadow-sm border p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Summary</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order Date</span>
                    <span className="text-gray-900">{format(new Date(order.created_at), 'MMM dd, yyyy')}</span>
                  </div>
                  
                  {order.shipped_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Shipped Date</span>
                      <span className="text-gray-900">{format(new Date(order.shipped_at), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  
                  {order.delivered_at && (
                    <div className="flex justify-between">
                      <span className="text-gray-600">Delivered Date</span>
                      <span className="text-gray-900">{format(new Date(order.delivered_at), 'MMM dd, yyyy')}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between font-medium pt-2 border-t">
                    <span className="text-gray-900">Total</span>
                    <span className="text-gray-900">{order.formatted_total}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}