'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { ProFeatureCard } from '@/components/dashboard/ProFeatureCard';
import { usePlan } from '@/hooks/use-plan';

export default function ReferralPage() {
  const { profile, has } = usePlan();
  const [copied, setCopied] = useState(false);
  const unlocked = has('referral');
  const code = profile?.referral_code || '';
  const link = typeof window !== 'undefined' && code ? `${window.location.origin}/register?ref=${code}` : '';

  async function copy() {
    if (!link) return;
    try {
      await navigator.clipboard.writeText(link);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  return (
    <ProFeatureCard
      feature="referral"
      title="Indique e ganhe"
      description="Compartilhe seu link e ganhe recompensas quando alguém assinar."
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2">Seu código</label>
          <div className="brutal-input px-3 py-2 w-full bg-neutral-50 font-mono text-sm">
            {code || '—'}
          </div>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase tracking-wide mb-2">Seu link único</label>
          <div className="flex gap-2">
            <input
              readOnly
              value={link}
              className="brutal-input px-3 py-2 flex-1 text-xs bg-white"
              placeholder={unlocked ? '' : 'Disponível nos planos Pro'}
            />
            <button onClick={copy} disabled={!unlocked || !link} className="brutal-btn bg-bioyellow px-3 py-2 gap-2 text-xs disabled:opacity-50">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>
        <div className="brutal-border p-4 bg-neutral-50">
          <p className="text-xs font-bold mb-1">Em breve:</p>
          <ul className="text-xs text-black/70 list-disc ml-4 space-y-1">
            <li>Acompanhe suas indicações em tempo real</li>
            <li>Ganhe créditos ou meses grátis por cada assinante</li>
            <li>Relatório mensal de comissões</li>
          </ul>
        </div>
      </div>
    </ProFeatureCard>
  );
}
