'use client';

import { ProFeatureCard } from '@/components/dashboard/ProFeatureCard';

export default function IntegrationsPage() {
  return (
    <ProFeatureCard
      feature="pixel_ga"
      title="Integrações"
      description="Conecte Meta Pixel e Google Analytics à sua bio."
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2">Meta Pixel ID</label>
          <input
            disabled
            placeholder="123456789012345"
            className="brutal-input px-3 py-2 w-full bg-neutral-100"
          />
          <p className="text-[11px] text-black/60 mt-2">Em breve você poderá rastrear eventos com seu Meta Pixel.</p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2">Google Analytics Measurement ID</label>
          <input
            disabled
            placeholder="G-XXXXXXXXXX"
            className="brutal-input px-3 py-2 w-full bg-neutral-100"
          />
          <p className="text-[11px] text-black/60 mt-2">Em breve você poderá integrar o GA4.</p>
        </div>
        <button disabled className="brutal-btn bg-neutral-200 text-black/60 px-4 py-2 self-start">
          Salvar (em breve)
        </button>
      </div>
    </ProFeatureCard>
  );
}
