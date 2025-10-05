import React from 'react';
import { MessageCircle } from 'lucide-react';
import Button from './button';

interface WhatsAppContactProps {
  orderId?: string;
  productName?: string;
  productId?: string;
  message?: string;
  className?: string;
  size?: 'xs' | 'sm' | 'default' | 'lg' | 'xl' | 'icon';
  variant?: 'default' | 'outline' | 'ghost';
  context?: 'order' | 'product' | 'support' | 'tracking';
}

export default function WhatsAppContact({ 
  orderId, 
  productName, 
  productId,
  message,
  className = '',
  size = 'default',
  variant = 'default',
  context = 'support'
}: WhatsAppContactProps) {

    const phoneNumber = window.appConfig?.whatsappPhone || "+2347065910449";
  
  // Generate context-specific messages
  const generateMessage = () => {
    if (message) return message;
    
    switch (context) {
      case 'order':
        return `Hi! I need assistance with my order #${orderId}${productName ? ` for ${productName}` : ''}. Please help me with delivery details and tracking information.`;
      
      case 'product':
        return `Hi! I'm interested in ${productName}${productId ? ` (ID: ${productId})` : ''}. Can you provide more details about availability, delivery time, and any specifications?`;
      
      case 'tracking':
        return `Hi! I would like to track my order #${orderId}. Can you please provide me with the current status and estimated delivery time?`;
      
      case 'support':
      default:
        return `Hi! I need assistance with my JPATHNEC order. Please help me with my inquiry.`;
    }
  };
  
  const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(generateMessage())}`;
  
  const getButtonText = () => {
    switch (context) {
      case 'order':
        return 'Contact About Order';
      case 'product':
        return 'Ask About Product';
      case 'tracking':
        return 'Track Order';
      case 'support':
      default:
        return 'Chat on WhatsApp';
    }
  };
  
  return (
    <Button
      variant={variant}
      size={size}
      className={`bg-green-500 hover:bg-green-600 text-white border-green-500 hover:border-green-600 ${className}`}
      onClick={() => window.open(whatsappUrl, '_blank')}
    >
      <MessageCircle className="h-4 w-4 mr-2" />
      {getButtonText()}
    </Button>
  );
}

// Specific context components for easier use
export const WhatsAppOrderContact = (props: Omit<WhatsAppContactProps, 'context'>) => (
  <WhatsAppContact {...props} context="order" />
);

export const WhatsAppProductContact = (props: Omit<WhatsAppContactProps, 'context'>) => (
  <WhatsAppContact {...props} context="product" />
);

export const WhatsAppTrackingContact = (props: Omit<WhatsAppContactProps, 'context'>) => (
  <WhatsAppContact {...props} context="tracking" />
);

export const WhatsAppSupportContact = (props: Omit<WhatsAppContactProps, 'context'>) => (
  <WhatsAppContact {...props} context="support" />
);