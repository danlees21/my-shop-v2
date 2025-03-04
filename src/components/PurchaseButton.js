'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';
import * as PortOne from "@portone/browser-sdk/v2";
import { useCallback } from 'react';

export default function PurchaseButton({ product, quantity, user }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();

  const handlePurchase = async () => {
    if (!user) {
      // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
      router.push('/login');
      return;
    }

    if (!product) {
      setError('제품 정보를 찾을 수 없습니다.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 주문 ID 생성
      const paymentId = `payment-${uuidv4()}`;
      
      // 총 금액 계산
      const totalAmount = product.price * quantity;

      console.log('결제 요청 시작:', {
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
        paymentId,
        totalAmount,
      });

      // 구매 내역 저장 (결제 전 pending 상태로 저장)
      const { data: purchaseData, error: purchaseError } = await supabase
        .from('purchases')
        .insert([
          {
            user_id: user.id,
            order_id: paymentId,
            product_id: product.id,
            product_name: product.name,
            quantity: quantity,
            amount: totalAmount,
            status: 'pending',
            payment_method: '카드'
          }
        ])
        .select();

      if (purchaseError) {
        throw purchaseError;
      }

      // 결제 요청
      const response = await PortOne.requestPayment({
        // Store ID 설정
        storeId: process.env.NEXT_PUBLIC_PORTONE_STORE_ID,
        // 채널 키 설정
        channelKey: process.env.NEXT_PUBLIC_PORTONE_CHANNEL_KEY,
        paymentId: paymentId,
        orderName: `${product.name} ${quantity}개`,
        totalAmount: totalAmount,
        currency: "KRW",
        payMethod: "CARD",
        redirectUrl: `${window.location.origin}/purchase/success?paymentId=${paymentId}`,
        pgProvider: "TOSSPAYMENTS",
        pgOptions: {
          tossPayments: {
            useV2: true,
          },
        },
        customer: {
          customerId: user.id,
          fullName: user.user_metadata?.full_name || '고객',
          email: user.email || '',
        },
      });

      console.log('결제 응답:', response);

      // 결제 결과 처리
      if (response.code !== undefined) {
        // 오류 발생
        // 결제 실패 상태로 업데이트
        await supabase
          .from('purchases')
          .update({ status: 'failed' })
          .eq('order_id', paymentId);
          
        throw new Error(response.message || '결제 처리 중 오류가 발생했습니다.');
      }

      // 서버에 결제 완료 요청
      const completeResponse = await fetch('/api/payment/complete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          paymentId: paymentId,
          order: {
            productId: product.id,
            quantity: quantity,
            amount: totalAmount
          }
        })
      });

      if (!completeResponse.ok) {
        const errorData = await completeResponse.json();
        throw new Error(errorData.message || '결제 완료 처리 중 오류가 발생했습니다.');
      }

      // 구매 완료 페이지로 이동
      router.push(`/purchase/success?paymentId=${paymentId}`);
    } catch (err) {
      console.error('구매 처리 중 오류 발생:', err);
      setError(err.message || '구매 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {error && (
        <div className="text-red-500 mb-4">
          {error}
        </div>
      )}
      <button
        onClick={handlePurchase}
        disabled={loading || !product}
        className={`w-full py-3 px-4 rounded-md font-medium text-white ${
          loading ? 'bg-gray-400' : 'bg-indigo-600 hover:bg-indigo-700'
        } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
      >
        {loading ? '처리 중...' : '지금 구매하기'}
      </button>
    </div>
  );
} 