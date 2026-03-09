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

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  if (!user) return <div>...Loading</div>;

  return (
    <div>
      <form>
        <label>商品タイプ</label>
        <input
          name="product_type"
          value={user.product_type}
          onChange={handleChange}
        />
        <label>商品色</label>
        <input
          name="product_color"
          value={user.product_color}
          onChange={handleChange}
        />
        <label>商品名</label>
        <input
          name="product_name"
          value={user.product_name}
          onChange={handleChange}
        />
        <label>商品概要</label>
        <text
          name="product_description"
          value={user.product_description}
          onChange={handleChange}
        />
        <label>商品価格</label>
        <input
          type="number"
          name="product_price"
          value={user.product_price}
          onChange={handleChange}
        />
        <label>商品写真</label>
        <input
          type="file"
          accept="image/*"
          value={user.image_src}
          onChange={handleChange}
        />
      </form>
    </div>
  );
}
