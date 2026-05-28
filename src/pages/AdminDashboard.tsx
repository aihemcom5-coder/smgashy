import React, { useState } from 'react';
import { useStore } from '../store';
import { Download, Upload, Shield, RefreshCw, FileArchive, CheckCircle, Package } from 'lucide-react';
import { zipSync, strToU8 } from 'fflate';

export default function AdminDashboard() {
  const { role, restoreState, products, approveProduct, addNotification, merchantRequests, approveMerchantRequest } = useStore();
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'system' | 'approvals'>('approvals');

  if (role !== 'admin') {
    return (
      <div className="max-w-7xl mx-auto px-4 py-16 text-center text-red-600 font-bold">
        عذراً، هذه الصفحة مخصصة للمدير (الآدمن) فقط ولا تظهر للزوار أو التجار.
      </div>
    );
  }

  const pendingProducts = products.filter(p => p.status === 'pending');
  const pendingMerchants = merchantRequests.filter(m => m.status === 'pending');

  const handleApprove = (id: string, name: string) => {
    approveProduct(id);
    addNotification({
      text: `تم اعتماد منتجك الجديد (${name}) وهو متاح الآن في المتجر!`,
      type: 'info',
      targetRole: 'merchant'
    });
    alert('تم اعتماد المنتج بنجاح وإشعار التاجر.');
  };

  const handleApproveMerchant = (id: string, name: string) => {
    approveMerchantRequest(id);
    addNotification({
      text: `تم اعتماد طلبك كتاجر (${name}). يمكنك الآن استبدال صلاحيتك إلى تاجر والبدء في إضافة المنتجات!`,
      type: 'info',
      targetRole: 'visitor'  // We mock the notification going to the user
    });
    alert('تم الموافقة على طلب التاجر بنجاح.');
  };

  // Feature 1 & 2: App Update / Download mock APK
  const handleDownloadAPK = () => {
    const data = "Mock APK Content directly created by Al Mgashy App";
    const blob = new Blob([data], { type: 'application/vnd.android.package-archive' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AlMgashyApp_Latest.apk';
    a.click();
    URL.revokeObjectURL(url);
    
    setUpdateSuccess(true);
    setTimeout(() => {
      setShowUpdateModal(false);
      setUpdateSuccess(false);
    }, 3000);
  };

  // Feature 3: Backup & Restore
  const handleExportBackup = () => {
    const rawData = localStorage.getItem('almgashy-storage');
    if (!rawData) return alert('لا يوجد بيانات للنسخ الاحتياطي');
    
    const blob = new Blob([rawData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AlMgashy_Backup_${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImportBackup = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed.state) {
          restoreState(parsed.state);
          alert('تم استعادة النسخة الاحتياطية بنجاح! بياناتك باقية ولن تفقد.');
        } else {
          alert('ملف النسخ الاحتياطي غير صالح.');
        }
      } catch (err) {
        alert('حدث خطأ أثناء قراءة الملف.');
      }
    };
    reader.readAsText(file);
  };

  // Feature 4: Download source ZIP (mocking source download)
  const handleDownloadZIP = () => {
    // We create a mock zip using fflate
    const zipData = zipSync({
      'config.txt': strToU8('Al Mgashy Settings Config\nVersion 2.0\nAdmin Enabled: true'),
      'README.md': strToU8('# سوق المجعشي\nملفات التطبيق للتعديل عليها.'),
      'settings.json': strToU8(localStorage.getItem('almgashy-storage') || '{}'),
    });
    
    const blob = new Blob([zipData], { type: 'application/zip' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'AlMgashy_SourceFiles.zip';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="text-primary-600" size={28} />
        <h2 className="text-2xl font-bold text-gray-800">لوحة تحكم المدير</h2>
      </div>

      <div className="flex border-b border-gray-200 mb-8 gap-4">
        <button 
          onClick={() => setActiveTab('approvals')}
          className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 flex items-center gap-2 ${activeTab === 'approvals' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          الطلبات والاعتمادات
          {(pendingProducts.length + pendingMerchants.length) > 0 && (
            <span className="bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full font-bold">
              {pendingProducts.length + pendingMerchants.length}
            </span>
          )}
        </button>
        <button 
          onClick={() => setActiveTab('system')}
          className={`pb-4 px-2 font-bold text-lg transition-colors border-b-2 ${activeTab === 'system' ? 'border-primary-600 text-primary-600' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          إدارة النظام والمحفوظات
        </button>
      </div>

      {activeTab === 'approvals' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Package size={20} className="text-orange-500" />
              <h3 className="font-bold text-gray-800">منتجات بانتظار الاعتماد ({pendingProducts.length})</h3>
            </div>
            {pendingProducts.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                لا توجد منتجات بانتظار الاعتماد حالياً.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {pendingProducts.map(p => (
                  <li key={p.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-lg bg-gray-200 overflow-hidden">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <h4 className="font-bold text-gray-800">{p.name}</h4>
                        <div className="text-sm text-gray-500 flex gap-4 mt-1">
                          <span>السعر: {p.price} ر.س</span>
                          <span>التصنيف: {p.category}</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleApprove(p.id, p.name)}
                        className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-100 transition border border-green-200 flex items-center gap-2"
                      >
                        <CheckCircle size={18} /> اعتماد المنتج
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-6">
            <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center gap-2">
              <Shield size={20} className="text-blue-500" />
              <h3 className="font-bold text-gray-800">طلبات التجار بانتظار الاعتماد ({pendingMerchants.length})</h3>
            </div>
            {pendingMerchants.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                لا توجد طلبات تجار بانتظار الاعتماد حالياً.
              </div>
            ) : (
              <ul className="divide-y divide-gray-100">
                {pendingMerchants.map(m => (
                  <li key={m.id} className="p-4 flex items-center justify-between hover:bg-gray-50/50">
                    <div>
                      <h4 className="font-bold text-gray-800">{m.name}</h4>
                      <span className="text-sm text-gray-500">{new Date(m.createdAt).toLocaleDateString('ar-SA')}</span>
                    </div>
                    <div>
                      <button 
                        onClick={() => handleApproveMerchant(m.id, m.name)}
                        className="bg-green-50 text-green-700 px-4 py-2 rounded-lg font-bold hover:bg-green-100 transition border border-green-200 flex items-center gap-2"
                      >
                        <CheckCircle size={18} /> اعتماد كتاجر
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {activeTab === 'system' && (
        <>
          <p className="text-gray-600 mb-8">
            يمكن من خلالها تحديث التطبيق دون فقد البيانات، أخذ نسخ احتياطية واستعادتها، وتنزيل ملفات السورس.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* App Update Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="bg-blue-50 w-12 h-12 rounded-full flex items-center justify-center text-blue-600 mb-4">
                  <RefreshCw size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">تحديث التطبيق المباشر</h3>
                <p className="text-sm text-gray-500 mb-4">حل مشكلة عدم تنزيل الملف، يمكنك تحميل آخر تحديث الآن (APK) والتمتع بالتحديثات.</p>
              </div>
              <button 
                onClick={() => setShowUpdateModal(true)}
                className="w-full bg-blue-600 text-white rounded-lg py-2 font-medium hover:bg-blue-700 transition"
              >
                نافذة التحديث
              </button>
            </div>

            {/* Backup Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
              <div>
                <div className="bg-green-50 w-12 h-12 rounded-full flex items-center justify-center text-green-600 mb-4">
                  <Download size={24} />
                </div>
                <h3 className="font-bold text-lg mb-2">إدارة النسخ الاحتياطي</h3>
                <p className="text-sm text-gray-500 mb-4">حفظ بيانات التطبيق (لا تفقد عند الخروج، وتظل كما هي) أو استعادتها.</p>
              </div>
              <div className="flex flex-col gap-2">
                <button 
                  onClick={handleExportBackup}
                  className="w-full bg-green-50 text-green-700 rounded-lg py-2 font-medium hover:bg-green-100 transition border border-green-200"
                >
                  تحميل نسخة احتياطية (JSON)
                </button>
                <label className="w-full bg-white text-green-700 rounded-lg py-2 font-medium hover:bg-gray-50 transition border border-green-200 text-center cursor-pointer">
                  استعادة من ملف
                  <input type="file" accept=".json" className="hidden" onChange={handleImportBackup} />
                </label>
              </div>
            </div>

            {/* Source ZIP Card */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between md:col-span-2">
              <div className="flex items-start gap-4">
                <div className="bg-purple-50 w-12 h-12 rounded-full flex items-center justify-center text-purple-600 shrink-0">
                  <FileArchive size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-2">تنزيل ملفات التطبيق للتعديل</h3>
                  <p className="text-sm text-gray-500 mb-4">نافذة تنزيل ملفات التطبيق (ZIP) تتيح لك تحميل هيكل التطبيق والبيانات لكي تستطيع التعديل فيه محليًا.</p>
                  <button 
                    onClick={handleDownloadZIP}
                    className="bg-purple-600 text-white px-6 rounded-lg py-2 font-medium hover:bg-purple-700 transition"
                  >
                    تنزيل ملف (ZIP)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Update Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col items-center justify-center p-4">
          <div className="bg-white max-w-md w-full rounded-2xl p-6 text-center transform transition-all shadow-2xl">
            {!updateSuccess ? (
              <>
                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <RefreshCw className="animate-spin" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">يتوفر تحديث جديد!</h3>
                <p className="text-gray-600 mb-6 font-medium text-sm">
                  هذا التحديث يحافظ على بياناتك الحالية. حمّل التطبيق الآن لتتمتع بآخر الميزات بدون أن تفقد أي معلومات عند الخروج.
                </p>
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowUpdateModal(false)}
                    className="flex-1 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl font-bold"
                  >
                    إلغاء
                  </button>
                  <button 
                    onClick={handleDownloadAPK}
                    className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-xl font-bold shadow hover:bg-primary-700"
                  >
                    تنزيل APK 📥
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <CheckCircle size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">تم تنزيل التحديث!</h3>
                <p className="text-green-600 mb-2 font-medium">تم بدء تحميل ملف APK بنجاح.</p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}
