"use client";

import { useState } from "react";

export default function Admin() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    link: "",
    email: "",
    text: "",
  });
  const [image, setImage] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    setFormData({ ...FormData, [e.target.name]: e.target.value });
  };
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("link", formData.link);
    data.append("email", formData.email);
    data.append("text", formData.text);
    if (image) {
      data.append("image", image);
    }
    try {
      const response = await fetch("http://10.66.66.4:8000/api", {
        method: "POST",
        body: data,
      });
      if (!response.ok) {
        throw new Error("Failed to submit");
      }
      aleart("Successfully submitted!");
    } catch (error) {
      console.error(error);
      aleart("Error submitting form");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1></h1>
      <form>
        <div>
          <label>Title</label>
          <input />
        </div>
        <div>
          <label>Description</label>
          <input />
        </div>
        <div>
          <label>Image</label>
          <input />
        </div>
        <div>
          <label>Link</label>
          <input />
        </div>
        <div>
          <label>Text</label>
          <input />
        </div>
        <button></button>
      </form>
    </div>
  );
}
