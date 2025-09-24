import React from 'react';

const PasswordStrengthIndicator = ({ password }) => {
  const calculateStrength = (password) => {
    if (!password) return { score: 0, label: '', color: '' };

    let score = 0;
    const checks = {
      length: password?.length >= 8,
      lowercase: /[a-z]/?.test(password),
      uppercase: /[A-Z]/?.test(password),
      numbers: /\d/?.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/?.test(password)
    };

    score = Object.values(checks)?.filter(Boolean)?.length;

    const strengthLevels = {
      0: { label: '', color: '', width: '0%' },
      1: { label: 'Very Weak', color: 'bg-red-500', width: '20%' },
      2: { label: 'Weak', color: 'bg-orange-500', width: '40%' },
      3: { label: 'Fair', color: 'bg-yellow-500', width: '60%' },
      4: { label: 'Good', color: 'bg-blue-500', width: '80%' },
      5: { label: 'Strong', color: 'bg-green-500', width: '100%' }
    };

    return { ...strengthLevels?.[score], checks };
  };

  const strength = calculateStrength(password);

  if (!password) return null;

  return (
    <div className="mt-2 space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm text-muted-foreground">Password strength:</span>
        <span className={`text-sm font-medium ${
          strength?.label === 'Strong' ? 'text-green-600' :
          strength?.label === 'Good' ? 'text-blue-600' :
          strength?.label === 'Fair' ? 'text-yellow-600' :
          strength?.label === 'Weak'? 'text-orange-600' : 'text-red-600'
        }`}>
          {strength?.label}
        </span>
      </div>
      <div className="w-full bg-gray-200 rounded-full h-2">
        <div
          className={`h-2 rounded-full transition-all duration-300 ${strength?.color}`}
          style={{ width: strength?.width }}
        />
      </div>
      {strength?.checks && (
        <div className="text-xs text-muted-foreground space-y-1">
          <div className={`flex items-center space-x-2 ${strength?.checks?.length ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-1 h-1 rounded-full ${strength?.checks?.length ? 'bg-green-600' : 'bg-gray-400'}`} />
            <span>At least 8 characters</span>
          </div>
          <div className={`flex items-center space-x-2 ${strength?.checks?.lowercase ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-1 h-1 rounded-full ${strength?.checks?.lowercase ? 'bg-green-600' : 'bg-gray-400'}`} />
            <span>One lowercase letter</span>
          </div>
          <div className={`flex items-center space-x-2 ${strength?.checks?.uppercase ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-1 h-1 rounded-full ${strength?.checks?.uppercase ? 'bg-green-600' : 'bg-gray-400'}`} />
            <span>One uppercase letter</span>
          </div>
          <div className={`flex items-center space-x-2 ${strength?.checks?.numbers ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-1 h-1 rounded-full ${strength?.checks?.numbers ? 'bg-green-600' : 'bg-gray-400'}`} />
            <span>One number</span>
          </div>
          <div className={`flex items-center space-x-2 ${strength?.checks?.special ? 'text-green-600' : 'text-gray-400'}`}>
            <span className={`w-1 h-1 rounded-full ${strength?.checks?.special ? 'bg-green-600' : 'bg-gray-400'}`} />
            <span>One special character</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PasswordStrengthIndicator;
