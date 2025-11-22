"use client";

import React from "react";
import MyModal from "../common/MyModal";
import { useDisclosure } from "@heroui/react";
import ProductsForm from "./ProductForm";

const AddProducts = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();


  return (
    <div>
      <button onClick={onOpen}> "اضافه کردن محصولات </button>
      <MyModal title="اضافه کردن محصولات" isOpen={isOpen} onClose={onClose}>
         <ProductsForm onClose={onClose}/>
      </MyModal>

    </div>
  );
};

export default AddProducts;
