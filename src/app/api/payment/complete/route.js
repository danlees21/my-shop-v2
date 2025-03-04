import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function POST(request) {
  try {
    const { paymentId, order } = await request.json();

    if (!paymentId || !order) {
      return NextResponse.json(
        { message: '필수 파라미터가 누락되었습니다.' },
        { status: 400 }
      );
    }

    // 포트원 API 시크릿 키
    const PORTONE_API_SECRET = process.env.NEXT_PUBLIC_PORTONE_API_SECRET;

    console.log('결제 완료 처리 시작:', {
      paymentId,
      order,
      PORTONE_API_SECRET_LENGTH: PORTONE_API_SECRET?.length,
    });

    // 1. 포트원 결제내역 단건조회 API 호출
    const paymentResponse = await fetch(
      `https://api.portone.io/payments/${encodeURIComponent(paymentId)}`,
      {
        headers: { Authorization: `PortOne ${PORTONE_API_SECRET}` },
      }
    );

    if (!paymentResponse.ok) {
      const errorData = await paymentResponse.json();
      console.error('결제 정보 조회 실패:', errorData);
      throw new Error(`결제 정보 조회 실패: ${JSON.stringify(errorData)}`);
    }

    const payment = await paymentResponse.json();
    console.log('결제 정보 조회 결과:', payment);

    // 2. 주문 데이터의 가격과 실제 지불된 금액을 비교
    if (order.amount === payment.amount.total) {
      switch (payment.status) {
        case 'VIRTUAL_ACCOUNT_ISSUED': {
          // 가상 계좌가 발급된 상태
          // 구매 내역 상태 업데이트
          const { error } = await supabase
            .from('purchases')
            .update({ 
              status: 'virtual_account_issued',
              payment_key: payment.paymentKey
            })
            .eq('order_id', paymentId);

          if (error) {
            throw new Error(`구매 내역 업데이트 실패: ${error.message}`);
          }
          break;
        }
        case 'PAID': {
          // 결제 완료 상태
          // 구매 내역 상태 업데이트
          const { error } = await supabase
            .from('purchases')
            .update({ 
              status: 'completed',
              payment_key: payment.paymentKey
            })
            .eq('order_id', paymentId);

          if (error) {
            throw new Error(`구매 내역 업데이트 실패: ${error.message}`);
          }
          break;
        }
        default:
          // 기타 상태 처리
          const { error } = await supabase
            .from('purchases')
            .update({ 
              status: payment.status.toLowerCase(),
              payment_key: payment.paymentKey
            })
            .eq('order_id', paymentId);

          if (error) {
            throw new Error(`구매 내역 업데이트 실패: ${error.message}`);
          }
      }

      return NextResponse.json({ success: true });
    } else {
      // 결제 금액이 불일치하여 위/변조 시도가 의심됨
      // 구매 내역 상태 업데이트
      await supabase
        .from('purchases')
        .update({ 
          status: 'amount_mismatch',
          payment_key: payment.paymentKey
        })
        .eq('order_id', paymentId);

      return NextResponse.json(
        { message: '결제 금액이 불일치합니다.' },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error('결제 완료 처리 중 오류 발생:', error);
    return NextResponse.json(
      { message: error.message || '결제 완료 처리 중 오류가 발생했습니다.' },
      { status: 500 }
    );
  }
} 