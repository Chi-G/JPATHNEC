import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, CheckCircle, Clock } from 'lucide-react';

interface Props {
    status?: string;
}

export default function VerifyEmail({ status }: Props) {
    const { post, processing } = useForm({});

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/email/verification-notification');
    };

    return (
        <>
            <Head title="Email Verification" />

            <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full space-y-8">
                    <div className="text-center">
                        <Link href="/" className="inline-block">
                            <img
                                className="mx-auto h-12 w-auto"
                                src="/logo.png"
                                alt="JPATHNEC"
                            />
                        </Link>
                        <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
                            Verify your email address
                        </h2>
                    </div>

                    <Card>
                        <CardHeader className="text-center">
                            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                                <Mail className="h-8 w-8 text-blue-600" />
                            </div>
                            <CardTitle>Check your email</CardTitle>
                            <CardDescription>
                                We've sent a verification link to your email address. Please click the link to verify your account and start shopping.
                            </CardDescription>
                        </CardHeader>

                        <CardContent className="space-y-4">
                            {status === 'registration-success' && (
                                <Alert className="border-green-200 bg-green-50">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <AlertDescription className="text-green-800">
                                        Registration successful! Please check your email and click the verification link to activate your account.
                                    </AlertDescription>
                                </Alert>
                            )}

                            {status === 'verification-link-sent' && (
                                <Alert>
                                    <CheckCircle className="h-4 w-4" />
                                    <AlertDescription>
                                        A new verification link has been sent to your email address.
                                    </AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-4">
                                <div className="text-sm text-gray-600 text-center">
                                    <p className="mb-2">Didn't receive the email?</p>
                                    <ul className="text-xs space-y-1">
                                        <li>• Check your spam/junk folder</li>
                                        <li>• Make sure you entered the correct email address</li>
                                        <li>• Wait a few minutes for the email to arrive</li>
                                    </ul>
                                </div>

                                <form onSubmit={submit}>
                                    <Button
                                        type="submit"
                                        className="w-full"
                                        disabled={processing}
                                    >
                                        {processing && (
                                            <Clock className="mr-2 h-4 w-4 animate-spin" />
                                        )}
                                        {processing ? 'Sending...' : 'Resend verification email'}
                                    </Button>
                                </form>
                            </div>

                            <div className="text-center text-sm">
                                <Link
                                    href="/logout"
                                    method="post"
                                    as="button"
                                    className="text-gray-600 hover:text-gray-900 underline"
                                >
                                    Sign out and use a different account
                                </Link>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="text-center text-sm text-gray-600">
                        <p>
                            Need help? Contact us at{' '}
                            <a href="mailto:noreply@jpathnec.com" className="text-blue-600 hover:text-blue-500">
                                support@jpathnec.com
                            </a>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
