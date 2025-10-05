import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Download, Eye, Package, Search, RefreshCw, Calendar, CreditCard, MapPin } from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    unit_price: number;
    total_price: number;
    size?: string;
    color?: string;
}

interface Order {
    id: number;
    order_number: string;
    status: string;
    payment_status: string;
    total_amount: number;
    currency: string;
    created_at: string;
    shipped_at?: string;
    delivered_at?: string;
    items_count: number;
    items?: OrderItem[];
    tracking_number?: string;
    payment_method?: string;
    shipping_address?: {
        full_name: string;
        address_line_1: string;
        city: string;
        state: string;
        postal_code: string;
        phone: string;
    };
}

interface User {
    id: number;
    name: string;
    email: string;
}

interface MyOrdersProps {
    auth: {
        user: User;
    };
    orders: {
        data: Order[];
        meta: {
            current_page: number;
            last_page: number;
            total: number;
            per_page: number;
        };
    };
    filters: {
        search?: string;
        status?: string;
    };
}

const statusConfig = {
    pending: { 
        label: 'Pending', 
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: '⏳'
    },
    processing: { 
        label: 'Processing', 
        color: 'bg-blue-100 text-blue-800 border-blue-200',
        icon: '⚙️'
    },
    shipped: { 
        label: 'Shipped', 
        color: 'bg-purple-100 text-purple-800 border-purple-200',
        icon: '🚚'
    },
    delivered: { 
        label: 'Delivered', 
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: '✅'
    },
    cancelled: { 
        label: 'Cancelled', 
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: '❌'
    }
};

const paymentStatusConfig = {
    pending: { label: 'Pending', color: 'text-yellow-600' },
    paid: { label: 'Paid', color: 'text-green-600' },
    failed: { label: 'Failed', color: 'text-red-600' },
    refunded: { label: 'Refunded', color: 'text-purple-600' }
};

