"use client";

import { useState } from "react";

export default function Admin() {
  const [formData, setFormData] = useState({
    productType: "",
    productColor: "",
    productName: "",
    productDescription: "",
    productPrice: 0,
    image: null,
    link: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFormData({ ...formData, image: e.target.files[0] });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("product_type", formData.productType);
    data.append("product_color", formData.productColor);
    data.append("product_name", formData.productName);
    data.append("product_description", formData.productDescription);
    data.append("product_price", formData.productPrice);
    data.append("link", formData.link);
    if (formData.image) {
      data.append("image_src", formData.image);
    }
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/home/`,
        {
          method: "POST",
          body: data, // FormData object
          // cache: "no-store",
        },
      );
      if (!response.ok) {
        const err = await response.json();
        const message = Object.values(err).flat().join(", ");
        throw new Error(message || "Failed to submit");
      }
      alert("Successfully submitted!");
    } catch (error: any) {
      console.error(error);
      alert(
        `Error submitting form, ${formData.image?.name} ${formData.productPrice} ${formData.link} ${error.message}`,
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1>Home Card</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>ProductTitle</label>
          <input
            type="text"
            name="productTitle"
            required
            value={formData.productTitle}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Product Color</label>
          <input
            type="text"
            name="productColor"
            required
            value={formData.productColor}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Product Name</label>
          <input
            type="text"
            name="productName"
            required
            value={formData.productName}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Product Description</label>
          <input
            type="text"
            name="productDescription"
            required
            value={formData.productDescription}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Product Price</label>
          <input
            type="number"
            name="productPrice"
            required
            value={formData.productPrice}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image</label>
          <input
            type="file"
            name="image"
            required
            onChange={handleImageChange}
          />
        </div>
        <div>
          <label>link</label>
          <input
            type="url"
            name="link"
            required
            value={formData.link}
            onChange={handleChange}
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? "Submitting..." : "Submit"}
        </button>
      </form>
    </div>
  );
}
