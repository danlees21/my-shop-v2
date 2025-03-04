import { NextResponse } from 'next/server';

export async function POST(request) {
  try {
    const { paymentKey, orderId, amount } = await request.json();

    // 필수 파라미터 검증
    if (!paymentKey || !orderId || !amount) {
      return NextResponse.json(
        { message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 토스페이먼츠 API 시크릿 키
    const secretKey = process.env.TOSS_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { message: '토스페이먼츠 시크릿 키가 설정되지 않았습니다.' },
        { status: 500 }
      );
    }

    // Basic 인증을 위한 인코딩
    const encodedKey = Buffer.from(`${secretKey}:`).toString('base64');

    // 토스페이먼츠 결제 승인 API 호출
    const response = await fetch('https://api.tosspayments.com/v1/payments/confirm', {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${encodedKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        paymentKey,
        orderId,
        amount,
      }),
    });

    const data = await response.json();

    // 토스페이먼츠 API 응답 처리
    if (!response.ok) {
      console.error('토스페이먼츠 API 오류:', data);
      return NextResponse.json(
        { message: data.message || '결제 승인 중 오류가 발생했습니다.' },
        { status: response.status }
      );
    }

    // 성공적인 결제 승인 응답
    return NextResponse.json(data);
  } catch (error) {
    console.error('결제 승인 처리 중 예외 발생:', error);
    return NextResponse.json(
      { message: '결제 승인 처리 중 서버 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 