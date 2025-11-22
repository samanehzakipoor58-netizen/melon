"use client";

import React, { useState } from "react";
import {
  Card,
  CardHeader,
  CardFooter,
  Image,
  Button,
  useDisclosure,
} from "@heroui/react";
import MyModal from "../common/MyModal";
import { motion } from "framer-motion";
import CardModal from "./CardModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { Pencil, Trash2 } from "lucide-react";
import { useSession } from "next-auth/react";
import AddProducts from "./AddProducts";
import ProductsForm from "./ProductForm";
import ConfirmDelete from "../common/ConfirmDelete";

type Product = {
  id: number;
  title: string;
  img: string;
  price: number;
};

export default function Store() {
  const [selcted, setSelected] = useState<Product | null>(null);

  const queryClient = useQueryClient();
  const session = useSession();

  const userEmail = session?.data?.user?.email;

  // گرفتن اطلاعات کاربر شامل role
  const { data: userData, isLoading: isUserLoading } = useQuery({
    queryKey: ["user", userEmail],
    queryFn: async () => {
      if (!userEmail) return null;
      const res = await axios.get(
        `http://localhost:3001/api/users/email/${userEmail}`
      );
      return res.data; // فرض: userData.role = 'admin' یا 'user'
    },
    enabled: !!userEmail,
  });

  // گرفتن محصولات
  const { data: productsData, refetch } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await axios.get("http://localhost:3001/api/product");
      return res.data;
    },
  });

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  const handleCardClick = (product: any) => {
    setSelectedProduct(product);
    onOpen();
  };

  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      return axios.delete(`http://localhost:3001/api/product/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["products"] });
      onClose1(); // بروزرسانی لیست محصولات
    },
  });

  console.log("selected", selcted);

  //  const {mutate:UpdateProduct} = useMutation({
  //   mutationFn: async (id: number) => {
  //     return axios.patch(`http://localhost:3001/api/product/${id}`)

  //     },
  //   onSuccess: () => {
  //   queryClient.invalidateQueries({ queryKey: ["products"] });
  //   },

  // });

  const {
    isOpen: isOpen1,
    onOpen: onOpen1,
    onClose: onClose1,
  } = useDisclosure();

  const {
    isOpen: isOpen2,
    onOpen: onOpen2,
    onClose: onClose2,
  } = useDisclosure();

  if (isUserLoading) return <p>Loading...</p>;

  return (
    <>
      <div>
        <ConfirmDelete
          isOpen={isOpen2}
          onClose={onClose2}
          onConfirm={() => {
            if (!selcted) return;
            deleteMutation.mutate(selcted.id);
          }}
        />
        <MyModal title="اضافه کردن محصولات" isOpen={isOpen1} onClose={onClose1}>
          <ProductsForm selcted={selcted} onClose={onClose1} />
        </MyModal>
      </div>
      <div className="gap-2 grid grid-cols-12 auto-rows-[300px]">
        {productsData?.map((item: any, index: number) => {
          const isHovered = hoveredIndex === index;
          return (
            <motion.div
              key={item.id}
              className={`col-span-12 ${item.col || "sm:col-span-4"} relative`}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card
                className="h-[300px] cursor-pointer overflow-hidden relative"
                onClick={() => handleCardClick(item)}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                <Image
                  removeWrapper
                  alt={item.title}
                  className="z-0 w-full h-full object-cover"
                  src={item.img}
                />

                {/* Gradient overlay */}
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent pointer-events-none z-10"
                  animate={{
                    x: isHovered ? 0 : "-100%",
                    opacity: isHovered ? 1 : 0,
                  }}
                  transition={{ duration: 0.6 }}
                />

                {/* Price */}
                <motion.div
                  className="absolute inset-0 z-20 flex items-center justify-center"
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    scale: isHovered ? 1 : 0.9,
                  }}
                  transition={{ duration: 0.4 }}
                >
                  <span className="text-white text-xl font-bold px-4 py-2 rounded-lg">
                    قیمت: {item.price}
                  </span>
                </motion.div>

                {/* Card Header */}
                <CardHeader className="absolute z-20 top-1 flex-col items-start">
                  <p className="text-tiny text-black/60 uppercase font-bold">
                    {item.title}
                  </p>
                </CardHeader>

                {/* Trash Icon فقط برای ادمین */}
                {isHovered && userData?.role === "ADMIN" && (
                  <div className="felx gap-2">
                    <motion.button
                      className="absolute top-2 right-2 bg-red-600 p-2 rounded-full z-30"
                      onClick={(e) => {
                        e.stopPropagation(); // جلوگیری از باز شدن modal
                        setSelected(item);
                        onOpen2();
                      }}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Trash2 className="w-5 h-5 text-white" />
                    </motion.button>

                    <motion.button
                      className="absolute top-2 right-14 bg-red-600 p-2 rounded-full z-30"
                      onClick={(e) => {
                        e.stopPropagation(); // جلوگیری از باز شدن modal
                        setSelected(item);
                        onOpen1();
                      }}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      <Pencil className="w-5 h-5 text-white" />
                    </motion.button>
                  </div>
                )}

                {/* Card Footer */}
                <CardFooter className="absolute bg-black/40 bottom-0 z-20 border-t-1 border-default-600 dark:border-default-100">
                  <div className="flex grow gap-2 items-center">
                    <Image
                      alt={`${item.title} icon`}
                      className="rounded-full w-10 h-11 bg-black"
                      src={item.img}
                    />
                    <div className="flex flex-col">
                      {["Melon App", "برای ثبت سفارش کلیک کنید"].map(
                        (text, i) => (
                          <p key={i} className="text-tiny text-white/60">
                            {text}
                          </p>
                        )
                      )}
                    </div>
                  </div>
                  <Button
                    radius="full"
                    size="sm"
                    onPress={() => handleCardClick(item)}
                  >
                    ثبت سفارش
                  </Button>
                </CardFooter>
              </Card>
            </motion.div>
          );
        })}
      </div>

      {selectedProduct && (
        <MyModal
          isOpen={isOpen}
          onClose={onClose}
          title={selectedProduct.title}
        >
          <CardModal selectedProduct={selectedProduct} onClose={onClose} />
        </MyModal>
      )}
    </>
  );
}
