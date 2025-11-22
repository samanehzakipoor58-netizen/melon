"use client"
import * as React from "react"
import { useForm } from "@tanstack/react-form"
import type { AnyFieldApi } from "@tanstack/react-form"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { motion } from "framer-motion"

import { Upload } from "lucide-react"
import Swal from "sweetalert2"
import toast from "react-hot-toast"

interface Product {
  name: string;
  img: string;
  price: number;
}

interface Iprops {
  selectedProduct: string,
  onModalClose: () => void   
}
function FieldInfo({ field }: { field: AnyFieldApi }) {
  return (
    <>
      {field.state.meta.isTouched && !field.state.meta.isValid ? (
        <em className="text-red-500 text-sm">{field.state.meta.errors.join(", ")}</em>
      ) : null}
      {field.state.meta.isValidating ? (
        <span className="text-yellow-500 text-xs">Validating...</span>
      ) : null}
    </>
  )
}

export default function VariantForm({selectedProduct , onModalClose}:Iprops ) {
  const [imagePreview, setImagePreview] = React.useState<string | null>(null)
  const queryClient = useQueryClient();
  const mutate = useMutation({
    mutationFn: (value: Product) => {
      return axios.post(`http://localhost:3001/api/product/${selectedProduct}/variant`, value)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      onModalClose();
      Swal.fire({
        title: "موفق!",
        text: "سفارش شما ثبت شد",
        icon: "success",
      });

    },
    onError: () => {
      toast.error("متاسفانه سفارش شما ثبت نشد");
    },
  })

  const form = useForm({
    defaultValues: {
      name: "",
      img: "",
      price: 0,
    },
    onSubmit: async ({ value }) => {
      mutate.mutate(value)
    },
  })

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black flex justify-center items-start py-10 px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-xl bg-gray-800 p-6 rounded-2xl border border-gray-700 shadow-lg"
      >
        <h1 className="text-white text-2xl font-bold mb-6 text-center">
          افزودن محصول جدید
        </h1>

        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
          className="space-y-6"
        >
          {/* Title Field */}
          <div className="flex flex-col space-y-2">
            <form.Field
              name="name"
              validators={{
                onChange: ({ value }) =>
                  !value
                    ? "نام محصول الزامی است"
                    : value.length < 3
                    ? "نام محصول باید حداقل ۳ کاراکتر باشد"
                    : undefined,
                onChangeAsyncDebounceMs: 500,
                onChangeAsync: async ({ value }) => {
                  await new Promise((resolve) => setTimeout(resolve, 800))
                  return (
                    value.includes("error") && "استفاده از کلمه error مجاز نیست"
                  )
                },
              }}
            >
              {(field) => (
                <>
                  <label className="text-gray-200" htmlFor={field.name}>
                    نام محصول :
                  </label>
                  <input
                    id={field.name}
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring focus:ring-blue-500"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(e.target.value)}
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>

          {/* Image File Upload */}
          <div className="flex flex-col space-y-2">
            <label className="text-gray-200"> انتخاب عکس محصول : </label>
            <div className="flex items-center space-x-3">
              <label className="flex items-center cursor-pointer bg-gray-700 text-white px-3 py-2 rounded-lg hover:bg-gray-600 transition">
                <Upload className="w-5 h-5 mr-2" />
                انتخاب عکس
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) {
                      const reader = new FileReader()
                      reader.onload = () => {
                        setImagePreview(reader.result as string)
                        form.setFieldValue("img", reader.result as string)
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                />
              </label>
            </div>

            {imagePreview && (
              <img
                src={imagePreview}
                alt="preview"
                className="w-32 h-32 object-cover rounded-xl border border-gray-600 mt-2"
              />
            )}
          </div>

          {/* Price Field */}
          <div className="flex flex-col space-y-2">
            <form.Field name="price">
              {(field) => (
                <>
                  <label className="text-gray-200" htmlFor={field.name}>
                    قیمت :
                  </label>
                  <input
                    id={field.name}
                    type="number"
                    className="px-3 py-2 rounded-lg bg-gray-700 text-white border border-gray-600 focus:ring focus:ring-blue-500"
                    value={field.state.value}
                    onBlur={field.handleBlur}
                    onChange={(e) => field.handleChange(Number(e.target.value))}
                  />
                  <FieldInfo field={field} />
                </>
              )}
            </form.Field>
          </div>

          {/* Submit Button */}
          <form.Subscribe
            selector={(state) => [state.canSubmit, state.isSubmitting]}
          >
            {([canSubmit, isSubmitting]) => (
              <button
                type="submit"
                disabled={!canSubmit}
                className="w-full text-lg rounded-xl shadow-lg"
              >
                {isSubmitting ? "..." : "ثبت محصول"}
              </button>
            )}
          </form.Subscribe>
        </form>
      </motion.div>
    </div>
  )
}
