import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronRight, User, MapPin, Plus, Edit, Trash2, Lock, Shield, Eye, EyeOff } from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';
import Header from '../../components/ui/header';
import toast from 'react-hot-toast';

interface User {
    id: number;
    name: string;
    email: string;
    phone?: string;
    date_of_birth?: string;
    gender?: string;
    email_verified_at?: string;
}

interface Address {
    id: number;
    type: 'billing' | 'shipping';
    is_default: boolean;
    full_name: string;
    company?: string;
    address_line_1: string;
    address_line_2?: string;
    city: string;
    state: string;
    postal_code: string;
    country: string;
    phone?: string;
}

interface ProfileProps {
    auth: {
        user: User;
    };
    addresses: Address[];
    mustVerifyEmail: boolean;
    status?: string;
    cartCount?: number;
    wishlistCount?: number;
}

export default function Profile({ auth, addresses, mustVerifyEmail, cartCount = 0, wishlistCount = 0 }: ProfileProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'addresses' | 'password' | 'two-factor'>('profile');
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, patch, processing, errors } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        phone: auth.user.phone || '',
        date_of_birth: auth.user.date_of_birth || '',
        gender: auth.user.gender || '',
    });

    const { data: addressData, setData: setAddressData, post: postAddress, patch: patchAddress, delete: deleteAddress, processing: addressProcessing, errors: addressErrors, reset: resetAddress } = useForm({
        type: 'shipping',
        full_name: '',
        company: '',
        address_line_1: '',
        address_line_2: '',
        city: '',
        state: '',
        postal_code: '',
        country: 'Nigeria',
        phone: '',
        is_default: false,
    });

    const { data: passwordData, setData: setPasswordData, put: putPassword, processing: passwordProcessing, errors: passwordErrors, reset: resetPasswordForm } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        patch('/settings/profile', {
            preserveScroll: true,
            onSuccess: () => {
                toast.success('Profile updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update profile. Please check the errors and try again.');
            }
        });
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAddress) {
            patchAddress(`/settings/addresses/${editingAddress.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingAddress(null);
                    setShowAddressForm(false);
                    resetAddress();
                    toast.success('Address updated successfully!');
                },
                onError: () => {
                    toast.error('Failed to update address. Please check the errors and try again.');
                }
            });
        } else {
            postAddress('/settings/addresses', {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddressForm(false);
                    resetAddress();
                    toast.success('Address added successfully!');
                },
                onError: () => {
                    toast.error('Failed to add address. Please check the errors and try again.');
                }
            });
        }
    };

    const editAddress = (address: Address) => {
        setEditingAddress(address);
        setAddressData({
            type: address.type,
            full_name: address.full_name,
            company: address.company || '',
            address_line_1: address.address_line_1,
            address_line_2: address.address_line_2 || '',
            city: address.city,
            state: address.state,
            postal_code: address.postal_code,
            country: address.country,
            phone: address.phone || '',
            is_default: address.is_default,
        });
        setShowAddressForm(true);
    };

    const removeAddress = (addressId: number) => {
        if (confirm('Are you sure you want to delete this address?')) {
            deleteAddress(`/settings/addresses/${addressId}`, {
                preserveScroll: true,
                onSuccess: () => {
                    toast.success('Address deleted successfully!');
                },
                onError: () => {
                    toast.error('Failed to delete address. Please try again.');
                }
            });
        }
    };

    const handlePasswordSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        putPassword('/settings/password', {
            preserveScroll: true,
            onSuccess: () => {
                resetPasswordForm();
                toast.success('Password updated successfully!');
            },
            onError: () => {
                toast.error('Failed to update password. Please check the errors and try again.');
            }
        });
    };

    return (
        <>
            <Head title="Profile Settings - JPATHNEC" />

            {/* Add Header */}
            <Header user={auth.user} cartCount={cartCount} wishlistCount={wishlistCount} />

            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                            <Link href="/" className="hover:text-primary">Home</Link>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <Link href="/settings/profile" className="hover:text-primary">Settings</Link>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span className="text-gray-900">Profile</span>
                        </div>

                        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
                        <p className="text-gray-600 mt-1">
                            Manage your account information and addresses
                        </p>
                    </div>

                    {/* Tabs */}
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="border-b border-gray-200 tabs-scroll-container">
                            <div className="overflow-x-auto scrollbar-hide mobile-tabs-scroll">
                                <nav className="flex min-w-max">
                                    <button
                                        onClick={() => setActiveTab('profile')}
                                        className={`flex-shrink-0 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                                            activeTab === 'profile'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <User className="h-4 w-4 inline mr-2" />
                                        <span className="hidden sm:inline">Personal Information</span>
                                        <span className="sm:hidden">Personal</span>
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('addresses')}
                                        className={`flex-shrink-0 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                                            activeTab === 'addresses'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <MapPin className="h-4 w-4 inline mr-2" />
                                        Addresses ({addresses.length})
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('password')}
                                        className={`flex-shrink-0 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                                            activeTab === 'password'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <Lock className="h-4 w-4 inline mr-2" />
                                        Password
                                    </button>
                                    <button
                                        onClick={() => setActiveTab('two-factor')}
                                        className={`flex-shrink-0 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap ${
                                            activeTab === 'two-factor'
                                                ? 'border-primary text-primary'
                                                : 'border-transparent text-gray-600 hover:text-gray-900'
                                        }`}
                                    >
                                        <Shield className="h-4 w-4 inline mr-2" />
                                        <span className="hidden sm:inline">Two-Factor Auth</span>
                                        <span className="sm:hidden">2FA</span>
                                    </button>
                                    <Link
                                        href="/settings/appearance"
                                        className="flex-shrink-0 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                                    >
                                        <span className="inline-flex items-center">
                                            🎨
                                            <span className="ml-2">Appearance</span>
                                        </span>
                                    </Link>
                                    <Link
                                        href="/settings/devices"
                                        className="flex-shrink-0 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                                    >
                                        <span className="inline-flex items-center">
                                            📱
                                            <span className="ml-2">Devices</span>
                                        </span>
                                    </Link>
                                    <Link
                                        href="/my-orders"
                                        className="flex-shrink-0 px-4 sm:px-6 py-4 text-sm font-medium border-b-2 border-transparent text-gray-600 hover:text-gray-900 whitespace-nowrap"
                                    >
                                        <span className="inline-flex items-center">
                                            📦
                                            <span className="ml-2 hidden sm:inline">My Orders</span>
                                            <span className="ml-2 sm:hidden">Orders</span>
                                        </span>
                                    </Link>
                                </nav>
                            </div>
                        </div>

                        <div className="p-6">
                            {/* Personal Information Tab */}
                            {activeTab === 'profile' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Full Name *
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={data.name}
                                                        onChange={(e) => setData('name', e.target.value)}
                                                        placeholder="Enter your full name"
                                                        className={errors.name ? 'border-red-500' : ''}
                                                    />
                                                    {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Email Address *
                                                    </label>
                                                    <Input
                                                        type="email"
                                                        value={data.email}
                                                        placeholder="Enter your email"
                                                        className={`bg-gray-50 ${errors.email ? 'border-red-500' : ''}`}
                                                        disabled
                                                        readOnly
                                                    />
                                                    <p className="text-gray-500 text-xs mt-1">
                                                        Email cannot be changed for security reasons. Contact support if you need to update your email.
                                                    </p>
                                                    {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
                                                    {mustVerifyEmail && !auth.user.email_verified_at && (
                                                        <p className="text-orange-600 text-sm mt-1">
                                                            Your email address is not verified.
                                                            <Link href="/email/verification-notification" className="underline ml-1">
                                                                Resend verification email
                                                            </Link>
                                                        </p>
                                                    )}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Phone Number
                                                    </label>
                                                    <Input
                                                        type="tel"
                                                        value={data.phone}
                                                        onChange={(e) => setData('phone', e.target.value)}
                                                        placeholder="07065910449"
                                                        className={errors.phone ? 'border-red-500' : ''}
                                                    />
                                                    {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Date of Birth
                                                    </label>
                                                    <Input
                                                        type="date"
                                                        value={data.date_of_birth}
                                                        onChange={(e) => setData('date_of_birth', e.target.value)}
                                                        className={errors.date_of_birth ? 'border-red-500' : ''}
                                                    />
                                                    {errors.date_of_birth && <p className="text-red-500 text-sm mt-1">{errors.date_of_birth}</p>}
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                                        Gender
                                                    </label>
                                                    <select
                                                        value={data.gender}
                                                        onChange={(e) => setData('gender', e.target.value)}
                                                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                        title="Select gender"
                                                    >
                                                        <option value="">Select Gender</option>
                                                        <option value="male">Male</option>
                                                        <option value="female">Female</option>
                                                    </select>
                                                    {errors.gender && <p className="text-red-500 text-sm mt-1">{errors.gender}</p>}
                                                </div>
                                            </div>

                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={processing}>
                                                    {processing ? 'Saving...' : 'Save Changes'}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Addresses Tab */}
                            {activeTab === 'addresses' && (
                                <div className="space-y-6">
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-lg font-semibold text-gray-900">Your Addresses</h3>
                                        <Button
                                            onClick={() => {
                                                setEditingAddress(null);
                                                resetAddress();
                                                setShowAddressForm(true);
                                            }}
                                        >
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add New Address
                                        </Button>
                                    </div>

                                    {/* Address Form */}
                                    {showAddressForm && (
                                        <div className="bg-gray-50 rounded-lg p-6">
                                            <h4 className="text-lg font-medium mb-4">
                                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                                            </h4>
                                            <form onSubmit={handleAddressSubmit} className="space-y-4">
                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Address Type *
                                                        </label>
                                                        <select
                                                            value={addressData.type}
                                                            onChange={(e) => setAddressData('type', e.target.value as 'billing' | 'shipping')}
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                            title="Select address type"
                                                        >
                                                            <option value="shipping">Shipping Address</option>
                                                            <option value="billing">Billing Address</option>
                                                        </select>
                                                    </div>

                                                    <div className="flex items-center">
                                                        <input
                                                            type="checkbox"
                                                            id="is_default"
                                                            checked={addressData.is_default}
                                                            onChange={(e) => setAddressData('is_default', e.target.checked)}
                                                            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                                                        />
                                                        <label htmlFor="is_default" className="ml-2 text-sm text-gray-700">
                                                            Set as default address
                                                        </label>
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Full Name *
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            value={addressData.full_name}
                                                            onChange={(e) => setAddressData('full_name', e.target.value)}
                                                            placeholder="Enter full name"
                                                            className={addressErrors.full_name ? 'border-red-500' : ''}
                                                        />
                                                        {addressErrors.full_name && <p className="text-red-500 text-sm mt-1">{addressErrors.full_name}</p>}
                                                    </div>
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Company (Optional)
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={addressData.company}
                                                        onChange={(e) => setAddressData('company', e.target.value)}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Address Line 1 *
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={addressData.address_line_1}
                                                        onChange={(e) => setAddressData('address_line_1', e.target.value)}
                                                        placeholder="Street address, building number"
                                                        className={addressErrors.address_line_1 ? 'border-red-500' : ''}
                                                    />
                                                </div>

                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-1">
                                                        Address Line 2 (Optional)
                                                    </label>
                                                    <Input
                                                        type="text"
                                                        value={addressData.address_line_2}
                                                        onChange={(e) => setAddressData('address_line_2', e.target.value)}
                                                        placeholder="Apartment, suite, unit"
                                                    />
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            City *
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            value={addressData.city}
                                                            onChange={(e) => setAddressData('city', e.target.value)}
                                                            className={addressErrors.city ? 'border-red-500' : ''}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            State *
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            value={addressData.state}
                                                            onChange={(e) => setAddressData('state', e.target.value)}
                                                            className={addressErrors.state ? 'border-red-500' : ''}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Postal Code *
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            value={addressData.postal_code}
                                                            onChange={(e) => setAddressData('postal_code', e.target.value)}
                                                            className={addressErrors.postal_code ? 'border-red-500' : ''}
                                                        />
                                                    </div>
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Country *
                                                        </label>
                                                        <select
                                                            value={addressData.country}
                                                            onChange={(e) => setAddressData('country', e.target.value)}
                                                            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                                                            title="Select country"
                                                        >
                                                            <option value="Nigeria">Nigeria</option>
                                                            <option value="Ghana">Ghana</option>
                                                            <option value="Kenya">Kenya</option>
                                                            <option value="South Africa">South Africa</option>
                                                        </select>
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Phone Number
                                                        </label>
                                                        <Input
                                                            type="tel"
                                                            value={addressData.phone}
                                                            onChange={(e) => setAddressData('phone', e.target.value)}
                                                            placeholder="+234 801 234 5678"
                                                        />
                                                    </div>
                                                </div>

                                                <div className="flex justify-end space-x-3">
                                                    <Button
                                                        type="button"
                                                        variant="outline"
                                                        onClick={() => {
                                                            setShowAddressForm(false);
                                                            setEditingAddress(null);
                                                            resetAddress();
                                                        }}
                                                    >
                                                        Cancel
                                                    </Button>
                                                    <Button type="submit" disabled={addressProcessing}>
                                                        {addressProcessing ? 'Saving...' : editingAddress ? 'Update Address' : 'Add Address'}
                                                    </Button>
                                                </div>
                                            </form>
                                        </div>
                                    )}

                                    {/* Address List */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {addresses.map((address) => (
                                            <div key={address.id} className="border rounded-lg p-4 relative">
                                                {address.is_default && (
                                                    <span className="absolute top-2 right-2 bg-primary text-white text-xs px-2 py-1 rounded">
                                                        Default
                                                    </span>
                                                )}

                                                <div className="mb-3">
                                                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                                        address.type === 'billing'
                                                            ? 'bg-blue-100 text-blue-800'
                                                            : 'bg-green-100 text-green-800'
                                                    }`}>
                                                        {address.type === 'billing' ? 'Billing' : 'Shipping'}
                                                    </span>
                                                </div>

                                                <div className="space-y-1 text-sm">
                                                    <p className="font-medium">{address.full_name}</p>
                                                    {address.company && <p>{address.company}</p>}
                                                    <p>{address.address_line_1}</p>
                                                    {address.address_line_2 && <p>{address.address_line_2}</p>}
                                                    <p>{address.city}, {address.state} {address.postal_code}</p>
                                                    <p>{address.country}</p>
                                                    {address.phone && <p className="text-blue-600">{address.phone}</p>}
                                                </div>

                                                <div className="flex justify-end space-x-2 mt-4">
                                                    <button
                                                        onClick={() => editAddress(address)}
                                                        className="text-blue-600 hover:text-blue-800"
                                                        title="Edit address"
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => removeAddress(address.id)}
                                                        className="text-red-600 hover:text-red-800"
                                                        title="Delete address"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    {addresses.length === 0 && !showAddressForm && (
                                        <div className="text-center py-8">
                                            <MapPin className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                                            <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses yet</h3>
                                            <p className="text-gray-600 mb-4">Add your first address to get started with orders</p>
                                        </div>
                                    )}
                                </div>
                            )}

                            {/* Password Tab */}
                            {activeTab === 'password' && (
                                <div className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Change Password</h3>
                                        <form onSubmit={handlePasswordSubmit} className="space-y-6 max-w-md">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Current Password *
                                </label>
                                <div className="relative">
                                    <Input
                                        type={showCurrentPassword ? "text" : "password"}
                                        value={passwordData.current_password}
                                        onChange={(e) => setPasswordData('current_password', e.target.value)}
                                        placeholder="Enter your current password"
                                        className={passwordErrors.current_password ? 'border-red-500 pr-10' : 'pr-10'}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                    >
                                        {showCurrentPassword ? (
                                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        ) : (
                                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                        )}
                                    </button>
                                </div>
                                {passwordErrors.current_password && <p className="text-red-500 text-sm mt-1">{passwordErrors.current_password}</p>}
                            </div>                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    New Password *
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        type={showNewPassword ? "text" : "password"}
                                                        value={passwordData.password}
                                                        onChange={(e) => setPasswordData('password', e.target.value)}
                                                        placeholder="Enter your new password"
                                                        className={passwordErrors.password ? 'border-red-500 pr-10' : 'pr-10'}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowNewPassword(!showNewPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    >
                                                        {showNewPassword ? (
                                                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                                        )}
                                                    </button>
                                                </div>
                                                {passwordErrors.password && <p className="text-red-500 text-sm mt-1">{passwordErrors.password}</p>}
                                                <p className="text-gray-500 text-xs mt-1">
                                                    Password must be at least 8 characters long
                                                </p>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                                    Confirm New Password *
                                                </label>
                                                <div className="relative">
                                                    <Input
                                                        type={showConfirmPassword ? "text" : "password"}
                                                        value={passwordData.password_confirmation}
                                                        onChange={(e) => setPasswordData('password_confirmation', e.target.value)}
                                                        placeholder="Confirm your new password"
                                                        className={passwordErrors.password_confirmation ? 'border-red-500 pr-10' : 'pr-10'}
                                                    />
                                                    <button
                                                        type="button"
                                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                                    >
                                                        {showConfirmPassword ? (
                                                            <EyeOff className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                                        ) : (
                                                            <Eye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
                                                        )}
                                                    </button>
                                                </div>
                                                {passwordErrors.password_confirmation && <p className="text-red-500 text-sm mt-1">{passwordErrors.password_confirmation}</p>}
                                            </div>

                                            <div className="flex justify-end">
                                                <Button type="submit" disabled={passwordProcessing}>
                                                    {passwordProcessing ? 'Updating...' : 'Update Password'}
                                                </Button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            )}

                            {/* Two-Factor Authentication Tab */}
                            {activeTab === 'two-factor' && (
                                <div className="space-y-6">
                                    <div>
                                        <div className="flex items-center justify-between mb-4">
                                            <h3 className="text-lg font-semibold text-gray-900">Two-Factor Authentication</h3>
                                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                Coming Soon
                                            </span>
                                        </div>
                                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                            <div className="flex items-center">
                                                <Shield className="h-5 w-5 text-blue-600 mr-2" />
                                                <p className="text-sm text-blue-800">
                                                    Add an extra layer of security to your account by enabling two-factor authentication.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="space-y-4">
                                            <div className="border rounded-lg p-4 opacity-60">
                                                <h4 className="font-medium text-gray-900 mb-2">Authenticator App</h4>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Use an authenticator app like Google Authenticator or Authy to generate verification codes.
                                                </p>
                                                <Button variant="outline" disabled className="cursor-not-allowed">
                                                    Enable Authenticator
                                                </Button>
                                            </div>

                                            <div className="border rounded-lg p-4 opacity-60">
                                                <h4 className="font-medium text-gray-900 mb-2">SMS Verification</h4>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Receive verification codes via text message to your phone.
                                                </p>
                                                <Button variant="outline" disabled className="cursor-not-allowed">
                                                    Enable SMS
                                                </Button>
                                            </div>

                                            <div className="border rounded-lg p-4 opacity-60">
                                                <h4 className="font-medium text-gray-900 mb-2">Recovery Codes</h4>
                                                <p className="text-sm text-gray-600 mb-4">
                                                    Generate backup codes that you can use if you lose access to your primary 2FA method.
                                                </p>
                                                <Button variant="outline" disabled className="cursor-not-allowed">
                                                    Generate Codes
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
