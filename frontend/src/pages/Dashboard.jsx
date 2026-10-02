import React, { useState } from 'react';

function Dashboard() {
  const [timeFilter, setTimeFilter] = useState('Monthly');

  // داده‌های فرضی برای نمودار میله‌ای
  const chartData = [
    { month: 'Jan', value: 200, height: '40%' },
    { month: 'Feb', value: 350, height: '70%' },
    { month: 'Mar', value: 250, height: '50%' },
    { month: 'Apr', value: 450, height: '90%' },
    { month: 'May', value: 300, height: '60%' },
    { month: 'Jun', value: 500, height: '100%' },
  ];

  return (
    <div className="space-y-6 font-interBold bg-[#F8FAFC]">
      
      {/* هدر بالا شامل سرچ، تاریخ و اطلاعات ادمین */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 bg-white p-4 rounded-[12px] border border-[#E2E8F0] shadow-sm">
        <div>
          <h2 className="text-2xl font-bold text-[#003366]">Dashboard</h2>
          <p className="text-sm text-[#64748B] mt-1">Welcome back, Admin • Monday, August 31, 2026</p>
        </div>
        
        {/* باکس سرچ و پروفایل راست هدر */}
        <div className="flex items-center gap-4 self-end md:self-auto w-full md:w-auto">
          <div className="relative flex-1 md:w-64">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full pl-10 pr-4 py-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-sm focus:outline-none focus:border-[#00C8FF]"
            />
            <span className="absolute left-3 top-2.5 text-slate-400 text-sm">🔍</span>
          </div>
          <button className="p-2 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] hover:bg-slate-100 relative">
            🔔
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>
          <div className="flex items-center gap-2 border-l border-[#E2E8F0] pl-4 cursor-pointer select-none">
            <div className="w-8 h-8 rounded-full bg-[#003366] text-white flex items-center justify-center font-bold text-sm">A</div>
            <span className="text-sm text-[#0F172A] hidden sm:inline">Admin ▼</span>
          </div>
        </div>
      </div>

      {/* ۱. بخش کارت‌های آماری (Statistics Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* کارت کامپانی‌ها */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <span className="text-sm text-[#64748B] font-semibold">Total Companies</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-bold text-[#003366]">1,284</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-[999px]">↑ 12.5%</span>
          </div>
        </div>

        {/* کارت گواهینامه‌ها */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <span className="text-sm text-[#64748B] font-semibold">Certificates</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-bold text-[#003366]">4,821</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-[999px]">↑ 8.4%</span>
          </div>
        </div>

        {/* کارت کارمندان */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <span className="text-sm text-[#64748B] font-semibold">Employees</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-bold text-[#003366]">86</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-[999px]">↑ 4.2%</span>
          </div>
        </div>

        {/* کارت درآمد کلی */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm">
          <span className="text-sm text-[#64748B] font-semibold">Total Income</span>
          <div className="flex justify-between items-baseline mt-2">
            <span className="text-2xl font-bold text-[#003366]">$24,850</span>
            <span className="text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-[999px]">↑ 15.3%</span>
          </div>
        </div>

      </div>

      {/* بخش میانی: آنالیز گواهینامه‌ها و اورویو مالی */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* ۲. Certificate Analytics (نمودار) */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm lg:col-span-2 flex flex-col justify-between">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-base font-bold text-[#003366]">Certificates Issued</h3>
            {/* دکمه‌های فیلتر زمان */}
            <div className="flex gap-1 bg-[#F8FAFC] p-1 border border-[#E2E8F0] rounded-[8px]">
              {['Daily', 'Monthly', 'Yearly'].map((item) => (
                <button 
                  key={item}
                  onClick={() => setTimeFilter(item)}
                  className={`text-xs px-3 py-1 rounded-[6px] font-semibold transition-all ${timeFilter === item ? 'bg-[#003366] text-white shadow-sm' : 'text-[#64748B] hover:text-[#003366]'}`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>

          {/* بدنه بصری خودکار نمودار */}
          <div className="flex items-end gap-4 h-48 border-b border-l border-[#E2E8F0] pb-2 pl-4">
            {chartData.map((data, index) => (
              <div key={index} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                {/* تولتیپ پاپ‌آپ هنگام هاور */}
                <span className="opacity-0 group-hover:opacity-100 bg-[#003366] text-white text-[10px] px-1.5 py-0.5 rounded mb-1 transition-opacity shadow-sm">
                  {data.value}
                </span>
                {/* میله‌ی اصلی چارت با تم رنگ ثانویه شما */}
                <div style={{ height: data.height }} className="w-full bg-[#00C8FF] rounded-t-[4px] hover:bg-[#003366] transition-colors duration-200"></div>
                <span className="text-xs text-[#64748B] font-medium">{data.month}</span>
              </div>
            ))}
          </div>
        </div>

        {/* ۳. Financial Overview (تراز مالی) */}
        <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-bold text-[#003366] mb-4">Financial Overview</h3>
            <div className="grid grid-cols-2 gap-4 border-b border-[#E2E8F0] pb-4">
              <div>
                <span className="text-xs text-[#64748B]">Income</span>
                <p className="text-lg font-bold text-green-600">$24,850</p>
              </div>
              <div>
                <span className="text-xs text-[#64748B]">Expenses</span>
                <p className="text-lg font-bold text-red-500">$8,420</p>
              </div>
            </div>
            <div className="pt-4">
              <span className="text-xs text-[#64748B]">Profit</span>
              <p className="text-2xl font-bold text-[#003366]">$16,430</p>
            </div>
          </div>
          
          <div className="mt-4 pt-4 border-t border-[#E2E8F0]">
            <span className="text-xs text-[#64748B] block mb-2">Income vs Expenses Progress</span>
            <div className="w-full bg-red-100 h-2.5 rounded-[999px] overflow-hidden flex">
              <div className="bg-green-500 h-full" style={{ width: '74%' }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* ۴. جدول شرکت‌های برتر (Top Certificate Companies) */}
      <div className="bg-white p-5 rounded-[12px] border border-[#E2E8F0] shadow-sm">
        <h3 className="text-base font-bold text-[#003366] mb-4">Top Certificate Companies</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#E2E8F0] bg-[#F8FAFC]">
                <th className="py-3 px-4 text-xs font-bold text-[#64748B] w-12">#</th>
                <th className="py-3 px-4 text-xs font-bold text-[#64748B]">Company</th>
                <th className="py-3 px-4 text-xs font-bold text-[#64748B] text-right">Certificates</th>
              </tr>
            </thead>
            <tbody>
              {[
                { id: 1, name: 'ABC Trading Ltd', count: 428 },
                { id: 2, name: 'Global Import Co', count: 351 },
                { id: 3, name: 'Kabul Logistics', count: 287 },
                { id: 4, name: 'Asia Trade Ltd', count: 241 }
              ].map((company) => (
                <tr key={company.id} className="border-b border-[#E2E8F0] hover:bg-slate-50 transition-colors">
                  <td className="py-3 px-4 text-sm font-semibold text-[#64748B]">{company.id}</td>
                  <td className="py-3 px-4 text-sm font-bold text-[#0F172A]">{company.name}</td>
                  <td className="py-3 px-4 text-sm font-bold text-[#003366] text-right">{company.count}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}

export default Dashboard;
