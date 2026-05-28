import React from 'react';
import { useStore } from '../store';
import { Trash2, MessageCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Cart() {
  const { cart, removeFromCart, clearCart, addOrder, addNotification } = useStore();
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  const handleCheckout = () => {
    const orderId = Math.random().toString(36).substr(2, 9).toUpperCase();
    const newOrder = {
      id: orderId,
      items: cart,
      total,
      status: 'pending' as const,
      createdAt: Date.now()
    };
    
    addOrder(newOrder);
    addNotification({
      text: `طلب جديد وارد رقم #${orderId} بقيمة ${total} ر.س`,
      type: 'order',
      targetRole: 'admin'
    });
    
    // Also notify merchants if they have items in this order
    // (mocking simple broadcast for now)
    addNotification({
      text: `بيع محتمل: طلب جديد وارد يحتوي على منتجات لك (طلب #${orderId})`,
      type: 'order',
      targetRole: 'merchant'
    });

    clearCart();
    alert('تم إرسال الطلب بنجاح! سيتم التواصل معك عبر الواتساب.');
    navigate('/');
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">السلة فارغة</h2>
        <p className="text-gray-500 mb-8">لم تقم بإضافة أي منتجات إلى السلة بَعد.</p>
        <Link to="/" className="bg-primary-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-primary-700 transition-colors">
          تصفح المنتجات
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">سلة المشتريات</h2>
      
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="flex-1 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="space-y-4">
            {cart.map((item, index) => (
              <div key={`${item.id}-${index}`} className="flex items-center gap-4 p-4 border border-gray-50 rounded-lg bg-gray-50/50">
                <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                <div className="flex-1 text-right">
                  <h3 className="font-bold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">{item.category}</p>
                </div>
                <div className="text-left font-bold text-lg text-primary-600 px-4">
                  {item.price} ر.س
                </div>
                <button 
                  onClick={() => removeFromCart(item.id)}
                  className="text-red-500 hover:bg-red-50 p-2 rounded-full transition-colors"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="w-full lg:w-96 bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-fit">
          <h3 className="font-bold text-lg mb-4">ملخص الطلب</h3>
          <div className="flex justify-between mb-2 text-gray-600">
            <span>المجموع الفرعي</span>
            <span>{total} ر.س</span>
          </div>
          <div className="flex justify-between mb-4 text-gray-600 pb-4 border-b border-gray-100">
            <span>التوصيل</span>
            <span>مجاني</span>
          </div>
          <div className="flex justify-between mb-6 font-bold text-xl text-gray-900">
            <span>الإجمالي</span>
            <span>{total} ر.س</span>
          </div>
          
          <button 
            onClick={handleCheckout}
            className="w-full bg-[#25D366] text-white py-3 rounded-lg font-bold hover:bg-[#128C7E] transition-colors mb-3 flex items-center justify-center gap-2"
          >
            <MessageCircle size={20} /> إتمام الطلب عبر واتساب
          </button>
          <button 
            onClick={clearCart}
            className="w-full bg-red-50 text-red-600 py-3 rounded-lg font-bold hover:bg-red-100 transition-colors"
          >
            إفراغ السلة
          </button>
        </div>
      </div>
    </div>
  );
}
