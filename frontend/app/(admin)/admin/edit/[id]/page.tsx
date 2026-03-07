"use client";

import { useState, useEffect, use } from "react";
import CardProps from "@/data/types";

export default function EditPage({ params }: CardProps) {
  const { id } = use(params);
  const [user, setUser] = useState<any>(null);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/home/${id}`, {})
      .then((res) => res.json())
      .then((data) => setUser(data));
  }, []);
  return (
    <div>
      Edit Product {user?.["product_color"]}
      {id}
    </div>
  );
}
