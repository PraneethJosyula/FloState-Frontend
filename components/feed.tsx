'use client';

import { useState, useEffect } from 'react';
import { ActivityWithProfile } from '@/lib/types/database';
import { fetchFeed } from '@/lib/services/activities';
import { ActivityCard } from './activity-card';
import { Button } from './ui/button';
import { Users, Globe, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export function Feed() {
  const [activities, setActivities] = useState<ActivityWithProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'following' | 'global'>('following');
  const [page, setPage] = useState(1);

  useEffect(() => {
    loadFeed();
  }, [filter, page]);

  const loadFeed = async () => {
    setLoading(true);
    const { data } = await fetchFeed({ filter, page, limit: 20 });
    if (data) {
      if (page === 1) {
        setActivities(data);
      } else {
        setActivities(prev => [...prev, ...data]);
      }
    }
    setLoading(false);
  };

  return (
    <div className="max-w-2xl mx-auto">
      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="inline-flex items-center rounded-lg bg-muted p-1">
          <button
            onClick={() => { setFilter('following'); setPage(1); }}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              filter === 'following' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Users className="h-4 w-4" />
            Following
          </button>
          <button
            onClick={() => { setFilter('global'); setPage(1); }}
            className={cn(
              "inline-flex items-center gap-2 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
              filter === 'global' 
                ? "bg-background text-foreground shadow-sm" 
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Globe className="h-4 w-4" />
            Global
          </button>
        </div>
      </div>

      {/* Content */}
      {loading && activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
          <p className="text-muted-foreground">Loading feed...</p>
        </div>
      ) : activities.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-muted mb-4">
            <Users className="h-7 w-7 text-muted-foreground" />
          </div>
          <p className="text-foreground font-medium mb-1">No activities yet</p>
          <p className="text-muted-foreground text-sm">Start following people to see their sessions!</p>
        </div>
      ) : (
        <>
          {activities.map(activity => (
            <ActivityCard key={activity.id} activity={activity} />
          ))}
          
          {activities.length >= 20 && (
            <div className="text-center mt-6">
              <Button variant="outline" onClick={() => setPage(prev => prev + 1)} disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Loading...
                  </>
                ) : (
                  'Load More'
                )}
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
