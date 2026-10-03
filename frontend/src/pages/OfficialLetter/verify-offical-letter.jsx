import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

// تعریف آدرس پایه API (می‌توانید از متغیر محیطی VITE_API_URL استفاده کنید یا مستقیم بنویسید)
const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";

const Verify_offical_letter = () => {
  // ۱. استخراج tracking_id از آدرس روت ری‌اکت
  const { tracking_id } = useParams();
  
  // ۲. استیت‌ها برای ذخیره دیتا، وضعیت لودینگ و خطاها
  const [letterData, setLetterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // ۳. درخواست به API جنگو هنگام لود شدن صفحه
  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/letters/${tracking_id}/`)
      .then((res) => {
        if (!res.ok) {
          throw new Error("مکتوب یا سرتیفیکیت مورد نظر یافت نشد.");
        }
        return res.json();
      })
      .then((data) => {
        setLetterData(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("خطا در دریافت اطلاعات:", err);
        setError(err.message);
        setLoading(false);
      });
  }, [tracking_id]);

  // ۴. وضعیت در حال بارگذاری
  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 font-sans" dir="rtl">
        <div className="text-xl text-gray-600 animate-pulse">در حال استعلام و بارگذاری اطلاعات مکتوب...</div>
      </div>
    );
  }

  // ۵. وضعیت بروز خطا (مثلاً اگر tracking_id اشتباه باشد)
  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 font-sans" dir="rtl">
        <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg shadow-md max-w-md text-center">
          <svg className="w-12 h-12 mx-auto mb-2 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          <p className="font-bold">{error}</p>
          <p className="text-sm text-gray-500 mt-2">لطفاً بارکد را دوباره اسکن کنید یا از صحت لینک اطمینان حاصل فرمایید.</p>
        </div>
      </div>
    );
  }

  // ۶. نمایش اطلاعات تایید شده مکتوب
  return (
    <div className="min-h-screen bg-gradient-to-tr from-gray-100 to-gray-200 py-10 font-sans" dir="rtl">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
        
        {/* هدر بخش تاییدیه */}
        <div className="bg-emerald-600 p-6 text-white text-center">
          <div className="bg-white/20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-3">
            <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-xl font-bold tracking-wide font-ShabnamBold">سایت اصالت‌سنجی الکترونیکی</h1>
          <p className="text-emerald-100 text-sm mt-1 font-ShabnamLight">این مکتوب/سرتیفیکیت مورد تایید شرکت احسان صبور می‌باشد</p>
        </div>

        {/* بدنه و اطلاعات مکتوب */}
        <div className="p-8 space-y-6">
          
          {/* ردیف اول: شماره پیگیری و تاریخ */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-xl border border-gray-100">
            <div>
              <span className="text-xs text-gray-400 block mb-1 font-ShabnamBold">کد رهگیری (Tracking ID):</span>
              <span className="text-sm font-mono font-semibold text-gray-700 block break-all">{letterData.tracking_id}</span>
            </div>
            <div>
              <span className="text-xs text-gray-400 block mb-1 font-ShabnamBold">تاریخ صدور مکتوب:</span>
              <span className="text-sm font-semibold text-gray-700 block">{letterData.created_at}</span>
            </div>
          </div>

          {/* ردیف دوم: به (مقصد) */}
          <div className="border-b pb-4">
            <span className="text-sm text-gray-400 block mb-1 font-ShabnamBold">صادر شده به نام (مرجع گیرنده):</span>
            <span className="text-base font-ShabnamLight text-gray-800">{letterData.destination}</span>
          </div>

          {/* ردیف سوم: موضوع */}
          <div className="border-b pb-4">
            <span className="text-sm text-gray-400 block mb-1 font-ShabnamBold">موضوع اصلی:</span>
            <span className="text-base text-gray-800 font-ShabnamLight">{letterData.subject}</span>
          </div>

          {/* ردیف چهارم: متن مکتوب */}
          <div>
            <span className="text-sm text-gray-400 block mb-2 font-ShabnamBold">متن و محتوای مکتوب:</span>
            <div className="bg-gray-50/50 text-justify text-gray-800 p-5 rounded-xl border border-dashed border-gray-200 leading-relaxed whitespace-pre-line text-sm">
              <p className='font-ShabnamLight'>
                {letterData.content}
              </p>
            </div>
          </div>

        </div>

        {/* فوتر صفحه تاییدیه */}
        <div className="bg-gray-50 px-8 py-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center text-xs text-gray-400 gap-2">
          <span className='font-ShabnamLight'>شرکت خدمات ضدعفونی احسان صبور</span>
        </div>

      </div>
    </div>
  );
};

export default Verify_offical_letter;
