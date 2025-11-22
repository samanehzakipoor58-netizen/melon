// app/dashboard/page.tsx
"use client";

import OrdersPage from "@/components/dashboard/OrderPage";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const AdminDashboardPage = () => {
  const router = useRouter();

  // دریافت session
  const { data: sessionData, status: sessionStatus } = useSession();
  const userEmail = sessionData?.user?.email;

const { data: userData, isLoading } = useQuery({
  queryKey: ["user", userEmail],
  queryFn: async () => {
    const res = await axios.get(`http://localhost:3001/api/users/email/${userEmail}`);
    return res.data;
  },
  enabled: !!userEmail, // فقط وقتی ایمیل وجود دارد اجرا شود
});

console.log(userData)

//   // محافظت صفحه: اگر role مناسب نبود، redirect کن
//   useEffect(() => {
//     if (!isLoading && userData && userData.role !== "ADMIN") {
//       router.push("/"); // redirect به صفحه اصلی
//     }
//   }, [userData, isLoading, router]);

  // نمایش Loading تا داده‌ها آماده شوند
  if (sessionStatus === "loading" || isLoading) {
    return <p className="text-center mt-10 text-lg">در حال بارگذاری...</p>;
  }

  // اگر هنوز userData نداریم یا کاربر admin نیست، چیزی render نکن
//   if (!userData || userData.role !== "ADMIN") return null;

  // صفحه اصلی داشبورد admin
  return (
    <div className="p-6">
    {userData && <OrdersPage userData={userData} />}
    </div>
  );
};

export default AdminDashboardPage;

