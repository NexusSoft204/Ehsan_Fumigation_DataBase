import React, { useState, useEffect, useRef } from 'react'; 
import { QRCodeSVG } from 'qrcode.react';
import { useParams } from 'react-router-dom';
import html2pdf from "html2pdf.js";
const API_URL = import.meta.env.VITE_API_URL
const FRONTEND_URL = import.meta.env.VITE_FRONTEND_URL;


const OfficialLetter = () => {
  const { tracking_id } = useParams();
  const [letterData, setLetterData] = useState(null);
  
  // تعریف یک رفرنس برای کانتینر اصلی مکتوب A4
  const letterRef = useRef(null);

  // دریافت اطلاعات مکتوب از API جنگو
  useEffect(() => {
    fetch(`${API_URL}/api/letters/${tracking_id}/`)
      .then(res => res.json())
      .then(data => setLetterData(data))
      .catch(err => console.error("خطا در دریافت اطلاعات:", err));
  }, [tracking_id]);

  // فانکشن دانلود مستقیم PDF
  const handleDownloadPDF = () => {
    const element = letterRef.current; // دریافت کانتینر مکتوب
    
    // تنظیمات استاندارد برای ابعاد دقیق A4 بدون حاشیه سفید اضافی
    const options = {
      margin: 0,
      filename: `Official-Letter-${tracking_id.substring(0, 8)}.pdf`,
      image: { type: 'jpeg', quality: 0.98 }, // حفظ کیفیت بالای تصاویر سربرگ و پابرگ
      html2canvas: { 
        scale: 2, // بالا بردن رزولوشن برای خوانایی کامل بارکد و متون
        useCORS: true, // رفع مشکل لود نشدن تصاویر بیرونی و بارکد
        letterRendering: true 
      },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' } // تنظیم ابعاد دقیق کاغذ A4
    };

    // اجرای پروسه دانلود
    html2pdf().set(options).from(element).save();
  };

  if (!letterData) return <div className="text-center p-5">در حال بارگذاری مکتوب...</div>;

  return (
    <div className="bg-gray-100 min-h-screen py-8 print:p-0 print:bg-white">
      
      {/* منوی دکمه‌ها (در هنگام پرینت یا دانلود غیب می‌شود) */}
      <div className="max-w-[210mm] mx-auto mb-4 print:hidden flex justify-between items-center px-4">
        
        {/* دکمه جدید برای دانلود PDF */}
        <button 
          onClick={handleDownloadPDF} 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-6 rounded shadow transition-colors"
        >
          Download PDF
        </button>
      </div>

      {/* کانتینر اصلی مکتوب با اندازه دقیق A4 (متصل شده به ref) */}
      <div 
        ref={letterRef} 
        className="relative w-[210mm] h-[297mm] bg-white mx-auto shadow-2xl print:shadow-none print:margin-0 overflow-hidden select-none" 
        dir="rtl"
      >
        
        {/* ۱. تصویر سربرگ شرکت احسان صبور */}
        <div className="absolute top-0 left-0 w-full">
          <img src="/images/1.png" alt="Header" className="w-full object-contain" />
        </div>

        {/* ۲. محتوای مکتوب (با فاصله ایمن از سربرگ و پابرگ) */}
        <div className="absolute top-[65mm] bottom-[48mm] left-[20mm] right-[20mm] flex flex-col font-sans">
          
          {/* مشخصات مکتوب */}
          <div className="flex flex-wrap mt-10 items-center text-sm mb-8 text-gray-700 border-b pb-2">
            <div className='w-full'>
                <strong className='font-bold font-ShabnamBold'>تاریخ:</strong>
                 {letterData.created_at}
            </div>
            <div className='w-full my-6'>
                <strong className='font-bold font-ShabnamBold'>موضوع:</strong> 
                <p className='font-ShabnamLight'>{letterData.subject}</p>
            </div>
            <div className='w-full'>
                <strong className='font-bold font-ShabnamBold'>به:</strong> 
                <p className='font-ShabnamLight'>{letterData.destination}</p>
            </div>
          </div>

          {/* متن اصلی مکتوب */}
          <div className="text-justify text-base leading-loose text-gray-900 whitespace-pre-line px-2">
            <p className='font-ShabnamLight'>
                {letterData.content}
            </p>
          </div>
          
        </div>

        {/* ۳. تصویر پابرگ شرکت */}
        <div className="absolute bottom-0 left-0 w-full">
          <img src="/images/2.png" alt="Footer" className="w-full object-contain" />
        </div>

        {/* ۴. زون قرارگیری بارکد (دقیقاً روی کادر زرد رنگ وسط پابرگ) */}
        <div className="absolute bottom-[10mm] left-[43%] w-[28mm] h-[28mm] bg-white p-1 ">
          <QRCodeSVG 
            value={`${FRONTEND_URL}/OfficialLetter/verify/${tracking_id}`} 
            size={90}
            level={"H"} 
            includeMargin={false}
          />
        </div>

      </div>
    </div>
  );
};

export default OfficialLetter;
