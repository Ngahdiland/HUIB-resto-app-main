"use client";
import React from "react";
import useAuthRedirect from "@/hooks/useAuthRedirect";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  useAuthRedirect();
  return <>{children}</>;
} 