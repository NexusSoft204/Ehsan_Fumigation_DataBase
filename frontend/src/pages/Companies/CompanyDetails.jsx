import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function CompanyDetails() {
  const { id } = useParams(); // دریافت ID شرکت از پارامترهای آدرس URL
  const navigate = useNavigate();
  const [company, setCompany] = useState(null);
  const [loading, setLoading] = useState(true);

  // آدرس پایه API هماهنگ با سیستم Vite
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  useEffect(() => {
    const fetchCompanyDetails = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/companies/${id}/`);
        setCompany(response.data);
      } catch (error) {
        console.error('Error fetching company details:', error);
        alert('Company details not found or server error occurred.');
        navigate('/companies'); // بازگشت به لیست در صورت بروز خطا
      } finally {
        setLoading(false);
      }
    };

    fetchCompanyDetails();
  }, [id, navigate, API_URL]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64 font-bold text-[#003366]">
        Loading details...
      </div>
    );
  }

  if (!company) return null;

  return (
    <div className="space-y-6 font-interBold bg-[#F8FAFC] p-2">
      
      {/* هدر صفحه و دکمه بازگشت / ویرایش */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold text-[#003366]">{company.company_name}</h2>
            <span className={`px-2.5 py-0.5 rounded-[999px] text-xs font-bold ${
              company.status 
                ? 'bg-green-50 text-green-700 border border-green-200' 
                : 'bg-red-50 text-red-700 border border-red-200'
            }`}>
              {company.status ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-sm text-[#64748B] mt-1">ID: #{company.id} • Registered Profile Details</p>
        </div>
        
        <div className="flex gap-3 self-start sm:self-auto">
          <Link 
            to="/companies" 
            className="border border-[#E2E8F0] bg-white hover:bg-slate-50 text-[#0f172a] px-4 py-2 rounded-[8px] font-bold text-sm shadow-sm transition-all"
          >
            ← Back to List
          </Link>
          <Link 
            to={`/companies/edit/${company.id}`} 
            className="bg-[#003366] hover:bg-[#002244] text-white px-4 py-2 rounded-[8px] font-bold text-sm shadow-sm transition-all"
          >
            Edit Profile
          </Link>
        </div>
      </div>

      {/* شبکه کارت‌های اطلاعاتی شرکت */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* کارت اول: اطلاعات ثبتی و هویتی شرکت */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#003366] border-b border-slate-100 pb-2">📋 Company Identity</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-[#64748B]">Registration Number</p>
              <p className="font-bold text-[#0F172A] mt-0.5">{company.registration_number}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Company Type</p>
              <p className="font-bold text-[#0F172A] mt-0.5 uppercase">{company.company_type}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-[#64748B]">Industry Field</p>
              <p className="font-bold text-[#0F172A] mt-0.5">{company.industry}</p>
            </div>
          </div>
        </div>

        {/* کارت دوم: اطلاعات تماس و کانال‌های ارتباطی */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm space-y-4">
          <h3 className="text-base font-bold text-[#003366] border-b border-slate-100 pb-2">📞 Communication</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs text-[#64748B]">Phone Number</p>
              <p className="font-bold text-[#0F172A] mt-0.5" dir="ltr">{company.phone_number}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">Official Email</p>
              <p className="font-bold text-[#0F172A] mt-0.5">{company.email}</p>
            </div>
            <div className="col-span-2">
              <p className="text-xs text-[#64748B]">Website Link</p>
              {company.website ? (
                <a href={company.website} target="_blank" rel="noreferrer" className="text-[#00C8FF] hover:underline font-bold mt-0.5 block">
                  {company.website}
                </a>
              ) : (
                <p className="text-gray-400 mt-0.5">Not Provided</p>
              )}
            </div>
          </div>
        </div>

        {/* کارت سوم: اطلاعات آدرس فیزیکی و موقعیت جغرافیایی */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm space-y-4 md:col-span-2">
          <h3 className="text-base font-bold text-[#003366] border-b border-slate-100 pb-2">📍 Location & Address</h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs text-[#64748B]">Province</p>
              <p className="font-bold text-[#0F172A] mt-0.5">{company.province}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">District</p>
              <p className="font-bold text-[#0F172A] mt-0.5">{company.district}</p>
            </div>
            <div>
              <p className="text-xs text-[#64748B]">City</p>
              <p className="font-bold text-[#0F172A] mt-0.5">{company.city}</p>
            </div>
            <div className="sm:col-span-3 bg-[#F8FAFC] p-3 rounded-[8px] border border-slate-100">
              <p className="text-xs text-[#64748B]">Full Address Specifications</p>
              <p className="font-medium text-[#0F172A] mt-1">{company.full_address}</p>
            </div>
          </div>
        </div>

        {/* کارت چهارم: بخش چند مسئولی / نمایندگان شرکت (Representatives) */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm space-y-4 md:col-span-2">
          <h3 className="text-base font-bold text-[#003366] border-b border-slate-100 pb-2">👥 Company Representatives</h3>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                  <th className="py-2.5 px-3 font-bold text-[#64748B]">Full Name</th>
                  <th className="py-2.5 px-3 font-bold text-[#64748B]">Position / Role</th>
                  <th className="py-2.5 px-3 font-bold text-[#64748B]">Phone</th>
                  <th className="py-2.5 px-3 font-bold text-[#64748B]">Email Address</th>
                </tr>
              </thead>
              <tbody>
                {company.representatives && company.representatives.map((rep, index) => (
                  <tr key={rep.id || index} className="border-b border-[#E2E8F0] hover:bg-slate-50/50">
                    <td className="py-3 px-3 font-bold text-[#0F172A]">{rep.name}</td>
                    <td className="py-3 px-3 font-medium text-[#64748B]">{rep.position}</td>
                    <td className="py-3 px-3 font-bold text-[#003366]" dir="ltr">{rep.phone}</td>
                    <td className="py-3 px-3 text-[#0F172A]">{rep.email}</td>
                  </tr>
                ))}
                {(!company.representatives || company.representatives.length === 0) && (
                  <tr>
                    <td colSpan="4" className="py-4 text-center text-gray-400">
                      No representatives registered for this company.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}

export default CompanyDetails;
