import React from 'react';
import Icon from '../../../../components/AppIcon';

const TrustSignals = () => {
  const trustFeatures = [
    {
      icon: 'Shield',
      title: 'Secure Registration',
      description: 'Your data is protected with 256-bit SSL encryption'
    },
    {
      icon: 'Lock',
      title: 'Privacy Protected',
      description: 'We never share your personal information with third parties'
    },
    {
      icon: 'CheckCircle',
      title: 'Verified Platform',
      description: 'Trusted by over 50,000+ satisfied customers'
    }
  ];

  return (
    <div className="bg-muted/30 rounded-lg p-6 space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Why register with JPATHNEC?</h3>
      <div className="space-y-4">
        {trustFeatures?.map((feature, index) => (
          <div key={index} className="flex items-start space-x-3">
            <div className="flex-shrink-0 w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
              <Icon name={feature?.icon} size={16} className="text-primary" />
            </div>
            <div>
              <h4 className="font-medium text-foreground text-sm">{feature?.title}</h4>
              <p className="text-xs text-muted-foreground mt-1">{feature?.description}</p>
            </div>
          </div>
        ))}
      </div>
      <div className="pt-4 border-t border-border">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2">
            <Icon name="Shield" size={16} className="text-green-600" />
            <span className="text-xs text-muted-foreground">SSL Secured</span>
          </div>
          <div className="flex items-center space-x-2">
            <Icon name="Award" size={16} className="text-blue-600" />
            <span className="text-xs text-muted-foreground">Verified Business</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrustSignals;
