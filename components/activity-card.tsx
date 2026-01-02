'use client';

import Image from 'next/image';
import { ActivityWithProfile } from '@/lib/types/database';
import { Card } from './ui/card';
import { Avatar } from './ui/avatar';
import { Badge } from './ui/badge';
import { Heart, MessageCircle, Share2, Clock, Flame } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useState } from 'react';
import { toggleLike } from '@/lib/services/interactions';
import Link from 'next/link';
import { cn } from '@/lib/utils';

interface ActivityCardProps {
  activity: ActivityWithProfile;
  onLike?: () => void;
}

export function ActivityCard({ activity, onLike }: ActivityCardProps) {
  const [isLiked, setIsLiked] = useState(activity.is_liked);
  const [likeCount, setLikeCount] = useState(activity.like_count);
  const [isLiking, setIsLiking] = useState(false);

  const handleLike = async () => {
    if (isLiking) return;
    
    setIsLiking(true);
    const newLiked = !isLiked;
    setIsLiked(newLiked);
    setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    
    const { liked, error } = await toggleLike(activity.id);
    
    if (error) {
      setIsLiked(!newLiked);
      setLikeCount(prev => newLiked ? prev - 1 : prev + 1);
    } else {
      setIsLiked(liked);
      if (onLike) onLike();
    }
    
    setIsLiking(false);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  return (
    <Card className="mb-4 transition-shadow hover:shadow-md">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <Link href={`/u/${activity.profile.username}`} className="flex items-center gap-3 group min-w-0">
          <Avatar
            src={activity.profile.avatar_url}
            name={activity.profile.full_name || activity.profile.username}
            size="md"
          />
          <div className="min-w-0">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors truncate">
              {activity.profile.full_name || activity.profile.username}
            </h3>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
            </p>
          </div>
        </Link>
        <Badge>{activity.category}</Badge>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-2 mt-4">
        <div className="inline-flex items-center gap-1.5 rounded-lg bg-secondary px-2.5 py-1.5 text-sm font-medium text-secondary-foreground">
          <Clock className="h-4 w-4 text-muted-foreground" />
          <span>{formatDuration(activity.duration_minutes)}</span>
        </div>
        {activity.focus_level && (
          <div className="inline-flex items-center gap-1.5 rounded-lg bg-amber-100 dark:bg-amber-500/20 px-2.5 py-1.5 text-sm font-medium text-amber-700 dark:text-amber-300">
            <Flame className="h-4 w-4" />
            <span>{activity.focus_level}/10</span>
          </div>
        )}
      </div>

      {/* Content */}
      {activity.note && (
        <p className="mt-4 text-foreground leading-relaxed">{activity.note}</p>
      )}

      {/* Evidence Image */}
      {activity.evidence_url && (
        <div className="mt-4 rounded-xl overflow-hidden bg-secondary relative h-80">
          <Image
            src={activity.evidence_url}
            alt="Activity evidence"
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-1 mt-4 pt-4 border-t border-border">
        <button
          onClick={handleLike}
          disabled={isLiking}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
            isLiked 
              ? "text-rose-600 bg-rose-100 dark:bg-rose-500/20 dark:text-rose-400" 
              : "text-muted-foreground hover:text-rose-600 hover:bg-rose-100 dark:hover:bg-rose-500/20"
          )}
        >
          <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
          <span>{likeCount}</span>
        </button>

        <Link href={`/activity/${activity.id}`}>
          <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
            <MessageCircle className="h-4 w-4" />
            <span>{activity.comment_count}</span>
          </button>
        </Link>

        <button className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
          <Share2 className="h-4 w-4" />
          <span>{activity.share_count}</span>
        </button>
      </div>
    </Card>
  );
}
