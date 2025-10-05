import { Head, router, useForm, Link } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Monitor, Smartphone, Tablet, Trash2, LogOut, AlertTriangle, Eye, EyeOff, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import Header from '@/components/ui/header';
import Input from '@/components/ui/input';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Device {
  id: number;
  device_name: string;
  browser: string;
  platform: string;
  ip_address: string;
  is_current: boolean;
  last_used_at: string;
  description: string;
}

interface Props {
  devices: Device[];
  auth: {
    user: {
      id: number;
      name: string;
      email: string;
    };
  };
  cartCount?: number;
}

export default function Devices({ devices, auth, cartCount = 0 }: Props) {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [confirmText, setConfirmText] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const { data, setData, delete: deleteAccount, processing, errors } = useForm({
    password: '',
  });
  const getDeviceIcon = (device: Device) => {
    const platform = device.platform?.toLowerCase() || '';

    if (platform.includes('mobile') || platform.includes('android') || platform.includes('ios')) {
      return <Smartphone className="h-6 w-6" />;
    } else if (platform.includes('tablet') || platform.includes('ipad')) {
      return <Tablet className="h-6 w-6" />;
    }

    return <Monitor className="h-6 w-6" />;
  };

  const handleRemoveDevice = (deviceId: number) => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-medium">Remove Device</p>
          <p className="text-sm text-gray-600">Are you sure you want to remove this device?</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              router.delete(`/settings/devices/${deviceId}`, {
                onSuccess: () => {
                  toast.success('Device removed successfully');
                },
                onError: () => {
                  toast.error('Failed to remove device');
                }
              });
              toast.dismiss(t.id);
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Remove
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const handleRemoveAllOthers = () => {
    toast((t) => (
      <div className="flex flex-col gap-3">
        <div>
          <p className="font-medium">Remove All Other Devices</p>
          <p className="text-sm text-gray-600">
            Are you sure you want to remove all other devices? This will log them out.
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => {
              router.delete('/settings/devices', {
                onSuccess: () => {
                  toast.success('All other devices have been removed successfully');
                },
                onError: () => {
                  toast.error('Failed to remove devices');
                }
              });
              toast.dismiss(t.id);
            }}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700"
          >
            Remove All
          </button>
          <button
            onClick={() => toast.dismiss(t.id)}
            className="bg-gray-300 text-gray-700 px-3 py-1 rounded text-sm hover:bg-gray-400"
          >
            Cancel
          </button>
        </div>
      </div>
    ), {
      duration: Infinity,
    });
  };

  const handleDeleteAccount = () => {
    if (confirmText !== 'DELETE') {
      toast.error('Please type "DELETE" to confirm account deletion');
      return;
    }

    if (!data.password) {
      toast.error('Please enter your password to confirm account deletion');
      return;
    }

    deleteAccount('/settings/profile', {
      onSuccess: () => {
        toast.success('Your account has been permanently deleted. You have been logged out.', {
          duration: 4000,
        });
        // The backend will handle logout and redirect to home page
      },
      onError: (errors) => {
        if (errors.password) {
          toast.error('Invalid password. Please try again.');
        } else {
          toast.error('Failed to delete account. Please try again.');
        }
      }
    });
  };

  return (
    <>
      <Head title="Device settings" />

      {/* Add Header */}
      <Header user={auth.user} cartCount={cartCount} />

      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center space-x-2 text-sm text-gray-600 mb-6">
            <Link href="/" className="hover:text-primary">Home</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <Link href="/settings/profile" className="hover:text-primary">Settings</Link>
            <ChevronRight className="h-4 w-4 mx-2" />
            <span className="text-gray-900 font-medium">Devices</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">Device Management</h1>
            <p className="text-gray-600 mt-1">
              Manage devices that have accessed your account
            </p>
          </div>

          <div className="space-y-4">
            {devices.map((device) => (
              <Card key={device.id}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex items-start space-x-4">
                      <div className="text-muted-foreground">
                        {getDeviceIcon(device)}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <h4 className="font-medium">
                            {device.device_name || device.description}
                          </h4>
                          {device.is_current && (
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                              Current
                            </span>
                          )}
                        </div>
                        <div className="mt-1 space-y-1 text-sm text-muted-foreground">
                          {device.browser && (
                            <p>{device.browser}</p>
                          )}
                          <p>IP Address: {device.ip_address}</p>
                          <p>Last used: {format(new Date(device.last_used_at), 'PPp')}</p>
                        </div>
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleRemoveDevice(device.id)}
                      disabled={device.is_current || devices.length <= 1}
                      className={`${
                        device.is_current || devices.length <= 1
                          ? 'bg-red-100 border-red-300 text-red-400 cursor-not-allowed hover:bg-red-100'
                          : 'text-destructive hover:text-destructive border-red-300 hover:bg-red-50'
                      }`}
                      title={
                        device.is_current
                          ? 'Cannot remove current device'
                          : devices.length <= 1
                          ? 'Cannot remove the only device'
                          : 'Remove this device'
                      }
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {devices.filter(device => !device.is_current).length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Remove All Other Devices</CardTitle>
                <CardDescription>
                  This will log out all other devices and remove them from your account.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button
                  variant="destructive"
                  onClick={handleRemoveAllOthers}
                  className="gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Remove All Other Devices
                </Button>
              </CardContent>
            </Card>
          )}

          {devices.length === 0 && (
            <Card>
              <CardContent className="p-6 text-center">
                <Monitor className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-medium">No devices found</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Your devices will appear here once you start using them.
                </p>
              </CardContent>
            </Card>
          )}

          {/* Account Deletion Section */}
          <Card className="mt-8 border-red-200">
            <CardHeader>
              <CardTitle className="text-red-600 flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Danger Zone
              </CardTitle>
              <CardDescription>
                Permanently delete your account and all associated data. This action cannot be undone.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {!showDeleteConfirm ? (
                <Button
                  variant="destructive"
                  onClick={() => {
                    setShowDeleteConfirm(true);
                    setConfirmText('');
                    setData('password', '');
                    setShowPassword(false);
                  }}
                  className="gap-2"
                >
                  <Trash2 className="h-4 w-4" />
                  Delete My Account
                </Button>
              ) : (
                <div className="space-y-4 p-4 border border-red-200 rounded-lg bg-red-50">
                  <div className="space-y-2">
                    <h4 className="font-medium text-red-800">Confirm Account Deletion</h4>
                    <p className="text-sm text-red-700">
                      This will permanently delete your account and all associated data including:
                    </p>
                    <ul className="text-sm text-red-700 list-disc list-inside space-y-1">
                      <li>Profile information</li>
                      <li>Order history</li>
                      <li>Saved addresses</li>
                      <li>All personal data</li>
                    </ul>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-medium text-red-800 mb-2">
                        Type "DELETE" to confirm:
                      </label>
                      <Input
                        type="text"
                        value={confirmText}
                        onChange={(e) => setConfirmText(e.target.value)}
                        placeholder="Type DELETE here"
                        className="border-red-300 focus:border-red-500 focus:ring-red-500"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-red-800 mb-2">
                        Enter your password to confirm:
                      </label>
                      <div className="relative">
                        <Input
                          type={showPassword ? "text" : "password"}
                          value={data.password}
                          onChange={(e) => setData('password', e.target.value)}
                          placeholder="Enter your current password"
                          className={`border-red-300 focus:border-red-500 focus:ring-red-500 pr-10 ${
                            errors.password ? 'border-red-500' : ''
                          }`}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-red-400 hover:text-red-600" />
                          ) : (
                            <Eye className="h-4 w-4 text-red-400 hover:text-red-600" />
                          )}
                        </button>
                      </div>
                      {errors.password && (
                        <p className="text-red-600 text-sm mt-1">{errors.password}</p>
                      )}
                    </div>

                    <div className="flex gap-3">
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowDeleteConfirm(false);
                          setConfirmText('');
                          setData('password', '');
                          setShowPassword(false);
                        }}
                      >
                        Cancel
                      </Button>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        disabled={confirmText !== 'DELETE' || !data.password || processing}
                        className="gap-2"
                      >
                        {processing ? 'Deleting...' : (
                          <>
                            <Trash2 className="h-4 w-4" />
                            Permanently Delete Account
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
