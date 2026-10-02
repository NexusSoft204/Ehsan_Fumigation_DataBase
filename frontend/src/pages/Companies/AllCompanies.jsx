import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios'; // استفاده از اکسیس برای یکپارچگی پروژه

function AllCompanies() {
  const [companies, setCompanies] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState(''); // فیلتر وضعیت

  
  const API_URL = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

  // ۱. گرفتن لیست شرکت‌ها از بک‌آند در هنگام لود صفحه
  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/companies/`);
      setCompanies(response.data);
    } catch (error) {
      console.error('Error fetching companies:', error);
      alert('Failed to load companies from server.');
    }
  };

  // ۲. تابع حذف واقعی شرکت از دیتابیس بک‌آند (Delete)
  const handleDelete = async (id) => {
    if (window.confirm(`Are you sure you want to delete company ID: ${id}?`)) {
      try {
        const response = await axios.delete(`${API_URL}/api/companies/${id}/`);
        if (response.status === 200 || response.status === 204) {
          // حذف محلی از روی استیت پس از حذف موفق در سرور
          setCompanies(companies.filter(company => company.id !== id));
          alert('Company deleted successfully.');
        }
      } catch (error) {
        console.error('Error deleting company:', error);
        alert('Failed to delete company from server.');
      }
    }
  };

  // ۳. فیلتر کردن و جستجوی هوشمند داده‌ها در فرانت‌اند
  const filteredCompanies = companies.filter((company) => {
    const matchesSearch = company.company_name?.toLowerCase().includes(searchQuery.toLowerCase());
    
    // تبدیل مقدار بولین دیتابیس (true/false) به استرینگ فیلتر (active/inactive)
    const companyStatus = company.status ? 'active' : 'inactive';
    const matchesStatus = statusFilter === '' || companyStatus === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 font-interBold bg-[#F8FAFC]">
      
      {/* هدر صفحه و دکمه افزودن */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-[#003366]">Companies</h2>
          <p className="text-sm text-[#64748B] mt-1">Manage all registered companies</p>
        </div>
        
        <Link 
          to="/companies/add" 
          className="bg-[#003366] hover:bg-[#002244] text-white px-4 py-2.5 rounded-[8px] font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center gap-2 self-start sm:self-auto"
        >
          <span>+</span> Add Company
        </Link>
      </div>

      {/* بخش فیلترها و نوار جستجو */}
      <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-4 rounded-[12px] border border-[#E2E8F0] shadow-sm">
        {/* باکس سرچ */}
        <div className="relative w-full md:w-80">
          <input 
            type="text" 
            placeholder="Search companies..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]"
          />
          <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
        </div>

        {/* دکمه‌های فیلتر وضعیت */}
        <div className="flex gap-3 w-full md:w-auto justify-end">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm text-[#0F172A] focus:outline-none focus:border-[#00C8FF] cursor-pointer"
          >
            <option value="">All Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* جدول نمایش اطلاعات شرکت‌ها */}
      <div className="bg-white rounded-[12px] border border-[#E2E8F0] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B] w-16">ID</th>
                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B]">Company Name</th>
                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B]">Type</th>
                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B]">City</th>
                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B]">Status</th>
                <th className="py-3.5 px-4 text-xs font-bold text-[#64748B] text-center w-64">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredCompanies.map((company) => (
                <tr key={company.id} className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
                  <td className="py-4 px-4 text-sm font-semibold text-[#64748B]">{company.id}</td>
                  <td className="py-4 px-4 text-sm font-bold text-[#0F172A]">{company.company_name}</td>
                  <td className="py-4 px-4 text-sm text-[#0F172A] font-medium uppercase">{company.company_type}</td>
                  <td className="py-4 px-4 text-sm font-bold text-[#003366]">{company.city}</td>
                  <td className="py-4 px-4 text-sm">
                    {/* بج وضعیت بر اساس مقدار Boolean فرستاده شده از جنگو */}
                    <span className={`px-2.5 py-1 rounded-[999px] text-xs font-bold ${
                      company.status 
                        ? 'bg-green-50 text-green-700 border border-green-200' 
                        : 'bg-red-50 text-red-700 border border-red-200'
                    }`}>
                      {company.status ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  {/* دکمه‌های عملیاتی (Actions) */}
                  <td className="py-4 px-4 text-sm text-center">
                    <div className="flex justify-center items-center gap-2">
                      <Link to={`/companies/details/${company.id}`} className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-[#003366] px-2.5 py-1.5 rounded-[6px] hover:bg-[#003366] hover:text-white transition-all">
                        View
                      </Link>
                      <Link to={`/companies/edit/${company.id}`} className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-amber-600 px-2.5 py-1.5 rounded-[6px] hover:bg-amber-500 hover:text-white transition-all">
                        Edit
                      </Link>
                      <button 
                        onClick={() => handleDelete(company.id)}
                        className="text-xs bg-[#F8FAFC] border border-[#E2E8F0] text-red-600 px-2.5 py-1.5 rounded-[6px] hover:bg-red-600 hover:text-white transition-all"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredCompanies.length === 0 && (
                <tr>
                  <td colSpan="6" className="py-8 text-center text-sm text-gray-500">
                    No companies found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default AllCompanies;
