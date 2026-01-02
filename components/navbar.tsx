'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from './ui/button';
import { Avatar } from './ui/avatar';
import { Home, User, Moon, Sun, Zap, Plus } from 'lucide-react';
import { useState, useEffect } from 'react';
import { getCurrentUser, onAuthStateChange } from '@/lib/services/auth';
import { StartActivityModal } from './timer/start-activity-modal';
import { useTimer } from '@/lib/context/timer-context';

export function Navbar() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [darkMode, setDarkMode] = useState(false);
  const [showStartModal, setShowStartModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { state: timerState } = useTimer();

  useEffect(() => {
    loadUser();
    const isDark = document.documentElement.classList.contains('dark');
    setDarkMode(isDark);

    // Subscribe to auth state changes
    const unsubscribe = onAuthStateChange((event, session) => {
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        loadUser();
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const loadUser = async () => {
    setLoading(true);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  const toggleDarkMode = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    if (newDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  };

  useEffect(() => {
    const theme = localStorage.getItem('theme');
    if (theme === 'dark' || (!theme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setDarkMode(true);
    }
  }, []);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 max-w-screen-xl items-center mx-auto px-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 mr-6">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-bold text-foreground hidden sm:inline-block">FocusFlow</span>
          </Link>

          {/* Navigation */}
          {user && (
            <nav className="flex items-center gap-1">
              <Link href="/feed">
                <Button variant={pathname === '/feed' ? 'secondary' : 'ghost'} size="sm">
                  <Home className="h-4 w-4" />
                  <span className="hidden sm:inline">Feed</span>
                </Button>
              </Link>
              <Link href={`/u/${user.profile?.username || 'me'}`}>
                <Button variant={pathname?.startsWith('/u/') ? 'secondary' : 'ghost'} size="sm">
                  <User className="h-4 w-4" />
                  <span className="hidden sm:inline">Profile</span>
                </Button>
              </Link>
            </nav>
          )}

          {/* Spacer */}
          <div className="flex-1" />

          {/* Right Section */}
          <div className="flex items-center gap-2">
            {/* Start Activity Button */}
            {user && !timerState.isRunning && (
              <Button onClick={() => setShowStartModal(true)} size="sm">
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Start Session</span>
              </Button>
            )}

            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>

            {user ? (
              <Link href={`/u/${user.profile?.username || 'me'}`}>
                <Avatar
                  src={user.profile?.avatar_url}
                  name={user.profile?.full_name || user.profile?.username}
                  size="sm"
                />
              </Link>
            ) : (
              <div className="flex items-center gap-2">
                <Link href="/login">
                  <Button variant="ghost" size="sm">Log In</Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm">Sign Up</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </header>

      {showStartModal && (
        <StartActivityModal onClose={() => setShowStartModal(false)} />
      )}
    </>
  );
}
