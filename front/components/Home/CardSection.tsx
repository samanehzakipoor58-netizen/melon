"use client";

import React from "react";
import Store from "./ُStore";
import AddProducts from "./AddProducts";
import { useSession } from "next-auth/react";
import axios from "axios";
import { useQuery } from "@tanstack/react-query";

const CardSection = () => {
  const session = useSession();
  const user = session?.data?.user?.email;

  const { data: userData, isLoading } = useQuery({
    queryKey: ["user", user],
    queryFn: async () => {
      const res = await axios.get(
        `http://localhost:3001/api/users/email/${user}`
      );
      return res.data;
    },
    enabled: !!user,
  });

  console.log(userData);

  return (
    <div className="bg-transparent rounded-xl p-5">
      <div className="flex justify-between">
        <h1 className=" text-2xl font-bold py-5 "> لیست سفارشات محبوب </h1>
        {userData?.role === "ADMIN" && (
          <div>
            {" "}
            <AddProducts />{" "}
          </div>
        )}
      </div>
      <Store />
    </div>
  );
};

export default CardSection;
