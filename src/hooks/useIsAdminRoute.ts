
"use client";

import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

export function useIsAdminRoute() {
  const pathname = usePathname();
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    setIsAdmin(pathname.startsWith("/admin"));
  }, [pathname]);

  return isAdmin;
}
