'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { VALUE_DESCRIPTIONS } from '@/lib/prompts';
import type { ValueId } from '@/lib/schemas';
import { generateClientId } from '@/lib/uuid';
import { saveUserProfile, saveClientIdToLocal, logEvent } from '@/lib/storage';

const values: ValueId[] = ['autonomy', 'growth', 'solidarity', 'stability', 'aesthetics', 'integrity'];

export default function OnboardingPage() {
  const router = useRouter();
  const [selectedValues, setSelectedValues] = useState<ValueId[]>([]);
  const [nickname, setNickname] = useState('');
  const [pin, setPin] = useState('');
  const [step, setStep] = useState<'values' | 'auth'>('values');

  const toggleValue = (valueId: ValueId) => {
    if (selectedValues.includes(valueId)) {
      setSelectedValues(selectedValues.filter(v => v !== valueId));
    } else {
      if (selectedValues.length < 3) {
        setSelectedValues([...selectedValues, valueId]);
      }
    }
  };

  const handleValuesNext = () => {
    if (selectedValues.length === 3) {
      setStep('auth');
    }
  };

  const handleComplete = async () => {
    if (nickname.trim() && pin.length === 4) {
      const clientId = generateClientId();
      
      // Equal weight distribution for selected values
      const topValues = selectedValues.map((valueId) => ({
        valueId,
        weight: 1 / 3,
      }));

      const profile = {
        clientId,
        topValues,
        updatedAt: new Date().toISOString(),
      };

      await saveUserProfile(profile);
      saveClientIdToLocal(clientId, nickname, pin);
      await logEvent(clientId, 'save', { type: 'onboarding_complete', values: selectedValues });

      router.push('/');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-3xl">
        {step === 'values' && (
          <div className="animation-smooth">
            <h1 className="text-3xl font-bold mb-3">당신의 가치를 선택하세요</h1>
            <p className="text-subtle mb-8">
              3개의 가치를 선택해주세요. 선택한 가치는 정보 추천과 재해석에 반영됩니다.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {values.map(valueId => {
                const value = VALUE_DESCRIPTIONS[valueId];
                const isSelected = selectedValues.includes(valueId);

                return (
                  <button
                    key={valueId}
                    onClick={() => toggleValue(valueId)}
                    className={`p-6 rounded-2xl border-2 text-left animation-smooth ${
                      isSelected
                        ? 'border-accent bg-accent/10'
                        : 'border-border bg-surface hover:border-accent/50'
                    }`}
                  >
                    <h3 className="text-xl font-semibold mb-2">{value.title}</h3>
                    <p className="text-subtle text-sm">{value.description}</p>
                  </button>
                );
              })}
            </div>

            <div className="flex items-center justify-between">
              <p className="text-sm text-subtle">
                {selectedValues.length}/3 선택됨
              </p>
              <button
                onClick={handleValuesNext}
                disabled={selectedValues.length !== 3}
                className={`px-6 py-3 rounded-2xl font-semibold animation-smooth ${
                  selectedValues.length === 3
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-surface text-subtle cursor-not-allowed'
                }`}
              >
                다음
              </button>
            </div>
          </div>
        )}

        {step === 'auth' && (
          <div className="animation-smooth">
            <h1 className="text-3xl font-bold mb-3">프로필 설정</h1>
            <p className="text-subtle mb-8">
              닉네임과 4자리 PIN을 설정하세요. 데이터는 로컬에만 저장됩니다.
            </p>

            <div className="space-y-6 mb-8">
              <div>
                <label className="block text-sm font-semibold mb-2">닉네임</label>
                <input
                  type="text"
                  value={nickname}
                  onChange={e => setNickname(e.target.value)}
                  placeholder="예: 지혜로운사람"
                  className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-accent outline-none animation-smooth"
                  maxLength={20}
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">4자리 PIN</label>
                <input
                  type="password"
                  value={pin}
                  onChange={e => setPin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  placeholder="0000"
                  className="w-full px-4 py-3 rounded-2xl bg-surface border border-border focus:border-accent outline-none animation-smooth"
                  maxLength={4}
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('values')}
                className="px-6 py-3 rounded-2xl font-semibold bg-surface text-text hover:bg-border animation-smooth"
              >
                이전
              </button>
              <button
                onClick={handleComplete}
                disabled={!nickname.trim() || pin.length !== 4}
                className={`px-6 py-3 rounded-2xl font-semibold animation-smooth ${
                  nickname.trim() && pin.length === 4
                    ? 'bg-accent text-white hover:bg-accent/90'
                    : 'bg-surface text-subtle cursor-not-allowed'
                }`}
              >
                완료
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

