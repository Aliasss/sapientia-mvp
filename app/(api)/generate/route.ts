import { NextRequest } from 'next/server';

export const runtime = 'edge';

export async function POST(req: NextRequest) {
  let mode = 'rewrite';
  let payload: Record<string, unknown> = {};
  
  try {
    const body = await req.json();
    mode = body.mode || 'rewrite';
    payload = body.payload || {};

    const apiKey = process.env.OPENAI_API_KEY;

    // Template mode fallback if no API key
    if (!apiKey) {
      const fallbackResponse = generateFallbackResponse(mode, payload);
      return new Response(
        JSON.stringify({ ok: true, fallback: fallbackResponse }),
        { headers: { 'Content-Type': 'application/json' } }
      );
    }

    const systemPrompt =
      mode === 'rewrite'
        ? 'You are a concise assistant that rewrites information into the user own voice in Korean. Focus on clarity and actionability. Mention limitations if any.'
        : 'You are a pragmatic assistant that proposes three small value-aligned actions in Korean. Each action should be completable within 72 hours and be specific.';

    const requestBody = {
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: JSON.stringify(payload) },
      ],
      temperature: 0.5,
      max_tokens: 500,
    };

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();

    return new Response(JSON.stringify({ ok: true, data }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Generate API error:', error);
    
    // Return fallback on error
    const fallbackResponse = generateFallbackResponse(mode, payload);
    
    return new Response(
      JSON.stringify({ ok: true, fallback: fallbackResponse }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  }
}

function generateFallbackResponse(mode: string, payload: Record<string, unknown>): string {
  if (mode === 'rewrite') {
    const info = typeof payload.info === 'string' ? payload.info : '정보를 재해석하세요';
    const infoPreview = info.slice(0, 150);
    return `내 언어로 재해석: ${infoPreview}. 이 개념을 내 맥락에 적용하면 어떤 의미일까?`;
  } else if (mode === 'actions') {
    const templates = [
      '이 주제에 대해 하루 15분 동안 깊이 생각하고 노트에 기록하기',
      '관련 개념을 주변 사람 1명에게 설명하고 피드백 받기',
      '이 아이디어를 적용할 수 있는 내 일상의 구체적 상황 3가지 찾기',
    ];
    return templates.join('\n');
  }
  return '재해석 또는 행동 제안을 생성할 수 없습니다.';
}

