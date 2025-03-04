import Image from "next/image";
import Link from "next/link";

export default function Home() {
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

  return (
    <div>
      {/* 히어로 섹션 */}
      <section className="relative bg-gray-900 text-white">
        <div className="absolute inset-0 overflow-hidden">
          <Image
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
            alt="쇼핑몰 배경"
            fill
            style={{ objectFit: "cover", opacity: 0.7 }}
            priority
          />
        </div>
        <div className="relative max-w-7xl mx-auto py-24 px-4 sm:py-32 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">My Shop</h1>
          <p className="mt-6 text-xl max-w-3xl">
            최고의 제품을 최상의 가격으로 만나보세요. 지금 쇼핑을 시작하세요!
          </p>
          <div className="mt-10">
            <Link href="/products" className="inline-block bg-white text-gray-900 px-8 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
              쇼핑하기
            </Link>
          </div>
        </div>
      </section>

      {/* 카테고리 섹션 */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">카테고리</h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {categories.map((category) => (
              <Link 
                key={category.name}
                href={`/products?category=${category.name}`}
                className="bg-white p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow flex flex-col items-center"
              >
                <span className="text-3xl mb-2">{category.icon}</span>
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* 추천 상품 섹션 */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-8">추천 상품</h2>
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
            {featuredProducts.map((product) => (
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
          <div className="mt-8 text-center">
            <Link href="/products" className="inline-block bg-indigo-600 text-white px-6 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors">
              모든 상품 보기
            </Link>
          </div>
        </div>
      </section>

      {/* 특별 혜택 섹션 */}
      <section className="py-12 bg-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-8 items-center">
            <div>
              <h2 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                특별 혜택
              </h2>
              <p className="mt-3 max-w-3xl text-lg text-gray-500">
                지금 회원가입하고 다양한 혜택을 누려보세요. 신규 회원에게는 10% 할인 쿠폰을 드립니다.
              </p>
              <div className="mt-8">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">무료 배송 (3만원 이상 구매 시)</p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">30일 무료 반품</p>
                </div>
                <div className="mt-6 flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <p className="ml-3 text-base text-gray-700">회원 전용 특별 할인</p>
                </div>
              </div>
            </div>
            <div className="mt-10 lg:mt-0">
              <div className="aspect-w-3 aspect-h-2 rounded-lg overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1607083206968-13611e3d76db?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
                  alt="쇼핑 혜택"
                  width={800}
                  height={600}
                  className="w-full h-full object-center object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
