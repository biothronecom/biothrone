
"use client";

import React, { useState, useEffect } from "react";
import { Slot } from "@radix-ui/react-slot";

type ClientOnlyProps = React.HTMLAttributes<HTMLElement> & {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  asChild?: boolean;
};

export function ClientOnly({ children, fallback = null, asChild = false, ...props }: ClientOnlyProps) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return <>{fallback}</>;
  }

  const Comp = asChild ? Slot : "div";
  return <Comp {...props}>{children}</Comp>;
}
