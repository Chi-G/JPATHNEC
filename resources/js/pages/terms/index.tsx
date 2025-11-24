import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '../../components/ui/header';
import { type SharedData } from '@/types';


const PrivacyPage: React.FC = () => {
  const { auth, cartCount = 0, wishlistCount = 0 } = usePage<SharedData>().props;

  return (
    <>
      <Head title="Privacy Policy - JPATHNEC" />

      <div className="min-h-screen bg-background">
        <Header user={auth?.user} cartCount={cartCount} wishlistCount={wishlistCount} />

        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto bg-card p-8 rounded-md shadow-sm">
              <div className="max-w-4xl mx-auto px-4 py-12">
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Terms of Service</h1>
                <p className="text-sm text-muted-foreground text-center mb-12">Effective Date: <strong>November 24, 2025</strong></p>

                
                <div className="prose prose-lg max-w-none text-foreground/90 space-y-8">
                    <section>   
                        <p>
                        Welcome to <strong>JPATHNEC</strong>, a Nigeria-based e-commerce platform specializing in premium men's and women's apparel and footwear. These Terms of Service govern your use of <Link href="/" className="text-primary underline">jpathnec.com</Link> and all related services.
                        </p>
                        <p className="mt-4">
                        By using our Services, you agree to these Terms. If you do not agree, please do not use the site.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-10">1. Eligibility</h2>
                        <p>You must be at least 18 years old and legally capable of entering into contracts.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-10">2. Orders & Payment</h2>
                        <ul className="list-disc pl-6 space-y-2">
                        <li>All prices are in Nigerian Naira (₦).</li>
                        <li>Orders are subject to acceptance and availability.</li>
                        <li>Payment is processed securely via Paystack.</li>
                        <li>We reserve the right to cancel orders due to pricing errors or stock issues.</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-10">3. Shipping & Delivery</h2>
                        <p>We deliver across Nigeria:</p>
                        <ul className="list-disc pl-6 space-y-2 mt-4">
                        <li>Port Harcourt: ₦1,500 flat rate</li>
                        <li>Other states: ₦2,500 – ₦4,000 depending on location</li>
                        <li>Estimated delivery: 2–7 business days</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-10">4. Returns & Refunds</h2>
                        <ul className="list-disc pl-6 space-y-2">
                        <li>7-day return window for unworn items with original tags</li>
                        <li>Contact support@jpathnec.com to initiate a return</li>
                        <li>Refunds processed within 5–7 business days</li>
                        <li>Shipping fees are non-refundable unless item is defective</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-10">5. Limitation of Liability</h2>
                        <p>JPATHNEC is not liable for indirect or consequential damages. Our total liability shall not exceed the amount you paid in the last 12 months.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-semibold mt-10">6. Governing Law</h2>
                        <p>These Terms are governed by the laws of Nigeria. Disputes shall be resolved in Port Harcourt, Rivers State.</p>
                    </section>

                    <section className="text-center py-10">
                        <p className="text-sm text-muted-foreground">
                        Questions? Email us at{' '}
                        <a href="mailto:support@jpathnec.com" className="text-primary underline">
                            support@jpathnec.com
                        </a>
                        </p>
                    </section>
                </div>

                <div className="text-center mt-12">
                  <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
                </div>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-muted/30 border-t border-border mt-16">
        <div className="container mx-auto px-4 py-8">
            <div className="text-center">
            <p className="text-sm text-muted-foreground">
                © {new Date().getFullYear()} JPATHNEC. All rights reserved.
            </p>
            <div className="flex items-center justify-center space-x-6 mt-4">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
                </Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
                </Link>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Support
                </Link>
            </div>
            </div>
        </div>
        </footer>
      </div>
    </>
  );
};

export default PrivacyPage;

