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
            <tr>
              <td>{user.product_type}</td>
              <td>{user.product_color}</td>
              <td>{user.product_name}</td>
              <td>
                <Link href={`/admin/edit/${user.id}`}>Edit</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
