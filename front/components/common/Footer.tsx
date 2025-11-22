"use client"

import React, { useState } from "react";
import { Mail, Phone, MapPin, Instagram, Twitter, Facebook } from "lucide-react"; // lucide-react available per canvas rules

type FooterProps = {
  companyName?: string;
  description?: string;
  copyrightYear?: number;
};

const Footer: React.FC<FooterProps> = ({
  companyName = "فروشگاه محلی",
  description = "میوه و سبزی تازه، مستقیم از باغ به درِ خانه‌ی شما — کیفیت، تازگی و مشتری مداری.",
  copyrightYear = new Date().getFullYear(),
}) => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<null | "idle" | "loading" | "success" | "error">(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const subscribe = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setErrorMsg(null);

    // ساده‌ترین اعتبارسنجی
    if (!email.trim()) {
      setErrorMsg("ایمیل خود را وارد کنید.");
      setStatus("error");
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrorMsg("ایمیل معتبر نیست.");
      setStatus("error");
      return;
    }

    // شبیه‌سازی ارسال به سرور — در عمل به API خودتون تغییر بدید
    try {
      setStatus("loading");
      await new Promise((res) => setTimeout(res, 800)); // شبیه‌سازی
      setStatus("success");
      setEmail("");
      // اینجا می‌تونید درخواست fetch/axios واقعی بفرستید
    } catch {
      setStatus("error");
      setErrorMsg("خطا در اتصال. دوباره تلاش کنید.");
    }
  };

  const quickLinks = [
    { label: "خانه", href: "/" },
    { label: "محصولات", href: "/products" },
    { label: "درباره ما", href: "/about" },
    { label: "تماس با ما", href: "/contact" },
  ];

  const supportLinks = [
    { label: "حمل و نقل", href: "/shipping" },
    { label: "سیاست بازگشت", href: "/returns" },
    { label: "سؤالات متداول", href: "/faq" },
    { label: "حریم خصوصی", href: "/privacy" },
  ];

  return (
    <footer className="bg-transparent text-gray-200  ">
      <div className="container mx-auto px-4 py-10">
        {/* اصلی: گرید واکنش‌گرا */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-start">
          {/* لوگو و توضیح */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center text-white font-extrabold text-lg">
                {companyName.charAt(0)}
              </div>
              <div className="text-right">
                <div className="font-bold text-lg">{companyName}</div>
                <div className="text-sm text-gray-500">تازگی که قابل اعتماد است</div>
              </div>
            </div>

            <p className="text-sm text-gray-600 leading-relaxed text-right">
              {description}
            </p>

            <div className="flex gap-3 rtl:ml-0 rtl:mr-auto">
              <a
                href="#"
                aria-label="instagram"
                className="w-9 h-9 rounded-md flex items-center justify-center bg-gray-400 hover:bg-gray-200 transition"
              >
                <Instagram size={16} />
              </a>
              <a
                href="#"
                aria-label="twitter"
                className="w-9 h-9 rounded-md flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
              >
                <Twitter size={16} />
              </a>
              <a
                href="#"
                aria-label="facebook"
                className="w-9 h-9 rounded-md flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition"
              >
                <Facebook size={16} />
              </a>
            </div>
          </div>

          {/* لینک‌ها */}
          <div className="grid grid-cols-2 gap-6 text-right">
            <div>
              <h4 className="font-semibold mb-3">لینک‌های سریع</h4>
              <ul className="space-y-2 text-sm">
                {quickLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-gray-600 hover:text-gray-900 transition"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-3">پشتیبانی</h4>
              <ul className="space-y-2 text-sm">
                {supportLinks.map((l) => (
                  <li key={l.href}>
                    <a
                      href={l.href}
                      className="text-gray-600 hover:text-gray-900 transition"
                    >
                      {l.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* تماس و خبرنامه */}
          <div className="text-right space-y-4">
            <h4 className="font-semibold">تماس</h4>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-gray-100">
                <Phone size={16} />
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-medium">تلفن</div>
                <div className="mt-1">021-12345678</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="p-2 rounded-md bg-gray-100">
                <MapPin size={16} />
              </div>
              <div className="text-sm text-gray-600">
                <div className="font-medium">آدرس</div>
                <div className="mt-1">تهران، خیابان مثال، پلاک ۱۲</div>
              </div>
            </div>

            <form onSubmit={subscribe} className="mt-2">
              <label htmlFor="newsletter" className="text-sm font-medium block mb-2">
                دریافت تخفیف‌ها و تازه‌ها
              </label>

              <div className="flex gap-2">
                <input
                  id="newsletter"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ایمیل خود را وارد کنید"
                  className="flex-1 px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-green-200"
                  aria-label="ایمیل برای خبرنامه"
                />
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 rounded-lg font-medium disabled:opacity-60"
                  disabled={status === "loading"}
                >
                  {status === "loading" ? "در حال ارسال..." : "عضویت"}
                </button>
              </div>

              {status === "success" && (
                <p className="text-sm text-green-600 mt-2">عضویت با موفقیت انجام شد ✅</p>
              )}
              {status === "error" && errorMsg && (
                <p className="text-sm text-red-600 mt-2">{errorMsg}</p>
              )}
            </form>
          </div>
        </div>

        {/* خط و کپی‌رایت */}
        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-gray-500 text-right">
            © {copyrightYear} {companyName} — تمامی حقوق محفوظ است.
          </p>

          <div className="text-sm text-gray-500 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Mail size={14} />
              <span>info@yourstore.com</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={14} />
              <span>پشتیبانی: سرویس 24 ساعته</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
