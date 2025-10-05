import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ChevronRight, Phone, Mail, MessageCircle, Clock, MapPin } from 'lucide-react';
import Header from '../components/ui/header';
import { WhatsAppSupportContact } from '../components/ui/whatsapp-contact';

interface ContactPageProps {
  auth?: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  cartCount?: number;
}

export default function ContactPage({ auth, cartCount = 0 }: ContactPageProps) {
  return (
    <>
      <Head title="Contact Us - JPATHNEC" />
      
      <Header user={auth?.user} cartCount={cartCount} />
      
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-gray-600 mb-4">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900">Contact Us</span>
          </div>

          {/* Header */}
          <div className="mb-12 text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Get in Touch</h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Have questions about your order, need product information, or want to provide feedback? 
              We're here to help you every step of the way.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
            {/* Contact Methods */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Contact Methods</h2>
                
                {/* WhatsApp - Primary */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                      <MessageCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">WhatsApp Chat</h3>
                      <p className="text-sm text-gray-600">Fastest response time - usually within minutes</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    Get instant support via WhatsApp. Perfect for order inquiries, product questions, 
                    delivery tracking, and quick assistance.
                  </p>
                  
                  <WhatsAppSupportContact 
                    size="lg"
                    className="w-full justify-center"
                  />
                </div>

                {/* Email */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Email Support</h3>
                      <p className="text-sm text-gray-600">Response within 24 hours</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    For detailed inquiries, complaints, or business partnerships.
                  </p>
                  
                  <a 
                    href="mailto:support@jpathnec.com"
                    className="text-blue-600 hover:text-blue-800 font-medium"
                  >
                    support@jpathnec.com
                  </a>
                </div>

                {/* Phone */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Phone className="h-6 w-6 text-purple-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Phone Support</h3>
                      <p className="text-sm text-gray-600">Available during business hours</p>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 mb-4">
                    Call us for urgent matters or complex inquiries that need immediate attention.
                  </p>
                  
                  <a 
                    href="tel:+2348012345678"
                    className="text-purple-600 hover:text-purple-800 font-medium text-lg"
                  >
                    +234 801 234 5678
                  </a>
                </div>
              </div>
            </div>

            {/* Business Info & Hours */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900 mb-6">Business Information</h2>
                
                {/* Business Hours */}
                <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Clock className="h-6 w-6 text-yellow-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Business Hours</h3>
                      <p className="text-sm text-gray-600">When we're available to help</p>
                    </div>
                  </div>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Monday - Friday</span>
                      <span className="text-gray-900">9:00 AM - 6:00 PM (WAT)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Saturday</span>
                      <span className="text-gray-900">10:00 AM - 4:00 PM (WAT)</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Sunday</span>
                      <span className="text-gray-900">Closed</span>
                    </div>
                  </div>
                  
                  <div className="mt-4 p-3 bg-green-50 rounded-md">
                    <p className="text-sm text-green-800">
                      <strong>WhatsApp:</strong> Available 24/7 for urgent order inquiries
                    </p>
                  </div>
                </div>

                {/* Location */}
                <div className="bg-white rounded-lg shadow-sm border p-6">
                  <div className="flex items-center mb-4">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                      <MapPin className="h-6 w-6 text-red-600" />
                    </div>
                    <div className="ml-4">
                      <h3 className="text-lg font-semibold text-gray-900">Our Location</h3>
                      <p className="text-sm text-gray-600">Visit our store or warehouse</p>
                    </div>
                  </div>
                  
                  <div className="text-gray-600">
                    <p>JPATHNEC Fashion Store</p>
                    <p>123 Fashion Street</p>
                    <p>Victoria Island, Lagos</p>
                    <p>Nigeria</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* FAQ Section */}
          <div className="bg-white rounded-lg shadow-sm border p-8">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
              Frequently Asked Questions
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">How can I track my order?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Visit your <Link href="/orders" className="text-primary hover:underline">My Orders</Link> page 
                  or use our <Link href="/track-order" className="text-primary hover:underline">order tracking</Link> tool 
                  with your order number.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What are your delivery times?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Standard delivery takes 3-7 business days within Nigeria. Express delivery is available 
                  for 1-3 business days in major cities.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">Can I modify my order after placing it?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Contact us immediately via WhatsApp if you need to modify your order. Changes are possible 
                  before the order is processed for shipping.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">What payment methods do you accept?</h3>
                <p className="text-sm text-gray-600 mb-4">
                  We accept bank transfers, Paystack, Flutterwave, and cash on delivery in select locations. 
                  All payments are secure and encrypted.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}