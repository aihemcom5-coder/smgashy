import React, { useState, useRef, useEffect } from 'react';
import { ShoppingCart, LayoutDashboard, Store, User, Bell, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useStore, Role } from '../store';

export default function Header() {
  const { role, setRole, cart, notifications, markNotificationAsRead, markAllAsRead, addMerchantRequest, addNotification } = useStore();
  const [showNotifications, setShowNotifications] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const handleJoinAsMerchant = () => {
    const name = prompt('الرجاء إدخال اسم المتجر/التاجر:');
    if (name) {
      addMerchantRequest(name);
      addNotification({
        text: `طلب انضمام تاجر جديد (${name}) بانتظار الموافقة.`,
        type: 'merchant_approval',
        targetRole: 'admin'
      });
      alert('تم إرسال طلبك للإدارة، سيتم إعلامك عند الموافقة.');
    }
  };

  const roleLabels: Record<Role, string> = {
    visitor: 'زائر',
    merchant: 'تاجر',
    admin: 'مدير (الآدمن)'
  };

  const userNotifications = notifications.filter(n => n.targetRole === role || (role === 'admin' && n.targetRole !== 'visitor'));
  const unreadCount = userNotifications.filter(n => !n.isRead).length;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowNotifications(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow relative z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-4">
            <Link to="/" className="text-xl font-bold text-primary-600 flex items-center gap-2">
              <span className="text-2xl">🛍️</span>
              سوق المجعشي
            </Link>
          </div>

          <nav className="hidden md:flex gap-6 items-center">
            <Link to="/" className="text-gray-600 hover:text-primary-600 font-medium">الرئيسية</Link>
            
            {role === 'admin' && (
              <Link to="/admin" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-1">
                <LayoutDashboard size={18} /> لوحة الإدارة
              </Link>
            )}
            
            {(role === 'merchant' || role === 'admin') && (
              <Link to="/merchant" className="text-gray-600 hover:text-primary-600 font-medium flex items-center gap-1">
                <Store size={18} /> لوحة التاجر
              </Link>
            )}

            <Link to="/cart" className="text-gray-600 hover:text-primary-600 font-medium relative flex items-center gap-1">
              <ShoppingCart size={20} /> السلة
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                  {cart.length}
                </span>
              )}
            </Link>

            {role === 'visitor' && (
              <button 
                onClick={handleJoinAsMerchant}
                className="text-gray-600 hover:text-primary-600 font-medium"
              >
                انضم كتاجر
              </button>
            )}

            <div className="relative" ref={dropdownRef}>
              <button 
                onClick={() => setShowNotifications(!showNotifications)}
                className="text-gray-600 hover:text-primary-600 font-medium relative flex items-center p-1"
              >
                <Bell size={20} />
                {unreadCount > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full font-bold">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute left-0 mt-2 w-80 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 origin-top-left">
                  <div className="px-4 py-2 border-b border-gray-100 flex justify-between items-center">
                    <h3 className="font-bold text-gray-800">الإشعارات</h3>
                    {unreadCount > 0 && (
                      <button onClick={markAllAsRead} className="text-xs text-primary-600 hover:underline">
                        تحديد الكل كمقروء
                      </button>
                    )}
                  </div>
                  <div className="max-h-80 overflow-y-auto">
                    {userNotifications.length === 0 ? (
                      <div className="px-4 py-6 text-center text-gray-500 text-sm">
                        لا توجد إشعارات حالياً
                      </div>
                    ) : (
                      userNotifications.map(notification => (
                        <div 
                          key={notification.id} 
                          className={`px-4 py-3 border-b border-gray-50 hover:bg-gray-50 transition-colors ${!notification.isRead ? 'bg-primary-50/50' : ''}`}
                          onClick={() => {
                            if (!notification.isRead) markNotificationAsRead(notification.id);
                          }}
                        >
                          <p className={`text-sm ${!notification.isRead ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                            {notification.text}
                          </p>
                          <span className="text-xs text-gray-400 mt-1 block">
                            {new Date(notification.createdAt).toLocaleTimeString('ar-SA')}
                          </span>
                        </div>
                      ))
                    )}
                  </div>
                  <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 text-center">
                    <span className="text-xs text-gray-500 block">اضغط على الإشعار لتحديده كمقروء</span>
                  </div>
                </div>
              )}
            </div>

            <div className="border-r border-gray-200 pr-4 ml-2 flex items-center gap-2">
              <User size={18} className="text-gray-400" />
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="text-sm bg-gray-50 border border-gray-300 rounded-md py-1.5 px-3 text-gray-800 font-medium outline-none focus:ring-2 focus:ring-primary-500 transition-all appearance-none pr-8 cursor-pointer relative"
                style={{
                  backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                  backgroundPosition: 'left 0.5rem center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: '1.5em 1.5em'
                }}
              >
                <option value="visitor">{roleLabels['visitor']}</option>
                <option value="merchant">{roleLabels['merchant']}</option>
                <option value="admin">{roleLabels['admin']}</option>
              </select>
            </div>
          </nav>
        </div>
      </div>
    </header>
  );
}
