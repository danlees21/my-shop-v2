'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import PurchaseButton from '@/components/PurchaseButton';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [user, setUser] = useState(null);

  // 샘플 제품 데이터
  const sampleProducts = [
    {
      id: 1,
      name: "프리미엄 티셔츠",
      price: 29000,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "의류",
      description: "고품질 면 소재로 제작된 프리미엄 티셔츠입니다. 편안한 착용감과 세련된 디자인을 자랑합니다.",
      details: [
        "100% 유기농 면 소재",
        "기계 세탁 가능",
        "다양한 색상 옵션",
        "사이즈: S, M, L, XL"
      ]
    },
    {
      id: 2,
      name: "디자이너 백팩",
      price: 89000,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "가방",
      description: "내구성 있는 소재로 제작된 스타일리시한 백팩입니다. 넉넉한 수납공간과 편안한 착용감을 제공합니다.",
      details: [
        "방수 소재",
        "노트북 수납 공간",
        "조절 가능한 어깨 스트랩",
        "다양한 포켓 구성"
      ]
    },
    {
      id: 3,
      name: "스마트 워치",
      price: 159000,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "전자기기",
      description: "최신 기술이 적용된 스마트 워치입니다. 건강 모니터링, 알림 확인 등 다양한 기능을 제공합니다.",
      details: [
        "심박수 모니터링",
        "GPS 기능",
        "방수 기능",
        "배터리 지속시간: 최대 7일"
      ]
    },
    {
      id: 4,
      name: "편안한 운동화",
      price: 79000,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "신발",
      description: "편안한 착용감과 스타일리시한 디자인의 운동화입니다. 일상 생활과 가벼운 운동에 적합합니다.",
      details: [
        "쿠션 인솔",
        "통기성 있는 소재",
        "미끄럼 방지 밑창",
        "다양한 색상 옵션"
      ]
    },
    {
      id: 5,
      name: "골드 목걸이",
      price: 120000,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "액세서리",
      description: "고급스러운 디자인의 골드 목걸이입니다. 특별한 날이나 일상에 포인트를 줄 수 있는 액세서리입니다.",
      details: [
        "14K 골드",
        "길이: 45cm",
        "조절 가능한 체인",
        "선물용 케이스 포함"
      ]
    },
    {
      id: 6,
      name: "아로마 디퓨저",
      price: 45000,
      image: "https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "홈 & 리빙",
      description: "은은한 향기를 퍼뜨리는 아로마 디퓨저입니다. 인테리어 소품으로도 활용 가능한 디자인입니다.",
      details: [
        "초음파 방식",
        "LED 무드등 기능",
        "자동 전원 차단 기능",
        "에센셜 오일 샘플 포함"
      ]
    },
    {
      id: 7,
      name: "데님 자켓",
      price: 89000,
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "의류",
      description: "클래식한 디자인의 데님 자켓입니다. 다양한 스타일링이 가능한 활용도 높은 아이템입니다.",
      details: [
        "100% 코튼 데님",
        "버튼 클로저",
        "다양한 워싱 옵션",
        "사이즈: S, M, L, XL"
      ]
    },
    {
      id: 8,
      name: "미니 크로스백",
      price: 59000,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "가방",
      description: "컴팩트한 사이즈의 크로스백입니다. 필수 소지품만 간편하게 휴대하기 좋은 디자인입니다.",
      details: [
        "고급 합성 가죽",
        "조절 가능한 스트랩",
        "내부 포켓",
        "자석 클로저"
      ]
    }
  ];

  useEffect(() => {
    const getUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };

    getUser();
  }, []);

  useEffect(() => {
    if (!params.id) return;

    // 실제 API 호출 대신 샘플 데이터 사용
    const fetchProduct = () => {
      setLoading(true);
      
      const productId = parseInt(params.id);
      const foundProduct = sampleProducts.find(p => p.id === productId);
      
      if (foundProduct) {
        setProduct(foundProduct);
      } else {
        // 상품이 없으면 상품 목록 페이지로 리디렉션
        router.push('/products');
      }
      
      setLoading(false);
    };

    fetchProduct();
  }, [params.id, router]);

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (!user) {
      alert('장바구니에 추가하려면 로그인이 필요합니다.');
      return;
    }
    
    alert(`${product.name} ${quantity}개가 장바구니에 추가되었습니다.`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!product) {
    return null; // 리디렉션 처리 중
  }

  return (
    <div className="bg-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* 상품 이미지 */}
          <div className="lg:max-w-lg lg:self-end">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              <Image
                src={product.image}
                alt={product.name}
                width={800}
                height={800}
                className="w-full h-full object-center object-cover"
              />
            </div>
          </div>

          {/* 상품 정보 */}
          <div className="mt-10 lg:mt-0 lg:col-start-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">{product.name}</h1>
            
            <div className="mt-3">
              <h2 className="sr-only">상품 정보</h2>
              <p className="text-3xl text-gray-900">{product.price.toLocaleString()}원</p>
            </div>

            <div className="mt-6">
              <h3 className="sr-only">설명</h3>
              <p className="text-base text-gray-700">{product.description}</p>
            </div>

            <div className="mt-6">
              <h3 className="text-sm font-medium text-gray-900">상세 정보</h3>
              <div className="mt-4">
                <ul className="list-disc pl-4 space-y-2">
                  {product.details.map((detail, index) => (
                    <li key={index} className="text-sm text-gray-700">{detail}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="mt-8">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-gray-900 w-20">수량</h3>
                <div>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={handleQuantityChange}
                    className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border-gray-300 rounded-md w-20"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex flex-col space-y-4">
              <button
                onClick={handleAddToCart}
                className="w-full bg-indigo-50 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-indigo-700 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                장바구니에 추가
              </button>
              
              <PurchaseButton 
                product={product} 
                quantity={quantity} 
                user={user} 
              />
            </div>

            <div className="mt-8">
              <div className="flex items-center">
                <h3 className="text-sm font-medium text-gray-900 w-20">카테고리</h3>
                <div className="text-sm text-gray-700">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                    {product.category}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 