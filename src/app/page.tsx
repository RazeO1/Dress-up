import { Hero } from '@/components/marketing/hero';
import { FeatureGrid } from '@/components/marketing/feature-grid';
import { Showcase } from '@/components/marketing/showcase';
import { Footer } from '@/components/marketing/footer';
import { MarketingHeader } from '@/components/marketing/header';

export default function Home() {
  return (
    <>
      <MarketingHeader />
      <main>
        <Hero />
        <Showcase />
        <FeatureGrid />
      </main>
      <Footer />
    </>
  );
}
