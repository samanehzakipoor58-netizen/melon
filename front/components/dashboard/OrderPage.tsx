"use client";

import { Pagination } from "@heroui/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Image from "next/image";
import { useState } from "react";

const ItemsPerPage = 6;

const dateFilters = [
  { key: "all", label: "همه سفارش‌ها" },
  { key: "3hours", label: "۳ ساعت گذشته" },
  { key: "3days", label: "۳ روز گذشته" },
  { key: "week", label: "هفته گذشته" },
  { key: "month", label: "ماه گذشته" },
];

const statusLabels: Record<string, string> = {
  pending: "در انتظار",
  processing: "در حال پردازش",
  completed: "تکمیل شده",
  canceled: "لغو شده",
};

export default function OrdersPage({ userData }: any) {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [filter, setFilter] = useState("all");

  // گرفتن سفارش‌ها با فیلتر تاریخ و نقش کاربر
  const { data: orders = [], isLoading } = useQuery({
    queryKey: ["orders", filter, userData?.email, userData?.role],
    queryFn: () => {
      if (userData.role === "ADMIN") {
        return axios
          .get("http://localhost:3001/api/order", {
            params: filter !== "all" ? { filter } : {},
            headers: { "Cache-Control": "no-cache" },
          })
          .then((res) => res.data);
      } else {
        return axios
          .get(`http://localhost:3001/api/order?email=${userData.email}`, {
            params: filter !== "all" ? { filter } : {},
            headers: { "Cache-Control": "no-cache" },
          })
          .then((res) => res.data);
      }
    },
    enabled: !!userData,
  });

  // Mutation برای تغییر وضعیت
  const updateStatus = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) =>
      axios.patch(`http://localhost:3001/api/order/${id}/status`, { status }),
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["orders", filter] }),
  });

  if (isLoading)
    return <div className="text-center mt-10">در حال بارگذاری...</div>;

  // Pagination
  const totalPages = Math.ceil(orders.length / ItemsPerPage);
  const startIndex = (page - 1) * ItemsPerPage;
  const currentOrders = orders.slice(startIndex, startIndex + ItemsPerPage);

  return (
    <div className="p-6 max-w-6xl mx-auto ">
      <div className="flex justify-between mb-6 items-end">
        <h1 className="text-3xl font-bold">مدیریت سفارش‌ها</h1>

        {/* فیلتر تاریخ */}
        <div className="flex gap-2 items-center">
          <label htmlFor="dateFilter" className="block mb-1 font-medium">
            فیلتر تاریخ
          </label>
          <select
            id="dateFilter"
            value={filter}
            onChange={(e) => {
              setFilter(e.target.value);
              setPage(1);
            }}
            className="p-2 border-2 border-gray-700 rounded-md focus:outline-none bg-black focus:ring-2 focus:ring-blue-500"
          >
            {dateFilters.map((f) => (
              <option key={f.key} value={f.key}>
                {f.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* لیست سفارش‌ها */}
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {currentOrders.map((order: any) => (
          <div
            key={order.id}
            className="relative p-4 bg-gray-900 text-white rounded-2xl shadow-md flex flex-col gap-3 transform transition-all duration-300 hover:scale-105"
          >
            {/* Badge وضعیت */}
            <span
              className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-semibold transition-colors duration-500 ${
                order.status === "pending"
                  ? "bg-yellow-500 text-black"
                  : order.status === "processing"
                  ? "bg-blue-500 text-white"
                  : order.status === "completed"
                  ? "bg-green-500 text-white"
                  : "bg-red-500 text-white"
              }`}
            >
              {statusLabels[order.status]}
            </span>

            {/* تصویر کاربر */}
            <div className="flex justify-center">
              <Image
                src={order.user?.image || "/placeholder.png"}
                alt={order.product}
                width={80}
                height={80}
                className="rounded-full border-2 border-gray-700"
              />
            </div>

            <h2 className="text-lg font-semibold mt-3">{order.product}</h2>
            <p className="text-gray-300 mt-1">{order.description}</p>
            <p className="text-gray-400 text-sm mt-1">
              کاربر: {order.user?.name} ({order.user?.email})
            </p>
            {userData.role === "ADMIN" && (
              <>
                <label
                  htmlFor={`status-${order.id}`}
                  className="block mb-1 mt-2 font-medium"
                >
                  وضعیت سفارش
                </label>
                <select
                  id={`status-${order.id}`}
                  value={order.status}
                  onChange={(e) =>
                    updateStatus.mutate({
                      id: order.id,
                      status: e.target.value,
                    })
                  }
                  className="w-full mt-1 p-2 border rounded-md bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">در انتظار</option>
                  <option value="processing">در حال پردازش</option>
                  <option value="completed">تکمیل شده</option>
                  <option value="canceled">لغو شده</option>
                </select>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <Pagination total={totalPages} page={page} onChange={setPage} loop />
      </div>
    </div>
  );
}
