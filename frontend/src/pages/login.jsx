import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const loginData = {
      username: identifier,
      password: password,
    };

    fetch("http://127.0.0.1:8000/api/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", 
      },
      body: JSON.stringify(loginData),
    })
      .then((response) => {
        if (response.ok) {
          return response.json().then((data) => {
            const token = data.token || data.access;

            if (token) {
              document.cookie = `token=${token}; path=/; max-age=${7 * 24 * 60 * 60}; SameSite=Lax; Secure`;
            }

            navigate("/Dashboard");
          });
        } else {
          return response.json().then((errData) => {
            alert(errData.detail || "نام کاربری یا رمز عبور اشتباه است.");
          });
        }
      })
      .catch((error) => {
        console.error("خطا در ارتباط با سرور:", error);
      });
  };

  return (
    <div className="min-h-screen  bg-[#F8FAFC] flex flex-col justify-center items-center p-4 font-interBold">
      {/* کارت اصلی لاگین */}
      <div className="w-full max-w-md bg-white border border-[#E2E8F0] rounded-[12px] p-8 shadow-sm">
        {/* بخش لوگو شرکت */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-[#003366] rounded-full flex items-center justify-center text-white text-2xl font-bold mb-3 shadow-inner">
            ES
          </div>
          <h2 className="text-xl font-bold text-[#003366] text-center">
            Ehsan Saboor Management
          </h2>
          <p className="text-sm text-[#64748B] mt-1">Sign in to your account</p>
        </div>

        {/* فرم لاگین */}
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* فیلد ایمیل / نام کاربری */}
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
              Email / Username
            </label>
            <input
              type="text"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              required
              name="username"
              className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#00C8FF] focus:ring-1 focus:ring-[#00C8FF] transition-all text-left"
              placeholder="Enter your username"
            />
          </div>

          {/* فیلد رمز عبور */}
          <div>
            <label className="block text-sm font-semibold text-[#0F172A] mb-1.5">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                name="password"
                className="w-full px-4 py-2.5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-[8px] text-[#0F172A] placeholder-[#64748B] focus:outline-none focus:border-[#00C8FF] focus:ring-1 focus:ring-[#00C8FF] transition-all text-left pr-10"
                placeholder="Enter your password"
              />
              {/* آیکون چشم برای نمایش/پنهان‌سازی پسورد */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-xl cursor-pointer select-none"
              >
                {showPassword ? "👁️" : "👁️‍🗨️"}
              </button>
            </div>
          </div>

          {/* بخش مرا به خاطر بسپار و فراموشی رمز عبور */}
          <div className="flex justify-between items-center text-sm">
            <label className="flex items-center gap-2 cursor-pointer select-none text-[#0F172A]">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-[#E2E8F0] text-[#003366] focus:ring-[#00C8FF]"
              />
              <span>Remember me</span>
            </label>
            <a
              href="#forgot"
              className="text-sm font-semibold text-[#003366] hover:text-[#00C8FF] transition-colors"
            >
              Forgot password?
            </a>
          </div>

          {/* دکمه ورود (Sign In) */}
          <button
            type="submit"
            className="w-full bg-[#003366] hover:bg-[#002244] text-white py-3 rounded-[8px] font-bold shadow-md hover:shadow-lg transition-all"
          >
            Sign In
          </button>
        </form>

        {/* پانویس امنیتی کارخانه */}
        <div className="mt-8 pt-4 border-t border-[#E2E8F0] text-center text-xs text-[#64748B] tracking-wide uppercase">
          🛡️ Secure Business System
        </div>
      </div>
    </div>
  );
}

export default Login;
