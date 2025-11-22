"use client";

import { Chip, useDisclosure } from "@heroui/react";
import React, { useState } from "react";
import BlueInput from "../common/BlueInput";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
// import toast from "react-hot-toast";
import { toast } from "sonner";
import Swal from "sweetalert2";
import MyModal from "../common/MyModal";
import VariantForm from "./VarientForm";
type FruitVariant = {
  id: number;
  name: string;
  img: string;
};

type Props = {
  selectedProduct: {
    title: string;
    id: string;
    variants: FruitVariant[];
  };
  onClose: () => void;
};

const CardModal = ({ selectedProduct, onClose }: Props) => {
  const [selectedFruits, setSelectedFruits] = useState<FruitVariant[]>([]);
  const [quantity, setQuantity] = useState(""); // 🔥 فقط یک مقدار

  const queryClient = useQueryClient();
  const session = useSession();
  const id = session.data?.user?.email;

  const { data: user } = useQuery({
    queryKey: ["user", id],
    queryFn: () =>
      fetch(`http://localhost:3001/api/users/email/${id}`).then((res) =>
        res.json()
      ),
    enabled: !!id,
  });

  const { mutate } = useMutation({
    mutationFn: async (newData: any) => {
      await axios.post("http://localhost:3001/api/order", newData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      Swal.fire({
        title: "موفق!",
        text: "سفارش شما ثبت شد",
        icon: "success",
      });
    },
    onError: () => {
      toast.error("متاسفانه سفارش شما ثبت نشد");
    },
  });

  const toggleSelect = (fruit: FruitVariant) => {
    const exists = selectedFruits.some((f) => f.id === fruit.id);

    if (exists) {
      setSelectedFruits(selectedFruits.filter((f) => f.id !== fruit.id));
    } else {
      setSelectedFruits([...selectedFruits, fruit]);
    }
  };

  const handleSubmit = () => {
    if (!user || selectedFruits.length === 0 || !quantity.trim()) return;

    const newData = {
      userId: user.id,
      product: JSON.stringify(selectedFruits),
      description: quantity,
      price: 205.5,
    };

    mutate(newData);
    console.log(newData);

    // Reset
    setSelectedFruits([]);
    setQuantity("");
    onClose();
  };

  console.log("selected products ", selectedProduct.id);
  const { isOpen, onOpen, onClose: onModalClose } = useDisclosure();
  return (
    <div className="flex flex-col gap-6 text-gray-800">
      <div className="flex justify-between">
        {user?.role === "ADMIN" && (
          <>
            <button onClick={onOpen}> "اضافه کردن محصولات </button>
            <MyModal
              title="اضافه کردن محصولات"
              isOpen={isOpen}
              onClose={onModalClose}
            >
              <VariantForm
                selectedProduct={selectedProduct?.id}
                onModalClose={onModalClose}
              />
            </MyModal>
          </>
        )}

        <p className=" text-lg font-bold">
          شما در حال ثبت سفارش برای <b>{selectedProduct.title}</b> هستید
        </p>
      </div>

      {/* انتخاب میوه‌ها */}
      <div className="grid grid-cols-3 gap-4">
        {selectedProduct.variants.map((fruit) => {
          const isSelected = selectedFruits.some((f) => f.id === fruit.id);
          return (
            <div
              key={fruit.id}
              onClick={() => toggleSelect(fruit)}
              className={`relative cursor-pointer rounded-xl overflow-hidden shadow-md transition ${
                isSelected ? "scale-105 ring-4 ring-blue-500" : ""
              }`}
            >
              <img
                src={fruit.img}
                alt={fruit.name}
                className="w-full h-32 object-cover"
              />
              {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-500 text-white text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full">
                  ✓
                </div>
              )}
              <p className="text-center mt-2 text-sm font-semibold text-gray-800">
                {fruit.name}
              </p>
            </div>
          );
        })}
      </div>

      {/* چیپ‌ها */}
      {selectedFruits.length > 0 && (
        <div className="flex gap-2 flex-wrap justify-end">
          {selectedFruits.map((fruit) => (
            <Chip key={fruit.id} onClose={() => toggleSelect(fruit)}>
              {fruit.name}
            </Chip>
          ))}
        </div>
      )}

      {/* 🔥 یک ورودی برای مقدار */}
      {selectedFruits.length > 0 && (
        <div>
          <label className="font-semibold text-right block mb-2">
            مقدار سفارش:
          </label>

          <BlueInput
            type="text"
            placeholder="مثلاً ۳ کیلو – یا نصف از هرکدام"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
          />
        </div>
      )}

      {/* دکمه ثبت */}
      {selectedFruits.length > 0 && (
        <button
          onClick={handleSubmit}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-xl transition"
        >
          ثبت سفارش
        </button>
      )}
    </div>
  );
};

export default CardModal;