export default function MyOrders({ orders, filters }: MyOrdersProps) {
    const [searchQuery, setSearchQuery] = useState(filters.search || '');
    const [statusFilter, setStatusFilter] = useState(filters.status || '');
    const [expandedOrder, setExpandedOrder] = useState<number | null>(null);

    const formatPrice = (price: number, currency: string = '₦') => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: currency === '₦' ? 'NGN' : currency,
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleSearch = () => {
        const params = new URLSearchParams();
        if (searchQuery) params.append('search', searchQuery);
        if (statusFilter) params.append('status', statusFilter);
        
        window.location.href = `/my-orders?${params.toString()}`;
    };

    const toggleOrderDetails = (orderId: number) => {
        setExpandedOrder(expandedOrder === orderId ? null : orderId);
    };

    return (
        <>
            <Head title="My Orders - JPATHNEC" />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                            <Link href="/" className="hover:text-primary">Home</Link>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span className="text-gray-900">My Orders</span>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900">My Orders</h1>
                                <p className="text-gray-600 mt-1">
                                    Track and manage your orders
                                </p>
                            </div>
                            
                            <div className="mt-4 sm:mt-0">
                                <span className="text-sm text-gray-600">
                                    Total Orders: <span className="font-semibold">{orders.meta.total}</span>
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Search Orders
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        type="text"
                                        placeholder="Order number, product name..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                        onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                    />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Filter by Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                    title="Filter orders by status"
                                >
                                    <option value="">All Status</option>
                                    <option value="pending">Pending</option>
                                    <option value="processing">Processing</option>
                                    <option value="shipped">Shipped</option>
                                    <option value="delivered">Delivered</option>
                                    <option value="cancelled">Cancelled</option>
                                </select>
                            </div>
                            
                            <div className="flex items-end">
                                <Button onClick={handleSearch} className="w-full">
                                    <Search className="h-4 w-4 mr-2" />
                                    Search
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Orders List */}
                    {orders.data.length === 0 ? (
                        <div className="bg-white rounded-lg shadow-sm border p-12 text-center">
                            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No orders found</h3>
                            <p className="text-gray-600 mb-6">
                                {filters.search || filters.status 
                                    ? "Try adjusting your search or filter criteria."
                                    : "You haven't placed any orders yet."
                                }
                            </p>
                            <Link href="/product-list">
                                <Button>Start Shopping</Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {orders.data.map((order) => (
                                <div key={order.id} className="bg-white rounded-lg shadow-sm border overflow-hidden">
                                    {/* Order Header */}
                                    <div className="p-6 border-b border-gray-200">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Order #{order.order_number}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[order.status as keyof typeof statusConfig]?.color}`}>
                                                        {statusConfig[order.status as keyof typeof statusConfig]?.icon}
                                                        <span className="ml-1">{statusConfig[order.status as keyof typeof statusConfig]?.label}</span>
                                                    </span>
                                                </div>
                                                
                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div className="flex items-center text-gray-600">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        <span>{formatDate(order.created_at)}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <Package className="h-4 w-4 mr-2" />
                                                        <span>{order.items_count} item{order.items_count !== 1 ? 's' : ''}</span>
                                                    </div>
                                                    <div className="flex items-center text-gray-600">
                                                        <CreditCard className="h-4 w-4 mr-2" />
                                                        <span className={paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig]?.color}>
                                                            {paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig]?.label}
                                                        </span>
                                                    </div>
                                                    {order.tracking_number && (
                                                        <div className="flex items-center text-gray-600">
                                                            <RefreshCw className="h-4 w-4 mr-2" />
                                                            <span>#{order.tracking_number}</span>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                            
                                            <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end">
                                                <div className="text-2xl font-bold text-gray-900 mb-2">
                                                    {formatPrice(order.total_amount, order.currency)}
                                                </div>
                                                <div className="flex space-x-2">
                                                    <Button
                                                        variant="outline"
                                                        size="sm"
                                                        onClick={() => toggleOrderDetails(order.id)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        {expandedOrder === order.id ? 'Hide' : 'View'} Details
                                                    </Button>
                                                    <Button variant="outline" size="sm">
                                                        <Download className="h-4 w-4 mr-1" />
                                                        Invoice
                                                    </Button>
                                                    {order.status === 'shipped' && (
                                                        <Button size="sm">Track Order</Button>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Order Details */}
                                    {expandedOrder === order.id && (
                                        <div className="p-6 bg-gray-50 border-t">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Order Items */}
                                                <div>
                                                    <h4 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h4>
                                                    <div className="space-y-3">
                                                        {order.items?.map((item) => (
                                                            <div key={item.id} className="flex justify-between items-center p-3 bg-white rounded-lg border">
                                                                <div className="flex-1">
                                                                    <h5 className="font-medium text-gray-900">{item.product_name}</h5>
                                                                    <div className="text-sm text-gray-600 space-x-4">
                                                                        <span>Qty: {item.quantity}</span>
                                                                        {item.size && <span>Size: {item.size}</span>}
                                                                        {item.color && <span>Color: {item.color}</span>}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-semibold">{formatPrice(item.total_price)}</div>
                                                                    <div className="text-sm text-gray-600">{formatPrice(item.unit_price)} each</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Shipping Address */}
                                                {order.shipping_address && (
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                                                            <MapPin className="h-5 w-5 mr-2" />
                                                            Shipping Address
                                                        </h4>
                                                        <div className="p-4 bg-white rounded-lg border">
                                                            <div className="space-y-1 text-sm">
                                                                <div className="font-medium">{order.shipping_address.full_name}</div>
                                                                <div>{order.shipping_address.address_line_1}</div>
                                                                <div>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</div>
                                                                <div className="text-blue-600">{order.shipping_address.phone}</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Pagination */}
                    {orders.meta.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center space-x-2">
                                {Array.from({ length: orders.meta.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/my-orders?page=${page}${searchQuery ? `&search=${searchQuery}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            page === orders.meta.current_page
                                                ? 'bg-primary text-white'
                                                : 'bg-white text-gray-700 border hover:bg-gray-50'
                                        }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}
