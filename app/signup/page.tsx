'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signUpWithEmail } from '@/lib/services/auth';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Zap, Mail, Lock, User, AtSign, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const { user, error: authError } = await signUpWithEmail(email, password, {
      username,
      full_name: fullName,
    });
    
    if (authError || !user) {
      setError(authError?.message || 'Failed to sign up');
      setLoading(false);
      return;
    }

    // After signup, redirect to login or show success message
    // Supabase may require email confirmation depending on settings
    router.push('/feed');
    router.refresh();
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-sm">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary mb-4">
              <Zap className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-2xl font-bold text-foreground mb-1">Create account</h1>
            <p className="text-muted-foreground text-sm">Start tracking your productivity</p>
          </div>

          <Card>
            {error && (
              <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/20 p-3 text-destructive text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="John Doe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Username
                </label>
                <div className="relative">
                  <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="johndoe"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="you@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    minLength={6}
                    className="w-full rounded-lg border border-input bg-background pl-10 pr-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                    placeholder="••••••••"
                  />
                </div>
                <p className="mt-1.5 text-xs text-muted-foreground">Must be at least 6 characters</p>
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  'Create Account'
                )}
              </Button>
            </form>

            <p className="mt-6 text-center text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="text-primary font-medium hover:underline">
                Sign in
              </Link>
            </p>
          </Card>
        </div>
      </main>
    </>
  );
}
