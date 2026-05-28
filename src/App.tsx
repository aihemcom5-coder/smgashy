/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Home from './pages/Home';
import Cart from './pages/Cart';
import MerchantPanel from './pages/MerchantPanel';
import AdminDashboard from './pages/AdminDashboard';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col bg-gray-50 font-sans" dir="rtl">
        <Header />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/merchant" element={<MerchantPanel />} />
            <Route path="/admin" element={<AdminDashboard />} />
          </Routes>
        </main>
        <footer className="bg-white border-t border-gray-200 mt-12 py-8 text-center text-gray-500 text-sm">
          حقوق الطبع والنشر © 2026 سوق المجعشي. جميع الحقوق محفوظة.
        </footer>
      </div>
    </BrowserRouter>
  );
}
