import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const LetterForm = ({ onLetterCreated }) => {
  const [formData, setFormData] = useState({
    destination: '',
    subject: '',
    content: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('http://127.0.0.1:8000/api/letters/create/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        // پس از ثبت موفق، شناسه را به کامپوننت اصلی می‌فرستیم تا صفحه نمایش مکتوب باز شود
        if (onLetterCreated) onLetterCreated(data.tracking_id);
        setTimeout(() => {
            navigate(`/official-letter/${data.tracking_id}`); 
        }, 5000);

      } else {
        setError(data.error || 'خطایی در ثبت مکتوب رخ داد.');
      }
    } catch (err) {
      setError('ارتباط با سرور برقرار نشد. لطفاً اینترنت خود را بررسی کنید.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans" dir="rtl">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        
        {/* هدر فرم */}
        <div className="bg-gradient-to-r from-emerald-700 to-green-600 p-6 text-white text-center">
          <h2 className="text-2xl font-bold mb-1">سیستم صدور مکتوبات رسمی</h2>
          <p className="text-sm text-green-100">شرکت تجارتی احسان صبور</p>
        </div>

        {/* بدنه فرم */}
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          
          {error && (
            <div className="bg-red-50 border-r-4 border-red-500 text-red-700 p-4 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* دو فیلد در یک ردیف */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* سازمان مقصد */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">ارسال به (سازمان مقصد):</label>
              <input
                type="text"
                name="destination"
                value={formData.destination}
                onChange={handleChange}
                placeholder="مثال: وزارت مالیه، آمریت صحت عامه"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm placeholder-gray-400"
                required
              />
            </div>

            {/* موضوع مکتوب */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">موضوع مکتوب:</label>
              <input
                type="text"
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                placeholder="مثال: درخواست ضدعفونی و کنترل آفات هرات"
                className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm placeholder-gray-400"
                required
              />
            </div>
          </div>

          {/* متن اصلی مکتوب */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">متن مکتوب:</label>
            <textarea
              name="content"
              value={formData.content}
              onChange={handleChange}
              rows="8"
              placeholder="متن رسمی مکتوب خود را در این قسمت به صورت دقیق وارد نمایید..."
              className="w-full px-4 py-3 rounded-xl border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all text-sm leading-relaxed placeholder-gray-400 resize-none"
              required
            ></textarea>
          </div>

          {/* دکمه ثبت و ایجاد */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 px-6 text-white font-bold rounded-xl transition-all transform active:scale-[0.98] shadow-lg ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-emerald-600 hover:bg-emerald-700 hover:shadow-emerald-200'
              }`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2 space-x-reverse">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Saving Document...</span>
                </div>
              ) : (
                'Save Document'
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};

export default LetterForm;
