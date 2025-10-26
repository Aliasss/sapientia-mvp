import '@/styles/globals.css';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'SAPIENTIA - 정보를 지혜로',
  description: '가치 렌즈로 정보를 재해석하고 행동으로 전환하는 지적 인프라',
};

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>{children}</body>
    </html>
  );
}

