import React, { useState, useEffect } from 'react';
import Button from '../../../../components/ui/button';
import Icon from '../../../../components/AppIcon';

const EmailVerificationModal = ({ isOpen, onClose, email, onResendCode }) => {
  const [verificationCode, setVerificationCode] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (isOpen && resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else if (resendTimer === 0) {
      setCanResend(true);
    }
  }, [isOpen, resendTimer]);

  const handleCodeChange = (index, value) => {
    if (value?.length <= 1 && /^\d*$/?.test(value)) {
      const newCode = [...verificationCode];
      newCode[index] = value;
      setVerificationCode(newCode);

      // Auto-focus next input
      if (value && index < 5) {
        const nextInput = document.getElementById(`code-${index + 1}`);
        if (nextInput) nextInput?.focus();
      }
    }
  };

  const handleKeyDown = (index, e) => {
    if (e?.key === 'Backspace' && !verificationCode?.[index] && index > 0) {
      const prevInput = document.getElementById(`code-${index - 1}`);
      if (prevInput) prevInput?.focus();
    }
  };

  const handleVerify = async () => {
    const code = verificationCode?.join('');
    if (code?.length === 6) {
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        onClose();
        // Redirect to success page or dashboard
        window.location.href = '/home';
      }, 2000);
    }
  };

  const handleResend = () => {
    if (canResend) {
      onResendCode();
      setResendTimer(60);
      setCanResend(false);
      setVerificationCode(['', '', '', '', '', '']);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-background rounded-lg shadow-elevation-md max-w-md w-full p-6">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="Mail" size={24} className="text-primary" />
          </div>
          <h2 className="text-xl font-semibold text-foreground mb-2">Verify Your Email</h2>
          <p className="text-muted-foreground text-sm">
            We've sent a 6-digit verification code to
            <br />
            <span className="font-medium text-foreground">{email}</span>
          </p>
        </div>

        <div className="space-y-6">
          <div className="flex justify-center space-x-3">
            {verificationCode?.map((digit, index) => (
              <input
                key={index}
                id={`code-${index}`}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleCodeChange(index, e?.target?.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className="w-12 h-12 text-center text-lg font-semibold border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            ))}
          </div>

          <Button
            fullWidth
            onClick={handleVerify}
            disabled={verificationCode?.join('')?.length !== 6}
            loading={isLoading}
          >
            Verify Email
          </Button>

          <div className="text-center">
            <p className="text-sm text-muted-foreground mb-2">
              Didn't receive the code?
            </p>
            {canResend ? (
              <Button variant="link" onClick={handleResend} className="p-0 h-auto">
                Resend Code
              </Button>
            ) : (
              <p className="text-sm text-muted-foreground">
                Resend in {resendTimer}s
              </p>
            )}
          </div>
        </div>

        <Button
          variant="ghost"
          size="icon"
          onClick={onClose}
          className="absolute top-4 right-4"
        >
          <Icon name="X" size={20} />
        </Button>
      </div>
    </div>
  );
};

export default EmailVerificationModal;
