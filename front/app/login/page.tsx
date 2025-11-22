"use client";

import ModernLogin from "@/components/login/LoginForm";
import LoginForm from "@/components/login/LoginForm";
import { signIn } from "next-auth/react";
import React from "react";

export default function SignInPage() {
  return (
    <> 
       <ModernLogin />
    </>
  );
}
