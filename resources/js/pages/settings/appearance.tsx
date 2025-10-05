import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight } from 'lucide-react';

import AppearanceTabs from '@/components/appearance-tabs';
import Header from '@/components/ui/header';

interface User {
    id: number;
    name: string;
    email: string;
}

interface AppearanceProps {
    auth: {
        user: User;
    };
    cartCount?: number;
}

export default function Appearance({ auth, cartCount = 0 }: AppearanceProps) {
    return (
        <>
            <Head title="Appearance Settings - JPATHNEC" />
            
            {/* Add Header */}
            <Header user={auth.user} cartCount={cartCount} />
            
            <div className="min-h-screen bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center text-sm text-gray-600 mb-4">
                            <Link href="/" className="hover:text-primary">Home</Link>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <Link href="/settings/profile" className="hover:text-primary">Settings</Link>
                            <ChevronRight className="h-4 w-4 mx-2" />
                            <span className="text-gray-900">Appearance</span>
                        </div>
                        
                        <h1 className="text-3xl font-bold text-gray-900">Appearance Settings</h1>
                        <p className="text-gray-600 mt-1">
                            Update your account's appearance settings
                        </p>
                    </div>

                    {/* Content */}
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
                        <div className="p-6">
                            <AppearanceTabs />
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
