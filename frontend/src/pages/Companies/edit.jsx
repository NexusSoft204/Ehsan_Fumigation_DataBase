import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

function EditCompany() {
  const { id } = useParams(); // دریافت شناسه شرکت از آدرس URL
  const navigate = useNavigate();

  // آدرس پایه API هماهنگ با سیستم Vite
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    companyName: '',
    registrationNumber: '',
    companyType: 'private',
    industry: '',
    phone: '',
    email: '',
    website: '',
    province: '',
    district: '',
    city: '',
    fullAddress: '',
    status: true,
    // مشخصات مسئول اول
    repName: '',
    repPosition: '',
    repPhone: '',
    repEmail: ''
  });

  // ۱. دریافت اطلاعات فعلی شرکت برای پر کردن فرم (Pre-fill)
  useEffect(() => {
    const fetchCompanyData = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/companies/${id}/`);
        const data = response.data;
        
        // استخراج اطلاعات مسئول اول (در صورت وجود)
        const primaryRep = data.representatives && data.representatives[0] ? data.representatives[0] : {};
        
        setFormData({
          companyName: data.company_name || '',
          registrationNumber: data.registration_number || '',
          companyType: data.company_type || 'private',
          industry: data.industry || '',
          phone: data.phone_number || '',
          email: data.email || '',
          website: data.website || '',
          province: data.province || '',
          district: data.district || '',
          city: data.city || '',
          fullAddress: data.full_address || '',
          status: data.status,
          repName: primaryRep.name || '',
          repPosition: primaryRep.position || '',
          repPhone: primaryRep.phone || '',
          repEmail: primaryRep.email || ''
        });
      } catch (error) {
        console.error('Error fetching company data:', error);
        alert('Failed to fetch company details for editing.');
        navigate('/companies');
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyData();
  }, [id, API_URL, navigate]);

  // تابع مدیریت تغییرات فیلدها
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // ۲. ارسال اطلاعات ویرایش‌شده به بک‌آند (PUT Request)
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ساختاربندی مجدد داده‌ها طبق فیلدهای جنگو (Nested JSON)
    const payload = {
      company_name: formData.companyName,
      registration_number: formData.registrationNumber,
      company_type: formData.companyType.toLowerCase(),
      industry: formData.industry,
      phone_number: formData.phone,
      email: formData.email,
      website: formData.website || null,
      province: formData.province,
      district: formData.district,
      city: formData.city,
      full_address: formData.fullAddress,
      status: formData.status,
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
      const response = await axios.put(`${API_URL}/api/companies/${id}/`, payload);
      if (response.status === 200) {
        alert('Company profile updated successfully! 🎉');
        navigate(`/companies/details/${id}`); // هدایت به صفحه جزئیات پس از ویرایش
      }
    } catch (error) {
      console.error('Error updating company:', error);
      if (error.response) {
        alert(`Server Error: ${JSON.stringify(error.response.data)}`);
      } else {
        alert('Connection error. Could not reach the server.');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 font-bold text-[#003366]">
        Loading profile data...
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 font-interBold bg-[#F8FAFC] p-4">
      {/* هدر صفحه */}
      <div className="flex justify-between items-center border-b border-gray-200 pb-4">
        <div>
          <h2 className="text-2xl font-bold text-[#003366]">Edit Company Profile</h2>
          <p className="text-sm text-[#64748B] mt-1">Modify information for #{id}</p>
        </div>
        <Link to={`/companies/details/${id}`} className="text-sm text-[#003366] hover:underline font-bold">
          Cancel & Go Back
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6 bg-white p-6 rounded-[12px] border border-[#E2E8F0] shadow-sm">
        
        {/* بخش اول: اطلاعات اصلی شرکت */}
        <div className="space-y-4">
          <h3 className="text-base font-bold text-[#003366] border-b pb-2">📋 Company Identity</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Company Name</label>
              <input type="text" name="companyName" value={formData.companyName} onChange={handleChange} required className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Registration Number</label>
              <input type="text" name="registrationNumber" value={formData.registrationNumber} onChange={handleChange} required className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Company Type</label>
              <select name="companyType" value={formData.companyType} onChange={handleChange} className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]">
                <option value="private">Private</option>
                <option value="public">Public</option>
                <option value="llc">LLC</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Industry</label>
              <input type="text" name="industry" value={formData.industry} onChange={handleChange} required className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" />
            </div>
          </div>
        </div>

        {/* بخش دوم: اطلاعات تماس */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-[#003366] border-b pb-2">📞 Communications</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Phone Number</label>
              <input type="text" name="phone" value={formData.phone} onChange={handleChange} required className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Official Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Website URL</label>
              <input type="url" name="website" value={formData.website} onChange={handleChange} className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" />
            </div>
          </div>
        </div>

        {/* بخش سوم: آدرس فیزیکی */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-[#003366] border-b pb-2">📍 Address Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Province</label>
              <input type="text" name="province" value={formData.province} onChange={handleChange} required className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">District</label>
              <input type="text" name="district" value={formData.district} onChange={handleChange} required className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" />
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">City</label>
              <input type="text" name="city" value={formData.city} onChange={handleChange} required className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]" />
            </div>
            <div className="md:col-span-3">
              <label className="block text-xs font-bold text-gray-700 mb-1">Full Physical Address</label>
              <textarea name="fullAddress" value={formData.fullAddress} onChange={handleChange} required rows="2" className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]"></textarea>
            </div>
          </div>
        </div>

        {/* بخش چهارم: مشخصات نماینده/مسئول */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-[#003366] border-b pb-2">👥 Primary Representative</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Representative Name</label>
              <input
                type="text"
                name="repName"
                value={formData.repName}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Position
              </label>
              <input
                type="text"
                name="repPosition"
                value={formData.repPosition}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Phone Number
              </label>
              <input
                type="text"
                name="repPhone"
                value={formData.repPhone}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                name="repEmail"
                value={formData.repEmail}
                onChange={handleChange}
                required
                className="w-full p-2 border rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]"
              />
            </div>
          </div>
        </div>

        {/* بخش پنجم: وضعیت شرکت */}
        <div className="space-y-4 pt-4">
          <h3 className="text-base font-bold text-[#003366] border-b pb-2">
            ⚙️ Company Status
          </h3>

          <div className="flex items-center justify-between border border-[#E2E8F0] rounded-[8px] p-4">
            <div>
              <p className="text-sm font-bold text-gray-700">
                Active Company
              </p>

              <p className="text-xs text-gray-500 mt-1">
                Enable or disable this company profile.
              </p>
            </div>

            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                name="status"
                checked={formData.status}
                onChange={handleChange}
                className="sr-only peer"
              />

              <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-[#003366] after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
            </label>
          </div>
        </div>

        {/* دکمه‌های فرم */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 pt-6 border-t border-[#E2E8F0]">

          <Link
            to={`/companies/details/${id}`}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-[8px] text-center transition"
          >
            Cancel
          </Link>

          <button
            type="submit"
            className="px-6 py-2.5 text-sm font-bold text-white bg-[#003366] hover:bg-[#00264D] rounded-[8px] transition shadow-sm"
          >
            Save Changes
          </button>

        </div>

      </form>
    </div>
  );
}

export default EditCompany;