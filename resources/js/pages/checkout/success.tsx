import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { CheckCircle, Download, Home, Package, Receipt } from 'lucide-react';

interface OrderItem {
    id: number;
    product_name: string;
    quantity: number;
    price: number;
    total: number;
}

interface ShippingAddress {
    full_name: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    phone: string;
}

interface Order {
    id: number;
    order_number: string;
    total_amount: number;
    payment_reference?: string;
    status: string;
    payment_status: string;
    created_at: string;
    shipping_address: ShippingAddress;
    items: OrderItem[];
}

export default function Success() {
    const { order } = usePage().props as unknown as { order: Order };

    const formatPrice = (price: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
        }).format(price);
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-NG', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handlePrint = () => {
        // Add print styles temporarily
        const printStyles = `
            @media print {
                body * {
                    visibility: hidden;
                }
                #printable-content,
                #printable-content * {
                    visibility: visible;
                }
                #printable-content {
                    position: absolute;
                    left: 0;
                    top: 0;
                    width: 100%;
                }
                .print\\:hidden {
                    display: none !important;
                }
                .bg-gray-50 {
                    background: white !important;
                }
                .shadow-xl {
                    box-shadow: none !important;
                }
                .rounded-lg {
                    border-radius: 0 !important;
                }
            }
        `;

        // Create style element and append to head
        const styleElement = document.createElement('style');
        styleElement.textContent = printStyles;
        document.head.appendChild(styleElement);

        // Trigger print
        window.print();

        // Remove styles after printing
        setTimeout(() => {
            document.head.removeChild(styleElement);
        }, 1000);
    };

    return (
        <>
            <Head title="Order Successful - JPATHNEC" />
            
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white shadow-xl rounded-lg overflow-hidden" id="printable-content">
                        {/* Company Header */}
                        <div className="bg-white px-6 py-4 border-b">
                            <div className="flex items-center justify-center">
                                <Link href="/" className="flex items-center space-x-2 text-xl font-bold text-primary">
                                    <img src="/logo.png" alt="JPATHNEC Logo" width={28} height={28} className="text-primary" />
                                    <span className="font-inter font-bold">JPATHNEC</span>
                                </Link>
                            </div>
                            <p className="text-center text-sm text-gray-600 mt-2">Your Fashion Destination</p>
                        </div>

                        {/* Success Header */}
                        <div className="bg-green-50 px-6 py-8 text-center border-b">
                            <CheckCircle className="mx-auto h-16 w-16 text-green-500 mb-4" />
                            <h1 className="text-3xl font-bold text-green-900 mb-2">
                                Payment Successful!
                            </h1>
                            <p className="text-green-700">
                                Your order has been confirmed and is being processed.
                            </p>
                        </div>

                        {/* Order Details */}
                        <div className="px-6 py-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <Receipt className="h-5 w-5 mr-2" />
                                        Order Information
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Order Number:</span>
                                            <span className="font-semibold">{order.order_number}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Date:</span>
                                            <span>{formatDate(order.created_at)}</span>
                                        </div>
                                        <div className="flex justify-between">
                                            <span className="text-gray-600">Status:</span>
                                            <span className="capitalize font-semibold text-green-600">
                                                {order.status}
                                            </span>
                                        </div>
                                        {order.payment_reference && (
                                            <div className="flex justify-between">
                                                <span className="text-gray-600">Payment Reference:</span>
                                                <span className="font-mono text-xs">
                                                    {order.payment_reference}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                                        <Package className="h-5 w-5 mr-2" />
                                        Shipping Address
                                    </h3>
                                    <div className="space-y-2 text-sm">
                                        {order.shipping_address && typeof order.shipping_address === 'object' && Object.keys(order.shipping_address).length > 0 ? (
                                            <>
                                                {order.shipping_address.full_name && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Full Name:</span>
                                                        <span className="font-semibold">{order.shipping_address.full_name}</span>
                                                    </div>
                                                )}
                                                {order.shipping_address.address_line_1 && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Address:</span>
                                                        <span>{order.shipping_address.address_line_1}</span>
                                                    </div>
                                                )}
                                                {order.shipping_address.address_line_2 && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Address Line 2:</span>
                                                        <span>{order.shipping_address.address_line_2}</span>
                                                    </div>
                                                )}
                                                {(order.shipping_address.city || order.shipping_address.state) && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">City/State:</span>
                                                        <span>
                                                            {order.shipping_address.city}
                                                            {order.shipping_address.city && order.shipping_address.state && ', '}
                                                            {order.shipping_address.state}
                                                        </span>
                                                    </div>
                                                )}
                                                {order.shipping_address.postal_code && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Postal Code:</span>
                                                        <span>{order.shipping_address.postal_code}</span>
                                                    </div>
                                                )}
                                                {order.shipping_address.phone && (
                                                    <div className="flex justify-between">
                                                        <span className="text-gray-600">Phone:</span>
                                                        <span className="text-blue-600">{order.shipping_address.phone}</span>
                                                    </div>
                                                )}
                                            </>
                                        ) : (
                                            <div className="text-gray-500 italic">
                                                Shipping address information is being processed
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Order Items */}
                            <div className="mb-8">
                                <h3 className="text-lg font-semibold text-gray-900 mb-4">Order Items</h3>
                                <div className="bg-gray-50 rounded-lg overflow-hidden">
                                    <table className="w-full">
                                        <thead className="bg-gray-100">
                                            <tr>
                                                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-900">
                                                    Product
                                                </th>
                                                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-900">
                                                    Qty
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                                    Price
                                                </th>
                                                <th className="px-4 py-3 text-right text-sm font-semibold text-gray-900">
                                                    Total
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200">
                                            {order.items.map((item) => (
                                                <tr key={item.id} className="bg-white">
                                                    <td className="px-4 py-3 text-sm text-gray-900">
                                                        {item.product_name}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 text-center">
                                                        {item.quantity}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm text-gray-900 text-right">
                                                        {formatPrice(item.price)}
                                                    </td>
                                                    <td className="px-4 py-3 text-sm font-semibold text-gray-900 text-right">
                                                        {formatPrice(item.total)}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                        <tfoot className="bg-gray-100">
                                            <tr>
                                                <td colSpan={3} className="px-4 py-3 text-right text-lg font-semibold text-gray-900">
                                                    Total:
                                                </td>
                                                <td className="px-4 py-3 text-right text-lg font-bold text-green-600">
                                                    {formatPrice(order.total_amount)}
                                                </td>
                                            </tr>
                                        </tfoot>
                                    </table>
                                </div>
                            </div>

                            {/* Next Steps */}
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                                <h3 className="text-lg font-semibold text-blue-900 mb-3">
                                    What happens next?
                                </h3>
                                <ul className="space-y-2 text-sm text-blue-800">
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                                        You will receive an order confirmation email shortly
                                    </li>
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                                        Our team will prepare your order for delivery
                                    </li>
                                    <li className="flex items-start">
                                        <span className="flex-shrink-0 w-2 h-2 bg-blue-500 rounded-full mt-2 mr-3"></span>
                                        You'll get tracking information once your order ships
                                    </li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-between print:hidden">
                                <div className="flex gap-4">
                                    <button
                                        onClick={handlePrint}
                                        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Print Receipt
                                    </button>
                                </div>
                                
                                <Link
                                    href="/"
                                    className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                >
                                    <Home className="h-5 w-5 mr-2" />
                                    Continue Shopping
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}