import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Download, Eye, Package, Search, RefreshCw, Calendar, CreditCard, MapPin, RotateCcw, CheckCircle, AlertCircle, Clock } from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Header from '../../components/ui/header';

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
    estimated_delivery?: string;
    delivery_status_message?: string;
    is_delivery_overdue?: boolean;
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
        current_page: number;
        last_page: number;
        total: number;
        per_page: number;
        next_page_url?: string;
        prev_page_url?: string;
    };
    filters: {
        search?: string;
        status?: string;
    };
    cartCount?: number;
    wishlistCount?: number;
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

export default function MyOrders({ auth, orders, filters, cartCount = 0, wishlistCount = 0 }: MyOrdersProps) {

    const [searchQuery, setSearchQuery] = useState(filters?.search || '');
    const [statusFilter, setStatusFilter] = useState(filters?.status || '');
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

    try {
        return (
            <>
                <Head title="My Orders - JPATHNEC" />
                <Header user={auth.user} cartCount={cartCount} wishlistCount={wishlistCount} />

                <main className="flex-1">
                    <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center text-sm text-muted-foreground mb-4">
                                <Link href="/" className="hover:text-primary">Home</Link>
                                <ChevronRight className="h-4 w-4 mx-2" />
                                <span className="text-foreground">My Orders</span>
                            </div>

                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
                                <div>
                                    <h1 className="text-3xl font-bold text-foreground">My Orders</h1>
                                    <p className="text-muted-foreground mt-1">
                                        Track and manage your orders
                                    </p>
                                </div>

                                <div className="mt-4 sm:mt-0">
                                    <span className="text-sm text-muted-foreground">
                                        Total Orders: <span className="font-semibold">{orders?.total || 0}</span>
                                    </span>
                                </div>
                            </div>
                        </div>

                    {/* Filters */}
                    <div className="bg-card rounded-lg shadow-sm border p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Search Orders
                                </label>
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                                <label className="block text-sm font-medium text-foreground mb-2">
                                    Filter by Status
                                </label>
                                <select
                                    value={statusFilter}
                                    onChange={(e) => setStatusFilter(e.target.value)}
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:border-ring focus:outline-none focus:ring-1 focus:ring-ring"
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
                    {!orders?.data || orders.data.length === 0 ? (
                        <div className="bg-card rounded-lg shadow-sm border p-12 text-center">
                            <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                            <h3 className="text-lg font-medium text-foreground mb-2">No orders found</h3>
                            <p className="text-muted-foreground mb-6">
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
                                <div key={order.id} className="bg-card rounded-lg shadow-sm border overflow-hidden">
                                    {/* Order Header */}
                                    <div className="p-6 border-b border-border">
                                        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center space-x-4 mb-3">
                                                    <h3 className="text-lg font-semibold text-foreground">
                                                        Order #{order.order_number}
                                                    </h3>
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${statusConfig[order.status as keyof typeof statusConfig]?.color}`}>
                                                        {statusConfig[order.status as keyof typeof statusConfig]?.icon}
                                                        <span className="ml-1">{statusConfig[order.status as keyof typeof statusConfig]?.label}</span>
                                                    </span>
                                                </div>

                                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Calendar className="h-4 w-4 mr-2" />
                                                        <span>{formatDate(order.created_at)}</span>
                                                    </div>
                                                    <div className="flex items-center text-muted-foreground">
                                                        <Package className="h-4 w-4 mr-2" />
                                                        <span>{order.items_count} item{order.items_count !== 1 ? 's' : ''}</span>
                                                    </div>
                                                    <div className="flex items-center text-muted-foreground">
                                                        <CreditCard className="h-4 w-4 mr-2" />
                                                        <span className={paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig]?.color}>
                                                            {paymentStatusConfig[order.payment_status as keyof typeof paymentStatusConfig]?.label}
                                                        </span>
                                                    </div>
                                                    {order.tracking_number && (
                                                        <div className="flex items-center text-muted-foreground">
                                                            <RefreshCw className="h-4 w-4 mr-2" />
                                                            <span>#{order.tracking_number}</span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Delivery Information */}
                                                {order.delivery_status_message && (
                                                    <div className={`mt-3 p-3 rounded-lg text-sm ${
                                                        order.is_delivery_overdue
                                                            ? 'bg-red-50 text-red-700 border border-red-200'
                                                            : order.status === 'delivered'
                                                                ? 'bg-green-50 text-green-700 border border-green-200'
                                                                : 'bg-blue-50 text-blue-700 border border-blue-200'
                                                    }`}>
                                                        <div className="flex items-center">
                                                            {order.status === 'delivered' ? (
                                                                <CheckCircle className="h-4 w-4 mr-2" />
                                                            ) : order.is_delivery_overdue ? (
                                                                <AlertCircle className="h-4 w-4 mr-2" />
                                                            ) : (
                                                                <Clock className="h-4 w-4 mr-2" />
                                                            )}
                                                            <span className="font-medium">{order.delivery_status_message}</span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            <div className="mt-4 lg:mt-0 lg:ml-6 flex flex-col lg:items-end">
                                                <div className="text-2xl font-bold text-foreground mb-2">
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
                                                    {order.payment_status === 'paid' ? (
                                                        <Link href={`/my-orders/${order.id}/invoice`}>
                                                            <Button variant="outline" size="sm">
                                                                <Download className="h-4 w-4 mr-1" />
                                                                Invoice
                                                            </Button>
                                                        </Link>
                                                    ) : (
                                                        <Button variant="outline" size="sm" disabled title="Invoice only available for paid orders">
                                                            <Download className="h-4 w-4 mr-1" />
                                                            Invoice
                                                        </Button>
                                                    )}
                                                    <Link href={`/my-orders/${order.id}/reorder`} method="post">
                                                        <Button variant="outline" size="sm">
                                                            <RotateCcw className="h-4 w-4 mr-1" />
                                                            Reorder
                                                        </Button>
                                                    </Link>
                                                    <Link href={`/my-orders/${order.id}/track`}>
                                                        <Button size="sm">Track Order</Button>
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Expanded Order Details */}
                                    {expandedOrder === order.id && (
                                        <div className="p-6 bg-muted/50 border-t">
                                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                                {/* Order Items */}
                                                <div>
                                                    <h4 className="text-lg font-semibold text-foreground mb-4">Order Items</h4>
                                                    <div className="space-y-3">
                                                        {order.items?.map((item) => (
                                                            <div key={item.id} className="flex justify-between items-center p-3 bg-background rounded-lg border">
                                                                <div className="flex-1">
                                                                    <h5 className="font-medium text-foreground">{item.product_name}</h5>
                                                                    <div className="text-sm text-muted-foreground space-x-4">
                                                                        <span>Qty: {item.quantity}</span>
                                                                        {item.size && <span>Size: {item.size}</span>}
                                                                        {item.color && <span>Color: {item.color}</span>}
                                                                    </div>
                                                                </div>
                                                                <div className="text-right">
                                                                    <div className="font-semibold">{formatPrice(item.total_price)}</div>
                                                                    <div className="text-sm text-muted-foreground">{formatPrice(item.unit_price)} each</div>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                </div>

                                                {/* Shipping Address */}
                                                {order.shipping_address && (
                                                    <div>
                                                        <h4 className="text-lg font-semibold text-foreground mb-4 flex items-center">
                                                            <MapPin className="h-5 w-5 mr-2" />
                                                            Shipping Address
                                                        </h4>
                                                        <div className="p-4 bg-background rounded-lg border">
                                                            <div className="space-y-1 text-sm">
                                                                <div className="font-medium">{order.shipping_address.full_name}</div>
                                                                <div>{order.shipping_address.address_line_1}</div>
                                                                <div>{order.shipping_address.city}, {order.shipping_address.state} {order.shipping_address.postal_code}</div>
                                                                <div className="text-primary">{order.shipping_address.phone}</div>
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
                    {orders?.last_page && orders.last_page > 1 && (
                        <div className="mt-8 flex justify-center">
                            <div className="flex items-center space-x-2">
                                {Array.from({ length: orders.last_page }, (_, i) => i + 1).map((page) => (
                                    <Link
                                        key={page}
                                        href={`/my-orders?page=${page}${searchQuery ? `&search=${searchQuery}` : ''}${statusFilter ? `&status=${statusFilter}` : ''}`}
                                        className={`px-3 py-2 text-sm rounded-md ${
                                            page === (orders.current_page || 1)
                                                ? 'bg-primary text-primary-foreground'
                                                : 'bg-background text-foreground border hover:bg-accent'
                                        }`}
                                    >
                                        {page}
                                    </Link>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </>
    );
    } catch (error) {
        console.error('Error in MyOrders component:', error);
        return (
            <>
                <Head title="My Orders - JPATHNEC" />
                <Header user={auth.user} cartCount={cartCount} wishlistCount={wishlistCount} />

                <main className="flex-1">
                    <div className="container mx-auto px-8 md:px-12 lg:px-16 py-8">
                        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                            <h2 className="font-bold">Error loading orders</h2>
                            <p>There was an error displaying your orders. Please try refreshing the page.</p>
                            <p className="text-sm mt-2">Error: {error instanceof Error ? error.message : String(error)}</p>
                        </div>
                    </div>
                </main>
            </>
        );
    }
}
