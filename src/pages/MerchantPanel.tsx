import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Package, Clock, CheckCircle } from 'lucide-react';

export default function MerchantPanel() {
  const { role, addProduct, products, orders, addNotification } = useStore();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');
  
  if (role !== 'merchant' && role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-red-600 font-bold">
        عذراً، هذه الصفحة مخصصة للتجار فقط.
      </div>
    );
  }

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !price || !category) return;
    
    // Status depends on role: admin can add approved products directly, merchants require approval
    const status = role === 'admin' ? 'approved' : 'pending';
    
    addProduct({
      id: Math.random().toString(36).substr(2, 9),
      name,
      price: Number(price),
      category,
      status,
      image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=500&q=80', // Default image
    });
    
    if (status === 'pending') {
      addNotification({
        text: `التاجر أضاف منتج جديد (${name}) بانتظار الاعتماد.`,
        type: 'product_approval',
        targetRole: 'admin'
      });
      alert('تم إرسال المنتج للمدير بانتظار الاعتماد!');
    } else {
      alert('تم إضافة المنتج بنجاح كمنتج معتمد.');
    }
    
    setName(''); setPrice(''); setCategory('');
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Package className="text-primary-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">لوحة التاجر</h2>
      </div>

      <div className="flex border-b border-gray-200 mb-8 gap-4">
        <button 
          onClick={() => setActiveTab('products')}
          className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 ${activeTab === 'products' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          منتجاتي
        </button>
        <button 
          onClick={() => setActiveTab('orders')}
          className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 ${activeTab === 'orders' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          الطلبات الواردة
        </button>
      </div>
      
      {activeTab === 'products' && (
        <>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 mb-8">
            <h3 className="font-bold text-lg mb-4 text-gray-800 border-b border-gray-100 pb-2">إضافة منتج جديد</h3>
            <form onSubmit={handleAdd} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">اسم المنتج</label>
                <input 
                  type="text" 
                  value={name} onChange={(e) => setName(e.target.value)}
                  className="w-full text-right bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary-500"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">السعر (ر.س)</label>
                <input 
                  type="number" 
                  value={price} onChange={(e) => setPrice(e.target.value)}
                  className="w-full text-right bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary-500"
                  required 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">التصنيف</label>
                <input 
                  type="text" 
                  value={category} onChange={(e) => setCategory(e.target.value)}
                  className="w-full text-right bg-gray-50 border border-gray-300 rounded-lg py-2 px-3 focus:ring-2 focus:ring-primary-500"
                  required 
                />
              </div>
              <button type="submit" className="w-full bg-primary-600 text-white py-2 rounded-lg font-bold hover:bg-primary-700 transition-colors flex items-center justify-center gap-2">
                <Plus size={20} /> إضافة المنتج
              </button>
            </form>
          </div>

          <h3 className="font-bold text-lg mb-4 text-gray-800">منتجاتي الحالية ({products.length})</h3>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <table className="w-full text-right">
              <thead className="bg-gray-50 text-gray-600 border-b border-gray-200">
                <tr>
                  <th className="py-3 px-4 font-medium">المنتج</th>
                  <th className="py-3 px-4 font-medium">التصنيف</th>
                  <th className="py-3 px-4 font-medium">السعر</th>
                  <th className="py-3 px-4 font-medium">حالة المنتج</th>
                </tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50">
                    <td className="py-3 px-4 text-gray-800 font-bold">{p.name}</td>
                    <td className="py-3 px-4 text-gray-500">{p.category}</td>
                    <td className="py-3 px-4 font-bold text-primary-600">{p.price} ر.س</td>
                    <td className="py-3 px-4">
                      {p.status === 'approved' ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-green-700 bg-green-100 px-2 py-1 rounded-full">
                          <CheckCircle size={14} /> معتمد
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-bold text-orange-700 bg-orange-100 px-2 py-1 rounded-full">
                          <Clock size={14} /> بانتظار الاعتماد
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {products.length === 0 && (
                  <tr>
                    <td colSpan={4} className="py-8 text-center text-gray-500">لا توجد منتجات مضافة بعد.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {activeTab === 'orders' && (
        <div className="space-y-4">
          <h3 className="font-bold text-lg mb-4 text-gray-800">الطلبات الواردة</h3>
          {orders.length === 0 ? (
            <div className="bg-white p-8 rounded-xl border border-gray-100 text-center text-gray-500 shadow-sm">
              لا توجد طلبات واردة حالياً
            </div>
          ) : (
            orders.map(order => (
              <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-4">
                  <div>
                    <span className="text-sm text-gray-500 block">رقم الطلب</span>
                    <span className="font-bold font-mono text-lg text-gray-800">#{order.id}</span>
                  </div>
                  <div className="text-left">
                    <span className="text-sm text-gray-500 block">تاريخ الطلب</span>
                    <span className="text-gray-700 font-medium">{new Date(order.createdAt).toLocaleDateString('ar-SA')}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <h4 className="font-bold text-gray-800 mb-3">المنتجات المطلوبة:</h4>
                  <ul className="space-y-2">
                    {order.items.map((item, index) => (
                      <li key={index} className="flex justify-between items-center bg-gray-50 p-3 rounded-lg border border-gray-100">
                        <span className="text-gray-800 font-medium">{item.name} <span className="text-xs text-gray-500">({item.category})</span></span>
                        <span className="font-bold text-primary-600">{item.price} ر.س</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between items-center pt-4 border-t border-gray-100 mt-4">
                  <span className="font-bold text-gray-800">إجمالي الطلب:</span>
                  <span className="text-xl font-bold text-primary-600">{order.total} ر.س</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
}
