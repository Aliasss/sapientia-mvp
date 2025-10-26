// LLM prompt templates

import type { ValueId } from './schemas';

export const RewritePrompt = (info: string, valueLens: ValueId[]) => ({
  info,
  instruction:
    '위 정보를 내 언어로 한 단락으로 재해석. 불필요한 수식어 금지. 한계나 가정이 있으면 짧게 명시.',
  value_lens: valueLens,
});

export const ActionPrompt = (myRewrite: string, valueLens: ValueId[]) => ({
  my_rewrite: myRewrite,
  instruction:
    '다음 72시간 안에 실행 가능한 작은 행동 3개. 각 1문장. 가치 렌즈를 반영.',
  value_lens: valueLens,
  templates: {
    growth: ['작은 실험 1개', '주간 회고 체크'],
    solidarity: ['공유 1회', '토론 질문 2개'],
    stability: ['리스크 3항목', '최소 실행 버전'],
    aesthetics: ['스토리 프레이밍 1포인트'],
  },
});

// Value descriptions for UI
export const VALUE_DESCRIPTIONS: Record<
  ValueId,
  { title: string; description: string }
> = {
  autonomy: {
    title: '자율성',
    description: '스스로 선택하고 결정할 자유. 독립적 판단과 책임.',
  },
  growth: {
    title: '성장',
    description: '배움과 발전. 실험하고 개선하며 나아가는 과정.',
  },
  solidarity: {
    title: '연대',
    description: '함께하는 힘. 협력과 공유를 통한 상호 성장.',
  },
  stability: {
    title: '안정성',
    description: '예측 가능성과 신뢰. 리스크 관리와 지속 가능성.',
  },
  aesthetics: {
    title: '미학',
    description: '아름다움과 조화. 의미 있는 경험과 표현.',
  },
  integrity: {
    title: '진실성',
    description: '정직과 일관성. 원칙에 따른 행동과 투명성.',
  },
};

