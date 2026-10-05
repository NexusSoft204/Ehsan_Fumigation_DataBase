import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

// ۱. وارد کردن لایوت اصلی
import Layout from './Layout';

// ۲. وارد کردن کامپوننت‌های داشبورد، کاربران و تنظیمات
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Settings from './pages/Settings';

// ۳. وارد کردن صفحات مربوط به بخش Companies
import AllCompanies from './pages/Companies/AllCompanies';
import AddCompany from './pages/Companies/AddCompany';
import CompanyDetails from './pages/Companies/CompanyDetails';
import EditCompany from './pages/Companies/edit';

// ۴. وارد کردن صفحات مربوط به بخش Certificates
import AllCertificates from './pages/Certificates/AllCertificates';
import IssueCertificate from './pages/Certificates/IssueCertificate';
import CertificateDetails from './pages/Certificates/CertificateDetails';
import VerifyCertificate from './pages/Certificates/VerifyCertificate';



// OfficialLetter بخش صفحه مکتوب ها
import OfficialLetter from './pages/OfficialLetter/officialLetter';
import LetterForm from './pages/OfficialLetter/LetterForm';
import Verify_offical_letter from './pages/OfficialLetter/verify-offical-letter';
import AllofficalLetter from './pages/OfficialLetter/allofficalLetter';



// ۵. وارد کردن صفحات مربوط به بخش Employees
import AllEmployees from './pages/Employees/AllEmployees';
import AddEmployee from './pages/Employees/AddEmployee';
import EmployeeProfile from './pages/Employees/EmployeeProfile';
import Attendance from './pages/Employees/Attendance';
import Evaluations from './pages/Employees/Evaluations';
import Salaries from './pages/Employees/Salaries';
import Promotions from './pages/Employees/Promotions';
import IDCards from './pages/Employees/IDCards';

// ۶. وارد کردن صفحات مربوط به بخش Vehicles
import AllVehicles from './pages/Vehicles/AllVehicles';
import AddVehicle from './pages/Vehicles/AddVehicle';
import VehicleDetails from './pages/Vehicles/VehicleDetails';

// ۷. وارد کردن صفحات مربوط به بخش Finance
import Income from './pages/Finance/Income';
import Expenses from './pages/Finance/Expenses';
import FinancialOverview from './pages/Finance/FinancialOverview';

// ۸. وارد کردن صفحات مربوط به بخش Reports
import CompanyReports from './pages/Reports/CompanyReports';
import CertificateReports from './pages/Reports/CertificateReports';
import EmployeeReports from './pages/Reports/EmployeeReports';
import AttendanceReports from './pages/Reports/AttendanceReports';
import VehicleReports from './pages/Reports/VehicleReports';
import IncomeReports from './pages/Reports/IncomeReports';
import ExpenseReports from './pages/Reports/ExpenseReports';
import Login from './pages/login';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* اعمال لایوت روی تمام صفحات زیرمجموعه */}
        {/* Main page */}
          <Route path="/" element={<Login />} />
          <Route path="/certificates/verify/:id" element={<VerifyCertificate />} />
          <Route path='/OfficialLetter/verify/:tracking_id' element={<Verify_offical_letter />} />
        <Route element={<Layout />}>
          
          {/* مسیر صفحه اصلی */}
          <Route path="/Dashboard" element={<Dashboard />} />

          {/* مسیرهای بخش Companies */}
          <Route path="/companies" element={<AllCompanies />} />
          <Route path="/companies/add" element={<AddCompany />} />
          <Route path="/companies/details/:id" element={<CompanyDetails />} />
          <Route path="/companies/edit/:id" element={<EditCompany />} />

          {/* مسیرهای بخش Certificates */}
          <Route path="/certificates" element={<AllCertificates />} />
          <Route path="/certificates/issue" element={<IssueCertificate />} />
          <Route path="/certificates/details/:id" element={<CertificateDetails />} />

          {/* بخش مکتوب ها */}
          <Route path='/official-letter/:tracking_id' element={<OfficialLetter />} />
          <Route path='/OfficialLetter/letterform' element={<LetterForm />} />
          <Route path='/OfficialLetter/all-official-letter' element={<AllofficalLetter />} />


          {/* مسیرهای بخش Employees */}
          <Route path="/employees" element={<AllEmployees />} />
          <Route path="/employees/add" element={<AddEmployee />} />
          <Route path="/employees/profile" element={<EmployeeProfile />} />
          <Route path="/employees/attendance" element={<Attendance />} />
          <Route path="/employees/evaluations" element={<Evaluations />} />
          <Route path="/employees/salaries" element={<Salaries />} />
          <Route path="/employees/promotions" element={<Promotions />} />
          <Route path="/employees/id-cards" element={<IDCards />} />

          {/* مسیرهای بخش Vehicles */}
          <Route path="/vehicles" element={<AllVehicles />} />
          <Route path="/vehicles/add" element={<AddVehicle />} />
          <Route path="/vehicles/details" element={<VehicleDetails />} />

          {/* مسیرهای بخش Finance */}
          <Route path="/finance/income" element={<Income />} />
          <Route path="/finance/expenses" element={<Expenses />} />
          <Route path="/finance/overview" element={<FinancialOverview />} />

          {/* مسیرهای بخش Reports */}
          <Route path="/reports/company" element={<CompanyReports />} />
          <Route path="/reports/certificate" element={<CertificateReports />} />
          <Route path="/reports/employee" element={<EmployeeReports />} />
          <Route path="/reports/attendance" element={<AttendanceReports />} />
          <Route path="/reports/vehicle" element={<VehicleReports />} />
          <Route path="/reports/income" element={<IncomeReports />} />
          <Route path="/reports/expense" element={<ExpenseReports />} />

          {/* سایر مسیرها */}
          <Route path="/users" element={<Users />} />
          <Route path="/settings" element={<Settings />} />

          {/* صفحه ۴۰۴ برای آدرس‌های اشتباه */}
          <Route path="*" element={<div className="text-center py-10 font-bold text-red-500">Page Not Found (404)</div>} />

        </Route> 
      </Routes>
    </BrowserRouter>
  );
}

export default App;
