'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function FailPage() {
  const searchParams = useSearchParams();
  
  const code = searchParams.get('code');
  const message = searchParams.get('message');
  const orderId = searchParams.get('orderId');

  return (
    <div className="max-w-3xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-2xl font-bold text-red-600">결제에 실패했습니다</h1>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            결제 중 문제가 발생했습니다. 다시 시도해주세요.
          </p>
        </div>
        
        <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
          {code && (
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">오류 코드</h2>
              <p className="mt-1 text-sm text-gray-600">{code}</p>
            </div>
          )}
          
          {message && (
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">오류 메시지</h2>
              <p className="mt-1 text-sm text-gray-600">{message}</p>
            </div>
          )}
          
          {orderId && (
            <div className="mb-4">
              <h2 className="text-lg font-medium text-gray-900">주문 번호</h2>
              <p className="mt-1 text-sm text-gray-600">{orderId}</p>
            </div>
          )}
          
          <div className="mt-6 flex flex-col space-y-4">
            <Link
              href="/"
              className="w-full text-center bg-indigo-600 border border-transparent rounded-md py-3 px-8 flex items-center justify-center text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              결제 다시 시도하기
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
} 