"use client";

import { useEffect, useState } from "react";

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
              <td>{user.service}</td>
              <td>{user.image_src1}</td>
              <td>{user.description}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
