import React from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import Header from '../../components/ui/header';
import { type SharedData } from '@/types';

const SupportPage: React.FC = () => {
  const { auth, cartCount = 0, wishlistCount = 0 } = usePage<SharedData>().props;

  const waNumber = '2349010202010';
  const waMessage = encodeURIComponent('Hello JPATHNEC Support, I need help with my order.');
  const waUrl = `https://wa.me/${waNumber}?text=${waMessage}`;

  return (
    <>
      <Head title="Support - JPATHNEC" />

      <div className="min-h-screen bg-background">
        <Header user={auth?.user} cartCount={cartCount} wishlistCount={wishlistCount} />

        <main className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto bg-card p-8 rounded-md shadow-sm">
              <h1 className="text-3xl font-bold mb-4">Support</h1>
              <p className="text-base text-muted-foreground mb-4">Need help? Reach out to our support team — we're happy to assist.</p>

              <div className="space-y-4">
                <p>
                  For quick assistance, chat with our support on WhatsApp. Click the button below to open WhatsApp and start a conversation with our support team.
                </p>

                <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-4 sm:space-y-0 mt-4">
                  <a
                    href={waUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-md shadow-md"
                    aria-label="Chat with support on WhatsApp"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                      <path d="M20.52 3.48A11.9 11.9 0 0 0 12 0C5.373 0 .176 4.59.01 10.5a11.83 11.83 0 0 0 1.7 6.02L0 24l7.7-2.03a11.9 11.9 0 0 0 4.3.8h.01c6.627 0 11.824-4.591 11.99-10.5a11.9 11.9 0 0 0-3.48-8.79zM12 21.5a9.9 9.9 0 0 1-3.04-.47l-.22-.09L4 21l1.09-4.67-.14-.24A9.9 9.9 0 1 1 12 21.5z" />
                      <path d="M17.6 14.5c-.3-.15-1.77-.87-2.05-.97-.28-.09-.48-.15-.68.15-.2.3-.77.97-.95 1.17-.18.2-.36.22-.66.07-.3-.15-1.27-.47-2.42-1.48-.9-.8-1.5-1.78-1.67-2.08-.17-.3-.02-.46.13-.6.13-.13.3-.36.45-.54.15-.18.2-.3.3-.5.1-.2 0-.38-.01-.53-.01-.15-.68-1.64-.93-2.25-.24-.59-.49-.51-.68-.52l-.58-.01c-.2 0-.52.07-.8.33-.28.25-1.06 1.03-1.06 2.5 0 1.47 1.09 2.9 1.24 3.1.15.2 2.15 3.4 5.22 4.77 3.06 1.38 3.06.92 3.61.86.55-.07 1.77-.72 2.02-1.42.25-.7.25-1.3.18-1.42-.07-.12-.28-.2-.58-.35z" />
                    </svg>
                    Chat on WhatsApp
                  </a>

                  <a href="tel:+2349010202010" className="inline-flex items-center justify-center gap-2 border border-border px-5 py-3 rounded-md hover:bg-muted/10">
                    Call: +234 901 020 2010
                  </a>
                </div>

                <p className="text-sm text-muted-foreground mt-4">Prefer email? Send us details at <a href="mailto:support@jpathnec.com" className="text-primary underline">support@jpathnec.com</a> and include your order number.</p>
              </div>

              <div className="text-center mt-8">
                <Link href="/" className="text-primary hover:underline">← Back to Home</Link>
              </div>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-muted/30 border-t border-border mt-16">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center">
              <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} JPATHNEC. All rights reserved.</p>
              <div className="flex items-center justify-center space-x-6 mt-4">
                <Link href="/terms" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link>
                <Link href="/privacy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link>
                <Link href="/support" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Support</Link>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </>
  );
};

export default SupportPage;
