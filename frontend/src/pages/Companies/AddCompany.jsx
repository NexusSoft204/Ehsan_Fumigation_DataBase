import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

function AddCompany() {
  const navigate = useNavigate();

  // ۱. استیت یکپارچه برای ذخیره اطلاعات فرم (آماده برای ارسال مستقیم به بک‌اند)
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    companyType: '',
    industry: '',
    phone: '',
    email: '',
    website: '',
    province: '',
    district: '',
    city: '',
    fullAddress: '',
    repName: '',
    repPosition: '',
    repPhone: '',
    repEmail: '',
    status: 'Active' // مقدار پیش‌فرض
  });

  // تابع هوشمند برای به‌روزرسانی فیلدها با تغییر کاربر
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  // تابع مدیریت ثبت فرم و اتصال به بک‌اند
  const handleSubmit = async (e) => {
  e.preventDefault();
  
  // ۱. تغییر ساختار داده‌ها به فرمت استاندارد بک‌آند (Nested snake_case)
  const payload = {
    company_name: formData.companyName,
    registration_number: formData.registrationNumber,
    company_type: formData.companyType.toLowerCase(), // تبدیل به حروف کوچک (private, public, llc)
    industry: formData.industry,
    phone_number: formData.phone,
    email: formData.email,
    website: formData.website || null, // اگر خالی بود مقدار null فرستاده شود
    province: formData.province,
    district: formData.district,
    city: formData.city,
    full_address: formData.fullAddress,
    status: formData.status === 'Active', // تبدیل استرینگ فرانت‌اند به Boolean واقعی برای جنگو
    
    // کپسوله کردن اطلاعات مسئولین به صورت یک لیست (آرایه)
    representatives: [
      {
        name: formData.repName,
        position: formData.repPosition,
        phone: formData.repPhone,
        email: formData.repEmail
      }
    ]
  };

  try {
    const response = await axios.post('http://127.0.0.1:8000/api/companies/', payload);
    
    if (response.status === 201) {
      console.log('ثبت نام موفقیت‌آمیز بود:', response.data);
      navigate('/companies');
    }
  } catch (error) {
    console.error('خطا در ارسال اطلاعات به بک‌آند:', error);
    if (error.response) {
      // خطایی که خود جنگو فرستاده است (مثلا تکراری بودن ایمیل یا فیلد خالی)
      alert(`خطا از سمت سرور: ${JSON.stringify(error.response.data)}`);
    } else {
      alert('خطا در اتصال به سرور! مطمئن شوید که بک‌آند جنگو روشن است.');
    }
  }
};

  return (
    <div className="space-y-6 font-interBold bg-[#F8FAFC]">
      
      {/* هدر صفحه */}
      <div>
        <h2 className="text-2xl font-bold text-[#003366]">Add New Company</h2>
        <p className="text-sm text-[#64748B] mt-1">Register a new enterprise in the management system.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* بخش اول: اطلاعات شرکت */}
        <div className="bg-white p-6 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <h3 className="text-base font-bold text-[#003366] border-b border-[#E2E8F0] pb-2 mb-4">🏢 Company Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Company Name *</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" placeholder="e.g. ABC Trading Ltd" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Registration Number</label>
              <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" placeholder="REG-102938" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Company Type</label>
              <select name="companyType" value={formData.companyType} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF] cursor-pointer">
                <option value="">Select Type</option>
                <option value="Private">Private</option>
                <option value="Public">Public</option>
                <option value="LLC">LLC</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Industry</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" placeholder="Logistics, Trade, IT, etc." />
            </div>
          </div>
        </div>

        {/* بخش دوم: اطلاعات تماس */}
        <div className="bg-white p-6 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <h3 className="text-base font-bold text-[#003366] border-b border-[#E2E8F0] pb-2 mb-4">📞 Contact Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF] text-left" dir="ltr" placeholder="+93 7xx xxx xxx" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF] text-left" dir="ltr" placeholder="info@company.com" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Website</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF] text-left" dir="ltr" placeholder="https://company.com" />
            </div>
          </div>
        </div>

        {/* بخش سوم: آدرس */}
        <div className="bg-white p-6 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <h3 className="text-base font-bold text-[#003366] border-b border-[#E2E8F0] pb-2 mb-4">📍 Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Province</label>
              <input type="text" name="province" value={formData.province} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" placeholder="Kabul" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" placeholder="District 4" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" placeholder="Kabul City" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1">Full Address</label>
            <textarea name="fullAddress" value={formData.fullAddress} onChange={handleChange} rows="2" className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" placeholder="Street 3, House 45, Near..." />
          </div>
        </div>

        {/* بخش چهارم: نماینده شرکت */}
        <div className="bg-white p-6 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <h3 className="text-base font-bold text-[#003366] border-b border-[#E2E8F0] pb-2 mb-4">👤 Representative (معتمد / مسئول)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Representative Name</label>
              <input type="text" name="repName" value={formData.repName} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" placeholder="Ahmad Ahmadi" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Position</label>
              <input type="text" name="repPosition" value={formData.repPosition} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" placeholder="CEO / Manager" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Phone</label>
              <input type="text" name="repPhone" value={formData.repPhone} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF] text-left" dir="ltr" placeholder="+93 7xx xxx xxx" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-[#0F172A] mb-1">Email</label>
              <input type="email" name="repEmail" value={formData.repEmail} onChange={handleChange} className="w-full p-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF] text-left" dir="ltr" placeholder="rep@company.com" />
            </div>
          </div>
        </div>

      {/* بخش پنجم: وضعیت فعالیت */}
<div className="bg-white p-6 rounded-[12px] border border-[#E2E8F0] shadow-sm">
  <h3 className="text-base font-bold text-[#003366] border-b border-[#E2E8F0] pb-2 mb-3">
    ⚙️ Status
  </h3>

  <div className="flex gap-6 items-center">
    <label className="flex items-center gap-2 cursor-pointer select-none text-sm font-semibold text-[#0F172A]">
      <input
        type="radio"
        name="status"
        value="Active"
        checked={formData.status === "Active"}
        onChange={handleChange}
        className="w-4 h-4 text-[#003366] focus:ring-[#00C8FF]"
      />

      <span>Active</span>
    </label>
  </div>
</div>

{/* دکمه‌های انتهای فرم */}
<div className="flex justify-end gap-3">
  <button
    type="button"
    onClick={() => navigate("/companies")}
    className="px-5 py-2.5 border border-[#E2E8F0] rounded-[8px] text-sm font-bold text-[#64748B] bg-white hover:bg-slate-50 transition-all"
  >
    Cancel
  </button>

  <button
    type="submit"
    className="px-5 py-2.5 rounded-[8px] text-sm font-bold text-white bg-[#003366] hover:bg-[#00264d] transition-all"
  >
    Create Company
  </button>
</div>

</form>
</div>
);
}

export default AddCompany;