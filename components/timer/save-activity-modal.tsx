'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { X, Clock, Image as ImageIcon, Loader2, Flame } from 'lucide-react';
import { createActivity } from '@/lib/services/activities';
import { cn } from '@/lib/utils';

interface SaveActivityModalProps {
  duration: number;
  category: string;
  onClose: () => void;
  onSave: () => void;
}

export function SaveActivityModal({ duration, category, onClose, onSave }: SaveActivityModalProps) {
  const [note, setNote] = useState('');
  const [focusLevel, setFocusLevel] = useState<number>(7);
  const [mediaPreview, setMediaPreview] = useState<string | null>(null);
  const [mediaFile, setMediaFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(category);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const categories = ['Deep Work', 'Coding', 'Reading', 'Writing', 'Design', 'Learning', 'Exercise', 'Other'];

  const formatDuration = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    if (mins > 0) return `${mins}m`;
    return `${seconds}s`;
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setMediaFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSaving(true);

    const durationMinutes = Math.max(1, Math.round(duration / 60));

    // In a real app, we'd upload the media first
    const evidenceUrl = mediaPreview; // For mock, we'll use the data URL

    await createActivity({
      category: selectedCategory,
      duration_minutes: durationMinutes,
      note: note || undefined,
      evidence_url: evidenceUrl || undefined,
      focus_level: focusLevel,
      visibility: 'public',
    });

    setSaving(false);
    onSave();
  };

  const handleDiscard = () => {
    onClose();
  };

  const getFocusLabel = (level: number) => {
    if (level >= 9) return 'Flow state!';
    if (level >= 7) return 'Very focused';
    if (level >= 5) return 'Good focus';
    if (level >= 3) return 'Some distractions';
    return 'Distracted';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-foreground">Save Activity</h2>
          <Button variant="ghost" size="icon" onClick={onClose} className="h-8 w-8">
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Duration Display */}
        <div className="flex items-center gap-4 p-4 rounded-xl bg-primary/10 mb-6">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
            <Clock className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Session Duration</p>
            <p className="text-2xl font-bold text-primary">{formatDuration(duration)}</p>
          </div>
        </div>

        {/* Category Selection */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">Category</label>
          <div className="flex flex-wrap gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={cn(
                  "px-3 py-1.5 rounded-full text-sm font-medium transition-all",
                  selectedCategory === cat
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Note */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            What did you work on?
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Describe your session..."
            rows={3}
            className="w-full rounded-xl border border-input bg-background px-4 py-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring resize-none"
          />
        </div>

        {/* Focus Level */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-3">
            Focus Level
          </label>
          <div className="p-4 rounded-xl bg-secondary/50">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Flame className={cn(
                  "h-5 w-5",
                  focusLevel >= 8 ? "text-amber-500" : focusLevel >= 5 ? "text-amber-400" : "text-muted-foreground"
                )} />
                <span className="text-2xl font-bold text-foreground">{focusLevel}</span>
                <span className="text-muted-foreground">/10</span>
              </div>
              <span className="text-sm font-medium text-muted-foreground">
                {getFocusLabel(focusLevel)}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={focusLevel}
              onChange={(e) => setFocusLevel(Number(e.target.value))}
              className="w-full h-2 bg-border rounded-full appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Distracted</span>
              <span>Flow State</span>
            </div>
          </div>
        </div>

        {/* Media Upload */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-foreground mb-2">
            Add Evidence <span className="text-muted-foreground font-normal">(optional)</span>
          </label>
          
          {mediaPreview ? (
            <div className="relative rounded-xl overflow-hidden h-48">
              <Image 
                src={mediaPreview} 
                alt="Preview" 
                fill
                className="object-cover" 
              />
              <button
                onClick={() => {
                  setMediaPreview(null);
                  setMediaFile(null);
                }}
                className="absolute top-2 right-2 p-1.5 rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors z-10"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => fileInputRef.current?.click()}
              className="w-full p-8 rounded-xl border-2 border-dashed border-border hover:border-primary/50 hover:bg-primary/5 transition-all"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary">
                  <ImageIcon className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">Click to upload an image</p>
              </div>
            </button>
          )}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="hidden"
          />
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleDiscard} className="flex-1">
            Discard
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex-1">
            {saving ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              'Save Activity'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}
