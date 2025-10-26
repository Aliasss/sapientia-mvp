// Sample nodes for MVP testing

import type { Node } from './schemas';

export const SAMPLE_NODES: Node[] = [
  {
    id: 'node-1',
    title: '시스템 사고의 기본 원리',
    summary:
      '복잡한 문제를 개별 요소가 아닌 전체 시스템의 상호작용으로 이해하는 접근법. 피드백 루프와 지연 효과를 고려하여 장기적 영향을 예측한다.',
    valueVector: {
      growth: 0.8,
      stability: 0.6,
      integrity: 0.7,
    },
    confidence: 0.85,
  },
  {
    id: 'node-2',
    title: '작은 습관의 복리 효과',
    summary:
      '매일 1%씩 개선하면 1년 후 37배 성장한다. 작은 변화가 누적되어 큰 결과를 만드는 원리. 즉각적 보상보다 장기적 패턴이 중요하다.',
    valueVector: {
      growth: 0.9,
      stability: 0.5,
      autonomy: 0.6,
    },
    confidence: 0.9,
  },
  {
    id: 'node-3',
    title: '비폭력 대화의 4단계',
    summary:
      '관찰→감정→욕구→요청의 구조로 갈등을 해결하는 방법. 판단과 평가를 분리하고, 상대의 욕구를 이해하며, 구체적인 행동을 요청한다.',
    valueVector: {
      solidarity: 0.9,
      integrity: 0.8,
      autonomy: 0.5,
    },
    confidence: 0.88,
  },
  {
    id: 'node-4',
    title: '최소 실행 가능 제품(MVP) 전략',
    summary:
      '핵심 가치만 담은 최소 버전을 빠르게 출시하여 학습하는 방법. 완벽함보다 검증을 우선하며, 사용자 피드백으로 방향을 조정한다.',
    valueVector: {
      growth: 0.7,
      stability: 0.8,
      autonomy: 0.6,
    },
    confidence: 0.82,
  },
  {
    id: 'node-5',
    title: '스토리텔링의 3막 구조',
    summary:
      '설정→대립→해결의 고전적 서사 구조. 캐릭터의 변화와 갈등 해소를 통해 의미를 전달한다. 청중의 감정적 몰입을 이끈다.',
    valueVector: {
      aesthetics: 0.9,
      solidarity: 0.6,
      integrity: 0.5,
    },
    confidence: 0.86,
  },
  {
    id: 'node-6',
    title: '파레토 원칙과 우선순위',
    summary:
      '20%의 원인이 80%의 결과를 만든다. 핵심적인 소수에 집중하여 효율을 극대화하는 전략. 모든 것을 다 할 수 없다는 현실 인정.',
    valueVector: {
      autonomy: 0.7,
      stability: 0.7,
      growth: 0.5,
    },
    confidence: 0.83,
  },
  {
    id: 'node-7',
    title: '공개 학습(Learning in Public)',
    summary:
      '배우는 과정을 공유하며 성장하는 방법. 완벽하지 않아도 기록하고, 실수를 드러내며, 다른 사람과 함께 배운다.',
    valueVector: {
      growth: 0.8,
      solidarity: 0.9,
      integrity: 0.7,
    },
    confidence: 0.87,
  },
  {
    id: 'node-8',
    title: '디자인 원칙: 제약이 창의성을 높인다',
    summary:
      '무한한 자유보다 명확한 제약이 더 나은 결과를 만든다. 틀 안에서 집중하고, 본질에 다가가며, 불필요한 것을 제거한다.',
    valueVector: {
      aesthetics: 0.8,
      stability: 0.6,
      integrity: 0.7,
    },
    confidence: 0.84,
  },
  {
    id: 'node-9',
    title: '피드백 루프 설계하기',
    summary:
      '행동→결과→측정→조정의 순환을 빠르게 돌리는 구조. 데이터 기반 의사결정과 지속적 개선의 토대.',
    valueVector: {
      growth: 0.7,
      stability: 0.8,
      integrity: 0.6,
    },
    confidence: 0.81,
  },
  {
    id: 'node-10',
    title: '정보 다이어트의 필요성',
    summary:
      '과도한 정보 소비는 행동을 방해한다. 선택적으로 입력을 제한하고, 소화 가능한 양만 받아들이며, 실행에 집중한다.',
    valueVector: {
      autonomy: 0.8,
      stability: 0.7,
      integrity: 0.6,
    },
    confidence: 0.79,
  },
];

