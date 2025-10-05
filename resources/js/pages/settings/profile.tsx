import React, { useState } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ChevronRight, User, MapPin, Plus, Edit, Trash2, CreditCard } from 'lucide-react';
import Button from '../../components/ui/button';
import Input from '../../components/ui/input';

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
    first_name: string;
    last_name: string;
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
}

export default function Profile({ auth, addresses, mustVerifyEmail }: ProfileProps) {
    const [activeTab, setActiveTab] = useState<'profile' | 'addresses'>('profile');
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [showAddressForm, setShowAddressForm] = useState(false);

    const { data, setData, post, processing, errors } = useForm({
        name: auth.user.name || '',
        email: auth.user.email || '',
        phone: auth.user.phone || '',
        date_of_birth: auth.user.date_of_birth || '',
        gender: auth.user.gender || '',
    });

    const { data: addressData, setData: setAddressData, post: postAddress, put: putAddress, delete: deleteAddress, processing: addressProcessing, errors: addressErrors, reset: resetAddress } = useForm({
        type: 'shipping',
        first_name: '',
        last_name: '',
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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/settings/profile', {
            preserveScroll: true,
        });
    };

    const handleAddressSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingAddress) {
            putAddress(`/settings/addresses/${editingAddress.id}`, {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingAddress(null);
                    setShowAddressForm(false);
                    resetAddress();
                }
            });
        } else {
            postAddress('/settings/addresses', {
                preserveScroll: true,
                onSuccess: () => {
                    setShowAddressForm(false);
                    resetAddress();
                }
            });
        }
    };

    const editAddress = (address: Address) => {
        setEditingAddress(address);
        setAddressData({
            type: address.type,
            first_name: address.first_name,
            last_name: address.last_name,
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
            });
        }
    };

    return (
        <>
            <Head title="Profile Settings - JPATHNEC" />
            
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
                        <div className="border-b border-gray-200">
                            <nav className="flex">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                                        activeTab === 'profile'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <User className="h-4 w-4 inline mr-2" />
                                    Personal Information
                                </button>
                                <button
                                    onClick={() => setActiveTab('addresses')}
                                    className={`px-6 py-4 text-sm font-medium border-b-2 ${
                                        activeTab === 'addresses'
                                            ? 'border-primary text-primary'
                                            : 'border-transparent text-gray-600 hover:text-gray-900'
                                    }`}
                                >
                                    <MapPin className="h-4 w-4 inline mr-2" />
                                    Addresses ({addresses.length})
                                </button>
                            </nav>
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
                                                        onChange={(e) => setData('email', e.target.value)}
                                                        placeholder="Enter your email"
                                                        className={errors.email ? 'border-red-500' : ''}
                                                    />
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
                                                        placeholder="+234 801 234 5678"
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
                                                        <option value="other">Other</option>
                                                        <option value="prefer_not_to_say">Prefer not to say</option>
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

                                    {/* Quick Links */}
                                    <div className="border-t pt-6">
                                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Settings</h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <Link
                                                href="/settings/password"
                                                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center">
                                                    <CreditCard className="h-5 w-5 text-primary mr-3" />
                                                    <div>
                                                        <p className="font-medium">Change Password</p>
                                                        <p className="text-sm text-gray-600">Update your account password</p>
                                                    </div>
                                                </div>
                                            </Link>
                                            
                                            <Link
                                                href="/settings/two-factor"
                                                className="p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                                            >
                                                <div className="flex items-center">
                                                    <CreditCard className="h-5 w-5 text-primary mr-3" />
                                                    <div>
                                                        <p className="font-medium">Two-Factor Authentication</p>
                                                        <p className="text-sm text-gray-600">Secure your account</p>
                                                    </div>
                                                </div>
                                            </Link>
                                        </div>
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

                                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            First Name *
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            value={addressData.first_name}
                                                            onChange={(e) => setAddressData('first_name', e.target.value)}
                                                            className={addressErrors.first_name ? 'border-red-500' : ''}
                                                        />
                                                    </div>

                                                    <div>
                                                        <label className="block text-sm font-medium text-gray-700 mb-1">
                                                            Last Name *
                                                        </label>
                                                        <Input
                                                            type="text"
                                                            value={addressData.last_name}
                                                            onChange={(e) => setAddressData('last_name', e.target.value)}
                                                            className={addressErrors.last_name ? 'border-red-500' : ''}
                                                        />
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
                                                    <p className="font-medium">{address.first_name} {address.last_name}</p>
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
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
