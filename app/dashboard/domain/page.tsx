'use client';

import { ProFeatureCard } from '@/components/dashboard/ProFeatureCard';

export default function DomainPage() {
  return (
    <ProFeatureCard
      feature="custom_domain"
      title="Domínio personalizado"
      description="Use seu próprio domínio (ex: seunome.com) em vez do subdomínio Bioflowzy."
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2">Seu domínio</label>
          <input
            disabled
            placeholder="seunome.com"
            className="brutal-input px-3 py-2 w-full bg-neutral-100"
          />
          <p className="text-[11px] text-black/60 mt-2">Em breve você poderá configurar DNS e verificar seu domínio automaticamente.</p>
        </div>
        <div className="brutal-border p-4 bg-neutral-50">
          <p className="text-xs font-bold mb-2">Como vai funcionar:</p>
          <ol className="text-xs text-black/70 list-decimal ml-4 space-y-1">
            <li>Aponte um CNAME do seu domínio para bioflowzy.com</li>
            <li>Nós validamos automaticamente em minutos</li>
            <li>Seu perfil passa a responder pelo domínio</li>
          </ol>
        </div>
        <button disabled className="brutal-btn bg-neutral-200 text-black/60 px-4 py-2 self-start">
          Verificar domínio (em breve)
        </button>
      </div>
    </ProFeatureCard>
  );
}
