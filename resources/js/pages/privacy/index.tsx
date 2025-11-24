import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { type SharedData } from '@/types';
import Header from '../../components/ui/header';


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
                <h1 className="text-3xl md:text-4xl font-bold text-center mb-8">Privacy Policy</h1>
                <p className="text-sm text-muted-foreground text-center mb-12">Effective Date: <strong>November 24, 2025</strong></p>

                <div className="prose prose-lg max-w-none text-foreground/90 space-y-8">
                  <section>
                    <p>
                      At <strong>JPATHNEC</strong>, we respect your privacy. This Privacy Policy explains how we collect, use, and protect
                      your personal information when you shop at <Link href="/" className="text-primary underline">jpathnec.com</Link>.
                    </p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mt-10">1. Information We Collect</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Name, email, phone number, and delivery address</li>
                      <li>Order and payment details (processed securely via Paystack)</li>
                      <li>Browsing behavior (pages visited, device info)</li>
                      <li>Cookies for cart functionality and analytics</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mt-10">2. How We Use Your Information</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Process and fulfill your orders</li>
                      <li>Send order confirmations, shipping updates, and support replies</li>
                      <li>Improve our website and customer experience</li>
                      <li>Send promotional offers (only if you opt-in)</li>
                    </ul>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mt-10">3. Data Security</h2>
                    <p>We use HTTPS encryption, secure payment gateways, and industry-standard protections. Your card details are never stored on our servers.</p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mt-10">4. Your Rights (NDPR Compliant)</h2>
                    <ul className="list-disc pl-6 space-y-2">
                      <li>Access, correct, or delete your personal data</li>
                      <li>Opt out of marketing emails anytime</li>
                      <li>Request data deletion (subject to legal requirements)</li>
                    </ul>
                    <p className="mt-4">Email your request to: <a href="mailto:privacy@jpathnec.com" className="text-primary underline">privacy@jpathnec.com</a></p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mt-10">5. Third-Party Sharing</h2>
                    <p>We only share data with trusted partners:</p>
                    <ul className="list-disc pl-6 space-y-1 mt-4">
                      <li>Paystack (payments)</li>
                      <li>Courier companies (delivery)</li>
                      <li>Email/SMS providers (notifications)</li>
                    </ul>
                    <p className="mt-4">We never sell your data.</p>
                  </section>

                  <section>
                    <h2 className="text-2xl font-semibold mt-10">6. Contact Us</h2>
                    <p>Questions about your privacy? Reach us at <a href="mailto:privacy@jpathnec.com" className="text-primary underline">privacy@jpathnec.com</a></p>
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

