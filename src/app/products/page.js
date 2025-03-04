'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

export default function ProductsPage() {
  const searchParams = useSearchParams();
  const categoryFilter = searchParams.get('category');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter || '전체');

  // 카테고리 목록
  const categories = [
    '전체',
    '의류',
    '가방',
    '전자기기',
    '신발',
    '액세서리',
    '홈 & 리빙'
  ];

  // 샘플 제품 데이터
  const sampleProducts = [
    {
      id: 1,
      name: "프리미엄 티셔츠",
      price: 29000,
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "의류",
      description: "고품질 면 소재로 제작된 프리미엄 티셔츠입니다. 편안한 착용감과 세련된 디자인을 자랑합니다."
    },
    {
      id: 2,
      name: "디자이너 백팩",
      price: 89000,
      image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "가방",
      description: "내구성 있는 소재로 제작된 스타일리시한 백팩입니다. 넉넉한 수납공간과 편안한 착용감을 제공합니다."
    },
    {
      id: 3,
      name: "스마트 워치",
      price: 159000,
      image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "전자기기",
      description: "최신 기술이 적용된 스마트 워치입니다. 건강 모니터링, 알림 확인 등 다양한 기능을 제공합니다."
    },
    {
      id: 4,
      name: "편안한 운동화",
      price: 79000,
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "신발",
      description: "편안한 착용감과 스타일리시한 디자인의 운동화입니다. 일상 생활과 가벼운 운동에 적합합니다."
    },
    {
      id: 5,
      name: "골드 목걸이",
      price: 120000,
      image: "https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "액세서리",
      description: "고급스러운 디자인의 골드 목걸이입니다. 특별한 날이나 일상에 포인트를 줄 수 있는 액세서리입니다."
    },
    {
      id: 6,
      name: "아로마 디퓨저",
      price: 45000,
      image: "https://images.unsplash.com/photo-1602928298849-325cec8771c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "홈 & 리빙",
      description: "은은한 향기를 퍼뜨리는 아로마 디퓨저입니다. 인테리어 소품으로도 활용 가능한 디자인입니다."
    },
    {
      id: 7,
      name: "데님 자켓",
      price: 89000,
      image: "https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "의류",
      description: "클래식한 디자인의 데님 자켓입니다. 다양한 스타일링이 가능한 활용도 높은 아이템입니다."
    },
    {
      id: 8,
      name: "미니 크로스백",
      price: 59000,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
      category: "가방",
      description: "컴팩트한 사이즈의 크로스백입니다. 필수 소지품만 간편하게 휴대하기 좋은 디자인입니다."
    }
  ];

  useEffect(() => {
    // 실제 API 호출 대신 샘플 데이터 사용
    const fetchProducts = () => {
      setLoading(true);
      
      // 카테고리 필터링
      const filteredProducts = categoryFilter 
        ? sampleProducts.filter(product => product.category === categoryFilter)
        : sampleProducts;
      
      setProducts(filteredProducts);
      setLoading(false);
    };

    fetchProducts();
  }, [categoryFilter]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    
    // 필터링된 제품 목록 업데이트
    if (category === '전체') {
      setProducts(sampleProducts);
    } else {
      const filtered = sampleProducts.filter(product => product.category === category);
      setProducts(filtered);
    }
  };

  return (
    <div>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-16 px-4 sm:py-24 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">상품 목록</h1>
            <p className="mt-4 max-w-xl mx-auto text-base text-gray-500">
              다양한 카테고리의 상품을 둘러보세요. 최고의 품질과 합리적인 가격을 제공합니다.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-24">
        {/* 카테고리 필터 */}
        <div className="flex flex-wrap justify-center mb-8 gap-2">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryChange(category)}
              className={`px-4 py-2 rounded-full text-sm font-medium ${
                selectedCategory === category
                  ? 'bg-indigo-600 text-white'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* 상품 목록 */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900">상품이 없습니다</h3>
            <p className="mt-2 text-sm text-gray-500">다른 카테고리를 선택해 보세요.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {products.map((product) => (
              <div key={product.id} className="group relative">
                <div className="w-full min-h-80 bg-gray-200 aspect-w-1 aspect-h-1 rounded-md overflow-hidden group-hover:opacity-75">
                  <Image
                    src={product.image}
                    alt={product.name}
                    width={500}
                    height={500}
                    className="w-full h-full object-center object-cover"
                  />
                </div>
                <div className="mt-4 flex justify-between">
                  <div>
                    <h3 className="text-sm text-gray-700">
                      <Link href={`/products/${product.id}`}>
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>
                  </div>
                  <p className="text-sm font-medium text-gray-900">{product.price.toLocaleString()}원</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 