'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { ActivityDetail } from '@/lib/types/database';
import { fetchActivityById } from '@/lib/services/activities';
import { postComment, toggleLike } from '@/lib/services/interactions';
import { Navbar } from '@/components/navbar';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Heart, MessageCircle, Share2, Clock, Send, Flame, Loader2 } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function ActivityDetailPage() {
  const params = useParams();
  const activityId = params.id as string;
  const [activity, setActivity] = useState<ActivityDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLiked, setIsLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  useEffect(() => {
    loadActivity();
  }, [activityId]);

  const loadActivity = async () => {
    setLoading(true);
    const { data } = await fetchActivityById(activityId);
    if (data) {
      setActivity(data);
      setIsLiked(data.is_liked);
      setLikeCount(data.like_count);
    }
    setLoading(false);
  };

  const handleLike = async () => {
    const { liked } = await toggleLike(activityId);
    setIsLiked(liked);
    setLikeCount(prev => liked ? prev + 1 : prev - 1);
  };

  const handleComment = async () => {
    if (!commentText.trim() || !activity) return;
    
    setIsSubmitting(true);
    const { data } = await postComment(activityId, commentText);
    if (data) {
      await loadActivity();
      setCommentText('');
    }
    setIsSubmitting(false);
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0 && mins > 0) return `${hours}h ${mins}m`;
    if (hours > 0) return `${hours}h`;
    return `${mins}m`;
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </main>
      </>
    );
  }

  if (!activity) {
    return (
      <>
        <Navbar />
        <main className="min-h-screen flex items-center justify-center">
          <p className="text-muted-foreground">Activity not found</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container max-w-2xl mx-auto px-4 py-8">
          <Card className="mb-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <Link href={`/u/${activity.profile.username}`} className="flex items-center gap-3 group">
                <Avatar
                  src={activity.profile.avatar_url}
                  name={activity.profile.full_name || activity.profile.username}
                  size="lg"
                />
                <div>
                  <h2 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {activity.profile.full_name || activity.profile.username}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {formatDistanceToNow(new Date(activity.created_at), { addSuffix: true })}
                  </p>
                </div>
              </Link>
              <Badge>{activity.category}</Badge>
            </div>

            {/* Stats */}
            <div className="flex items-center gap-2 mb-4">
              <div className="inline-flex items-center gap-1.5 rounded-md bg-secondary px-2.5 py-1 text-sm font-medium text-secondary-foreground">
                <Clock className="h-3.5 w-3.5" />
                <span>{formatDuration(activity.duration_minutes)}</span>
              </div>
              {activity.focus_level && (
                <div className="inline-flex items-center gap-1.5 rounded-md bg-accent/10 px-2.5 py-1 text-sm font-medium text-accent">
                  <Flame className="h-3.5 w-3.5" />
                  <span>{activity.focus_level}/10</span>
                </div>
              )}
            </div>

            {/* Content */}
            {activity.note && (
              <p className="text-foreground text-lg mb-4">{activity.note}</p>
            )}

            {activity.evidence_url && (
              <div className="mb-4 rounded-lg overflow-hidden">
                <img
                  src={activity.evidence_url}
                  alt="Activity evidence"
                  className="w-full max-h-96 object-cover"
                />
              </div>
            )}

            {/* Actions */}
            <div className="flex items-center gap-1 pt-4 border-t border-border">
              <button
                onClick={handleLike}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium transition-colors",
                  isLiked 
                    ? "text-red-500 bg-red-500/10 hover:bg-red-500/20" 
                    : "text-muted-foreground hover:text-red-500 hover:bg-red-500/10"
                )}
              >
                <Heart className={cn("h-4 w-4", isLiked && "fill-current")} />
                <span>{likeCount}</span>
              </button>

              <button className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <MessageCircle className="h-4 w-4" />
                <span>{activity.comment_count}</span>
              </button>

              <button className="inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm font-medium text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors">
                <Share2 className="h-4 w-4" />
                <span>{activity.share_count}</span>
              </button>
            </div>
          </Card>

          {/* Comments */}
          <Card>
            <h3 className="font-semibold text-foreground mb-4">Comments</h3>
            
            {/* Input */}
            <div className="flex gap-2 mb-6">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 rounded-lg border border-input bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                onKeyPress={(e) => e.key === 'Enter' && handleComment()}
              />
              <Button onClick={handleComment} disabled={!commentText.trim() || isSubmitting} size="icon">
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              </Button>
            </div>

            {/* Comments List */}
            {activity.comments.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground text-sm">No comments yet. Be the first!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {activity.comments.map(comment => (
                  <div key={comment.id} className="flex gap-3 rounded-lg bg-muted/50 p-3">
                    <Link href={`/u/${comment.profile.username}`}>
                      <Avatar
                        src={comment.profile.avatar_url}
                        name={comment.profile.full_name || comment.profile.username}
                        size="sm"
                      />
                    </Link>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <Link href={`/u/${comment.profile.username}`}>
                          <span className="text-sm font-medium text-foreground hover:text-primary transition-colors">
                            {comment.profile.full_name || comment.profile.username}
                          </span>
                        </Link>
                        <span className="text-xs text-muted-foreground">
                          {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                        </span>
                      </div>
                      <p className="text-sm text-foreground">{comment.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </main>
    </>
  );
}
