'use client';

import { useRouter } from 'next/navigation';
import { ArrowRight } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="max-w-3xl text-center">
        <h1 className="text-5xl font-bold mb-6">
          SAPIENTIA
        </h1>

        <p className="text-xl text-subtle mb-8 leading-relaxed">
          타인의 정보를 <span className="text-accent font-semibold">나의 관점</span>으로 재해석하고
          <br />
          <span className="text-accent font-semibold">바로 행동</span>할 수 있게 만드는 지적 인프라
        </p>

        <div className="space-y-6 mb-12 text-left max-w-2xl mx-auto">
          <div className="p-6 rounded-2xl bg-surface border border-border">
            <h3 className="font-semibold mb-2">🎯 가치 렌즈</h3>
            <p className="text-sm text-subtle">
              당신의 가치관에 맞춰 정보를 개인화합니다. 같은 정보도 당신의 맥락으로 재해석됩니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border">
            <h3 className="font-semibold mb-2">✍️ 내 언어로 재해석</h3>
            <p className="text-sm text-subtle">
              타인의 언어를 그대로 받아들이지 않습니다. 당신의 언어로 다시 쓰며 내재화합니다.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-surface border border-border">
            <h3 className="font-semibold mb-2">🚀 72시간 내 행동</h3>
            <p className="text-sm text-subtle">
              생각에서 멈추지 않습니다. 작은 행동으로 즉시 실행하며 습관을 만듭니다.
            </p>
          </div>
        </div>

        <button
          onClick={() => router.push('/onboarding')}
          className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-accent text-white text-lg font-semibold hover:bg-accent/90 animation-smooth shadow-soft"
        >
          시작하기
          <ArrowRight size={20} />
        </button>

        <p className="text-xs text-subtle mt-8">
          {'"추천은 제안일 뿐 강요가 아닙니다. 최종 결정은 본인의 판단입니다."'}
        </p>
      </div>
    </div>
  );
}

