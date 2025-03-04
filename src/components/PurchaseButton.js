'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '@/lib/supabase';

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
      const orderId = uuidv4();
      
      // 총 금액 계산
      const totalAmount = product.price * quantity;

      // 구매 내역 저장
      const { data, error } = await supabase
        .from('purchases')
        .insert([
          {
            user_id: user.id,
            order_id: orderId,
            product_id: product.id,
            product_name: product.name,
            quantity: quantity,
            amount: totalAmount,
            status: 'completed',
            payment_method: '카드',
          }
        ]);

      if (error) {
        throw error;
      }

      // 구매 완료 페이지로 이동
      router.push(`/purchase/success?orderId=${orderId}`);
    } catch (err) {
      console.error('구매 처리 중 오류 발생:', err);
      setError('구매 처리 중 오류가 발생했습니다. 다시 시도해주세요.');
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