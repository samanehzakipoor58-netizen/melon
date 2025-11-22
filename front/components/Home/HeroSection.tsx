"use client";

import { useSession } from "next-auth/react";
import Image from "next/image";
import React from "react";
import Logo from "../common/Logo";

const HeroSection = () => {
  const { data: session, status } = useSession();
  const user = session?.user;
  console.log(session);
  return (
    <div className="grid grid-cols-1 place-items-center">
      <div className="flex justify-center">
        {user?.image && (
          <Image
            src={user?.image as string}
            width={125}
            height={125}
            alt={user?.name as string}
            className="rounded-full"
          />
        )}
        
      </div>
      <div className="font-bold text-2xl pt-2"> {user?.name}  </div>
      <div>    <Logo />  </div>
    
    </div>
  );
};

export default HeroSection;
