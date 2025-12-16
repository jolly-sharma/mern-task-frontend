"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

interface Task {
  _id: string;
  title: string;
  description?: string;
  status: string;
}

export default function DashboardPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    const data = await res.json();
    setTasks(data);
  };

  const createTask = async () => {
    if (!title) return;

    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ title })
      }
    );

    setTitle("");
    fetchTasks();
  };

  const deleteTask = async (id: string) => {
    await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );

    fetchTasks();
  };

  return (
    <div className="max-w-xl mx-auto mt-10 space-y-4">
      <h1 className="text-2xl font-bold">Dashboard</h1>

      <div className="flex gap-2">
        <input
          className="flex-1 border p-2"
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={createTask}
          className="bg-black text-white px-4"
        >
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="border p-2 flex justify-between"
          >
            <span>{task.title}</span>
            <button
              onClick={() => deleteTask(task._id)}
              className="text-red-500"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
