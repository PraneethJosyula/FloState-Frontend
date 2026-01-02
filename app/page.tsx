import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/navbar';
import { Zap, Clock, Flame, Users, ArrowRight } from 'lucide-react';

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">
        {/* Hero Section */}
        <section className="container max-w-screen-xl mx-auto px-4 py-24 md:py-32">
          <div className="max-w-2xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-8">
              <Zap className="h-4 w-4" />
              Track your productivity journey
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-6 leading-[1.1]">
              Build better{' '}
              <span className="text-primary">focus habits</span>
            </h1>
            
            <p className="text-lg text-muted-foreground mb-10 max-w-lg mx-auto leading-relaxed">
              Track your deep work sessions, build streaks, and share your progress with a community of focused individuals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/signup">
                <Button size="lg" className="w-full sm:w-auto">
                  Get Started Free
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="w-full sm:w-auto">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="border-t border-border bg-secondary/30">
          <div className="container max-w-screen-xl mx-auto px-4 py-24">
            <div className="text-center mb-16">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                Everything you need to stay focused
              </h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                Simple tools to track your productivity and build lasting habits.
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-violet-100 dark:bg-violet-500/20 mb-4">
                  <Clock className="h-6 w-6 text-violet-600 dark:text-violet-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Track Sessions</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Log your deep work sessions with categories, duration, and focus levels.
                </p>
              </div>
              
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 dark:bg-amber-500/20 mb-4">
                  <Flame className="h-6 w-6 text-amber-600 dark:text-amber-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Build Streaks</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Maintain consistency with daily streaks and productivity metrics.
                </p>
              </div>
              
              <div className="rounded-2xl border border-border bg-card p-6">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 dark:bg-emerald-500/20 mb-4">
                  <Users className="h-6 w-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Share & Connect</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Follow others, share your progress, and get inspired by the community.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="container max-w-screen-xl mx-auto px-4 py-24">
          <div className="rounded-3xl bg-primary p-12 md:p-16 text-center max-w-3xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-bold text-primary-foreground mb-4">
              Ready to get started?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-md mx-auto">
              Join thousands of users tracking their focus and building better habits.
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-white text-primary hover:bg-white/90">
                Start Your Journey
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </section>
      </main>
    </>
  );
}
