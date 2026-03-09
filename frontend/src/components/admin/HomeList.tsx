"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function HomeList() {
  const [users, setUsers] = useState([]);
  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/home/`, {
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((data) => setUsers(data));
  }, []);

  // delete handler
  const handleDelete = async (id: number) => {
    const confirmDelete = confirm("Are you sure you want to delete this item?");
    if (!confirmDelete) return;
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}/home/${id}/`,
        {
          method: "DELETE",
        },
      );
      if (!res.ok) {
        throw new Error("Failed to delete");
      }
      setUsers((prev) => prev.filter((user) => user.id !== id));
    } catch (error) {
      console.error("Delete failed:", error);
    }
  };

  return (
    <div>
      <h1>List</h1>
      <table>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
        </tr>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.product_type}</td>
              <td>{user.product_color}</td>
              <td>{user.product_name}</td>
              <td>
                <Link href={`/admin/edit/${user.id}`}>Edit</Link>
                <button
                  onClick={() => handleDelete(user.id)}
                  style={{ marginLeft: "10px", color: "red" }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Link href="/admin/add">Add New</Link>
    </div>
  );
}
