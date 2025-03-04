'use client';

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import Script from 'next/script';
import Link from 'next/link';
import Image from "next/image";

export default function Home() {
  const [amount, setAmount] = useState(50000);
  const [orderId, setOrderId] = useState('');
  const [isPaymentWidgetReady, setIsPaymentWidgetReady] = useState(false);
  const [paymentWidget, setPaymentWidget] = useState(null);
  const [couponApplied, setCouponApplied] = useState(false);

  // 샘플 제품 데이터
  const featuredProducts = [
    {
      id: 1,
      name: "프리미엄 티셔츠",
      price: 29000,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "의류"
    },
    {
      id: 2,
      name: "디자이너 백팩",
      price: 89000,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "가방"
    },
    {
      id: 3,
      name: "스마트 워치",
      price: 159000,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "전자기기"
    },
    {
      id: 4,
      name: "편안한 운동화",
      price: 79000,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "신발"
    }
  ];

  // 카테고리 데이터
  const categories = [
    { name: "의류", icon: "👕" },
    { name: "가방", icon: "👜" },
    { name: "전자기기", icon: "📱" },
    { name: "신발", icon: "👟" },
    { name: "액세서리", icon: "💍" },
    { name: "홈 & 리빙", icon: "🏠" }
  ];

  // 주문 ID 생성
  useEffect(() => {
    setOrderId(uuidv4());
  }, []);

  // 토스페이먼츠 위젯 초기화
  useEffect(() => {
    if (!window.TossPayments) return;

    const clientKey = process.env.NEXT_PUBLIC_TOSS_CLIENT_KEY;
    if (!clientKey) {
      console.error('토스페이먼츠 클라이언트 키가 설정되지 않았습니다.');
      return;
    }

    const tossPayments = window.TossPayments(clientKey);
    const widget = tossPayments.createPaymentWidget('payment-widget', {
      customerKey: 'ANONYMOUS',
    });

    setPaymentWidget(widget);
    setIsPaymentWidgetReady(true);
  }, []);

  // 결제 위젯 렌더링
  useEffect(() => {
    if (!isPaymentWidgetReady || !paymentWidget) return;

    // 결제 금액 설정
    paymentWidget.updateAmount(amount);

    // 결제 위젯 렌더링
    paymentWidget.render();
  }, [isPaymentWidgetReady, paymentWidget, amount]);

  // 쿠폰 적용 시 금액 업데이트
  useEffect(() => {
    if (!paymentWidget) return;

    const discountAmount = couponApplied ? 5000 : 0;
    const finalAmount = Math.max(0, amount - discountAmount);
    
    setAmount(finalAmount);
    paymentWidget.updateAmount(finalAmount);
  }, [couponApplied]);

  const handleCouponChange = (e) => {
    setCouponApplied(e.target.checked);
  };

  const handlePayment = async () => {
    if (!paymentWidget) return;

    try {
      await paymentWidget.requestPayment({
        orderId: orderId,
        orderName: '토스 티셔츠 외 2건',
        customerName: '김토스',
        customerEmail: 'customer@example.com',
        successUrl: `${window.location.origin}/success`,
        failUrl: `${window.location.origin}/fail`,
      });
    } catch (error) {
      console.error('결제 요청 오류:', error);
    }
  };

  return (
    <>
      <Script 
        src="https://js.tosspayments.com/v1/payment-widget" 
        strategy="afterInteractive"
      />
      
      <div className="max-w-4xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow overflow-hidden sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h1 className="text-2xl font-bold text-gray-900">토스페이먼츠 결제 테스트</h1>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">
              토스페이먼츠 결제 위젯을 사용한 결제 테스트 페이지입니다.
            </p>
          </div>
          
          <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900">주문 정보</h2>
              <div className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm font-medium text-gray-500">주문 ID</p>
                  <p className="mt-1 text-sm text-gray-900">{orderId}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">상품명</p>
                  <p className="mt-1 text-sm text-gray-900">토스 티셔츠 외 2건</p>
                </div>
              </div>
            </div>
            
            {/* 쿠폰 적용 */}
            <div className="mb-6">
              <div className="flex items-center">
                <input
                  id="coupon-box"
                  type="checkbox"
                  checked={couponApplied}
                  onChange={handleCouponChange}
                  className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                />
                <label htmlFor="coupon-box" className="ml-2 text-sm text-gray-700">
                  5,000원 할인 쿠폰 적용
                </label>
              </div>
            </div>
            
            {/* 결제 금액 */}
            <div className="mb-6">
              <div className="flex justify-between">
                <h2 className="text-lg font-medium text-gray-900">결제 금액</h2>
                <p className="text-lg font-bold text-indigo-600">{amount.toLocaleString()}원</p>
              </div>
              {couponApplied && (
                <p className="text-sm text-gray-500 mt-1">* 5,000원 할인 쿠폰이 적용되었습니다.</p>
              )}
            </div>
            
            {/* 결제 위젯 */}
            <div className="mb-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">결제 수단 선택</h2>
              <div id="payment-widget" className="w-full"></div>
            </div>
            
            {/* 결제 버튼 */}
            <div className="mt-8">
              <button
                onClick={handlePayment}
                className="w-full bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                결제하기
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
