import { Feed } from '@/components/feed';
import { Navbar } from '@/components/navbar';

export default function FeedPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background">
        <div className="container max-w-screen-xl mx-auto px-4 py-8">
          <Feed />
        </div>
      </main>
    </>
  );
}
