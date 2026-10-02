import React, { useState } from 'react';
import { Link, Outlet } from 'react-router-dom';

// کامپوننت کمکی برای منوهای دراپ‌داون دار و ساده
function SidebarItem({ title, to, children }) {
  const [isOpen, setIsOpen] = useState(false);
  const hasSubmenu = Boolean(children);

  if (!hasSubmenu) {
    return (
      <li>
        <Link to={to} className="block px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-interBold">
          {title}
        </Link>
      </li>
    );
  }

  return (
    <li>
      <button 
        onClick={() => setIsOpen(!isOpen)} 
        className="w-full flex justify-between items-center px-4 py-2.5 rounded-lg text-slate-300 hover:bg-slate-800 hover:text-white transition-all font-interBold text-right"
      >
        <span>{title}</span>
        <span className={`text-xs transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}>▼</span>
      </button>
      
      {/* انیمیشن باز و بسته شدن زیرمنو */}
      <div className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[400px] opacity-100 mt-1' : 'max-h-0 opacity-0'}`}>
        <ul className="pr-4 border-r border-slate-700 flex flex-col gap-1 mr-2">
          {children}
        </ul>
      </div>
    </li>
  );
}

function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    // رنگ پس‌زمینه کل سایت بر اساس --color-Background شما (#F8FAFC) تنظیم شده است
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-interBold text-[#0F172A]">
      
      {/* هدر سایت با رنگ پرایمری شما (#003366) */}
      <header className="bg-[#003366] text-white px-6 py-4 flex justify-between items-center shadow-md sticky top-0 z-50">
        <div className="flex items-center gap-4">
          {/* دکمه منوی همبرگری برای موبایل */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
            className="lg:hidden text-2xl focus:outline-none"
          >
            ☰
          </button>
          <h1 className="text-lg md:text-xl font-bold tracking-wide">Ehsan Saboor Management System</h1>
        </div>
        
        {/* بخش پروفایل و اعلان با افکت هاور رنگ سکندری (#00C8FF) */}
        <div className="text-xl flex items-center cursor-pointer gap-4">
          <span className="hover:text-[#00C8FF] transition-colors relative">
            🔔
            <span className="absolute -top-1 -right-1 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
          </span>
          <div className="flex items-center gap-2 border-r border-slate-500 pr-4">
            <span className="hover:text-[#00C8FF] transition-colors">👤</span>
          </div>
        </div>
      </header>

      {/* بخش بدنه اصلی (سایدبار + محتوا) */}
      <main className="flex flex-1 relative">
        
        {/* سایدبار ثابت دسکتاپ و کشویی موبایل */}
        <aside className={`
          fixed lg:sticky h-screen top-[64px] right-0 bottom-0 z-40
          w-64 bg-[#001f3f] text-white p-4 flex flex-col justify-between
          transform transition-transform duration-300 ease-in-out shadow-xl lg:shadow-none
          ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}>
          {/* لیست منوها با ساختار دراپ‌داون درخواستی شما */}
          <div className="overflow-y-auto max-h-[calc(100vh-160px)] pr-1">
            <ul className="flex flex-col gap-1.5">
              <SidebarItem title="Dashboard" to="/Dashboard" />

              {/* منوی Companies */}
              <SidebarItem title="Companies">
                <Link to="/companies" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">All Companies</Link>
                <Link to="/companies/add" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Add Company</Link>
                {/* <Link to="/companies/details" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Company Details</Link> */}
              </SidebarItem>

              {/* منوی Certificates */}
              <SidebarItem title="Certificates">
                <Link to="/certificates" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">All Certificates</Link>
                <Link to="/certificates/issue" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Issue Certificate</Link>
                <Link to="/certificates/details" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Certificate Details</Link>
                <Link to="/certificates/verify" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Verify Certificate</Link>
              </SidebarItem>

              {/* منوی Employees */}
              <SidebarItem title="Employees">
                <Link to="/employees" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">All Employees</Link>
                <Link to="/employees/add" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Add Employee</Link>
                <Link to="/employees/profile" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Employee Profile</Link>
                <Link to="/employees/attendance" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Attendance</Link>
                <Link to="/employees/evaluations" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Evaluations</Link>
                <Link to="/employees/salaries" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Salaries</Link>
                <Link to="/employees/promotions" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Promotions</Link>
                <Link to="/employees/id-cards" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">ID Cards</Link>
              </SidebarItem>

              {/* منوی Vehicles */}
              <SidebarItem title="Vehicles">
                <Link to="/vehicles" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">All Vehicles</Link>
                <Link to="/vehicles/add" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Add Vehicle</Link>
                <Link to="/vehicles/details" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Vehicle Details</Link>
              </SidebarItem>

              {/* منوی Finance */}
              <SidebarItem title="Finance">
                <Link to="/finance/income" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Income</Link>
                <Link to="/finance/expenses" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Expenses</Link>
                <Link to="/finance/overview" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Financial Overview</Link>
              </SidebarItem>

              {/* منوی Reports */}
              <SidebarItem title="Reports">
                <Link to="/reports/company" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Company Reports</Link>
                <Link to="/reports/certificate" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Certificate Reports</Link>
                <Link to="/reports/employee" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Employee Reports</Link>
                <Link to="/reports/attendance" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Attendance Reports</Link>
                <Link to="/reports/vehicle" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Vehicle Reports</Link>
                <Link to="/reports/income" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Income Reports</Link>
                <Link to="/reports/expense" className="block px-3 py-1.5 text-sm text-slate-400 hover:text-[#00C8FF]">Expense Reports</Link>
              </SidebarItem>

              <SidebarItem title="Users" to="/users" />
              <SidebarItem title="Settings" to="/settings" />
            </ul>
          </div>

          {/* ادمین پروفایل در پایین سایدبار */}
          <div className="pt-4 border-t border-slate-700 flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#00C8FF] flex items-center justify-center font-bold text-[#003366]">A</div>
            <span className="text-sm text-slate-300 font-medium">Admin Profile</span>
          </div>
        </aside>

        {/* لایه تیره پس‌زمینه هنگام باز شدن منو در موبایل */}
        {isMobileMenuOpen && (
          <div 
            onClick={() => setIsMobileMenuOpen(false)} 
            className="fixed inset-0 bg-black bg-opacity-40 z-30 lg:hidden"
          ></div>
        )}
        
        {/* محتوای صفحات با استایل کارتی سفید رنگ بر اساس --color-Surface شما */}
        <section className="flex-1 p-4 md:p-6 min-h-[85vh]">
          <div className="bg-white p-6 rounded-[12px] shadow-sm border border-[#E2E8F0] min-h-full">
            <Outlet /> 
          </div>
        </section>
      </main>

      {/* فوتر مینیمال و شیک سایت */}
      <footer className="bg-white border-t border-[#E2E8F0] py-4 text-center text-sm text-[#64748B]">
        <p>Developed by: <span className="font-bold text-[#003366]" title='0785788463'>NexusSoft Company</span></p>
      </footer>
    </div>
  );
}

export default Layout;
