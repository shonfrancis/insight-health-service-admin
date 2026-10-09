"use client";

import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { apiClient } from '@/lib/api-client';

import { useToast } from '@/components/ui/toast';

export default function Login() {
    const toast = useToast();
    const [selectedRole, setSelectedRole] = useState('super_admin');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const router = useRouter();
    const { setTheme } = useTheme();

    useEffect(() => {
        setTheme('light');
    }, [setTheme]);

    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = await apiClient('/login', {
                method: 'POST',
                body: JSON.stringify({ username, password, role: selectedRole }),
            });

            if (data.token) {
                localStorage.setItem('adminAuthToken', data.token);
                localStorage.setItem('userRole', data.user.role);
                localStorage.setItem('userInfo', JSON.stringify(data.user));

                toast.success("Login Successful", `Welcome back, ${data.user.name || 'User'}!`);

                if (data.user.role === 'clinician') {
                    router.push('/dashboard/schedule');
                } else {
                    router.push('/dashboard/overview');
                }
            }
        } catch (err: any) {
            console.warn("Backend login failed or unreachable, falling back to session preview mode:", err.message);
            toast.error("Authentication Error", err.message || "Invalid credentials provided.");
            setError(err.message || "Invalid credentials");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-transparent">

            {/* Left Column: Brand & Imagery (Hidden on mobile, visible on lg screens) */}
            <div className="relative hidden w-1/2 flex-col justify-between bg-brand p-12 lg:flex">
                {/* Placeholder for clinic imagery - automatically tinted by the brand background */}
                <div className="absolute inset-0 bg-[url('/login/login.jpg')] bg-cover bg-center opacity-80" />

                {/* <div className="relative z-10 text-white">
                    <h1 className="text-4xl font-bold tracking-tight">Insight Health Services</h1>
                    <p className="mt-2 font-Bold uppercase tracking-widest text-sm">
                        Administrative Portal
                    </p>
                </div>

                <div className="relative z-10">
                    <blockquote className="space-y-2 text-white">

                        <p className="text-lg font-medium text-white/90">
                            "Precision management for superior clinical outcomes."
                        </p>
                    </blockquote>
                </div> */}
            </div>

            {/* Right Column: Interactive Login Area */}
            <div className="flex w-full flex-col justify-center px-8 lg:w-1/2 sm:px-16 lg:px-24">
                <div className="mx-auto flex w-full max-w-md flex-col justify-center space-y-8">

                    <div className="flex flex-col space-y-2 text-center">
                        <Image
                            src="/logo/logo.png"
                            alt="Insight Health Services Logo"
                            width={200}
                            height={100}
                            className="mx-auto mb-4"
                        />
                        <h2 className="text-3xl font-semibold tracking-tight text-foreground">
                            Portal Access
                        </h2>
                        <p className="text-sm text-foreground/60">
                            Select your administrative clearance level to preview the dashboard experience.
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 flex items-center gap-3 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
                            <AlertCircle className="h-5 w-5 shrink-0" />
                            <span className="font-medium">{error}</span>
                        </div>
                    )}

                    <form onSubmit={handleLogin} className="space-y-6">
                        <div className="space-y-2">
                            {/*<label
                                htmlFor="role"
                                className="text-sm font-medium leading-none text-foreground"
                            >
                                Access Role
                            </label>
                            <div className="relative">
                                <select
                                    id="role"
                                    value={selectedRole}
                                    onChange={(e) => setSelectedRole(e.target.value)}
                                    className="flex h-12 w-full appearance-none bg-white/60 items-center rounded-md border border-foreground/20 bg-black/20 backdrop-blur-sm px-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                                >
                                    <option value="super_admin">Super Admin (Global Root Access)</option>
                                    <option value="administrator">Administrator (Clinic Management)</option>
                                    <option value="reception">Reception Staff (Front Desk Operations)</option>
                                    <option value="clinician">Sonographer / Clinician (Medical Staff)</option>
                                </select>
                                {/* Custom minimalist dropdown arrow */}
                               {/* <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-foreground/50">
                                    <svg className="h-4 w-4 fill-current" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                                        <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                                    </svg>
                                </div>
                            </div>*/}
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="username"
                                className="text-sm font-medium leading-none text-foreground"
                            >
                                Username
                            </label>
                            <input
                                id="username"
                                type="text"
                                required
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="flex h-12 w-full items-center rounded-md border border-foreground/20 bg-white/60 px-4 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                                placeholder="Enter your username"
                            />
                        </div>

                        <div className="space-y-2">
                            <label
                                htmlFor="password"
                                className="text-sm font-medium leading-none text-foreground"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="flex h-12 w-full items-center rounded-md border border-foreground/20 bg-white/60 pl-4 pr-12 text-sm text-foreground focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-colors"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/50 hover:text-foreground/80 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <Button
                            type="submit"
                            variant="filled"
                            size="lg"
                            className="w-full"
                        >
                            Initialize Dashboard
                        </Button>
                    </form>

                </div>
            </div>

        </div>
    );
}
