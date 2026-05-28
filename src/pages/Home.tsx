import React from 'react';
import { useStore } from '../store';
import { ShoppingCart, Star, Zap, ShieldCheck } from 'lucide-react';

export default function Home() {
  const { products, addToCart } = useStore();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="relative overflow-hidden bg-gradient-to-br from-primary-600 to-blue-800 rounded-3xl p-10 mb-16 text-white shadow-xl text-center md:text-right flex flex-col md:flex-row items-center justify-between">
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 rounded-full bg-white opacity-10 blur-3xl"></div>
        <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-blue-400 opacity-20 blur-3xl"></div>
        
        <div className="relative z-10 md:pr-8">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-6 leading-tight">
            تسوق بذكاء، <br className="hidden md:block" /> وادفع بأمان
          </h1>
          <p className="text-lg md:text-xl opacity-90 mb-8 max-w-2xl leading-relaxed">
            منصة "سوق المجعشي" تجمع أفضل التجار وتوفر تجربة تسوق سهلة وسريعة. يمكنك إتمام الطلب المباشر عبر واتساب بكل سهولة.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <button className="bg-white text-primary-700 px-8 py-3 rounded-xl font-bold hover:bg-gray-50 hover:shadow-lg transition-all duration-300">
              تصفح الأقسام
            </button>
            <button className="bg-primary-500/30 border border-primary-400 backdrop-blur-sm text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-500/50 transition-all duration-300">
              انضم كتاجر
            </button>
          </div>
        </div>
        <div className="relative z-10 mt-12 md:mt-0 lg:ml-8 hidden md:block">
          <img 
            src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=500&q=80" 
            alt="Shopping" 
            className="w-72 h-72 lg:w-96 lg:h-96 object-cover rounded-2xl shadow-2xl rotate-3 hover:rotate-0 transition-transform duration-500" 
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        <div className="bg-white flex items-start gap-4 p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-blue-50 text-blue-600 p-3 rounded-xl"><Zap size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">طلب سريع وملائم</h3>
            <p className="text-gray-500 text-sm mt-1">تواصل مباشر عبر الواتساب لإتمام الطلب بسهولة.</p>
          </div>
        </div>
        <div className="bg-white flex items-start gap-4 p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-green-50 text-green-600 p-3 rounded-xl"><ShieldCheck size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">منتجات موثوقة</h3>
            <p className="text-gray-500 text-sm mt-1">منتجات تم اعتمادها من الإدارة لضمان الجودة.</p>
          </div>
        </div>
        <div className="bg-white flex items-start gap-4 p-6 rounded-2xl shadow-sm border border-gray-100">
          <div className="bg-purple-50 text-purple-600 p-3 rounded-xl"><Star size={24} /></div>
          <div>
            <h3 className="font-bold text-gray-900 text-lg">تجار مميزون</h3>
            <p className="text-gray-500 text-sm mt-1">نخبة من أفضل التجار المسجلين محلياً.</p>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between mb-8">
        <div>
          <h2 className="text-3xl font-extrabold text-gray-900">أحدث المنتجات</h2>
          <p className="text-gray-500 mt-2">تسوق من المنتجات المعتمدة والمعروضة حديثاً</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {products.filter(p => p.status === 'approved').map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm border border-gray-100/50 overflow-hidden hover:shadow-xl transition-all duration-300 group">
            <div className="relative overflow-hidden h-56 bg-gray-100">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
              />
              <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-primary-600 shadow-sm">
                {product.category}
              </div>
            </div>
            <div className="p-5">
              <h3 className="text-lg font-bold text-gray-900 mb-2 truncate" title={product.name}>{product.name}</h3>
              <div className="flex items-center justify-between mt-6">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-400 font-medium">السعر</span>
                  <span className="text-2xl font-extrabold text-primary-600">{product.price} ر.س</span>
                </div>
                <button 
                  onClick={() => addToCart(product)}
                  className="bg-gray-50 text-gray-900 p-3 rounded-xl hover:bg-primary-600 hover:text-white transition-colors duration-300 shadow-sm"
                  title="أضف للسلة"
                >
                  <ShoppingCart size={22} className="fill-current" />
                </button>
              </div>
            </div>
          </div>
        ))}
        {products.filter(p => p.status === 'approved').length === 0 && (
          <div className="col-span-full py-16 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <ShoppingCart className="mx-auto text-gray-300 mb-4" size={48} />
            <h3 className="text-xl font-bold text-gray-700">لا توجد رسائل معتمدة بعد</h3>
            <p className="text-gray-500">سيتم إضافة المنتجات قريباً.</p>
          </div>
        )}
      </div>
    </div>
  );
}
