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
  const [email, setEmail] = useState("");
  const router = useRouter();

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("token")
      : null;

  // Load tasks
  const fetchTasks = async () => {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/tasks`,
      {
        headers: { Authorization: `Bearer ${token}` }
      }
    );

    const data = await res.json();
    setTasks(data);
  };

  useEffect(() => {
    if (!token) {
      router.push("/auth/login");
      return;
    }

    const storedEmail = localStorage.getItem("email");
    if (storedEmail) setEmail(storedEmail);

    const loadTasks = async () => {
      await fetchTasks();
    };

    loadTasks();
  }, []);

  // Create task
  const createTask = async () => {
    if (!title) return;

    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ title })
    });

    setTitle("");
    fetchTasks();
  };

  // Delete task
  const deleteTask = async (id: string) => {
    await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tasks/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` }
    });

    fetchTasks();
  };

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("email");
    router.push("/auth/login");
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 space-y-6">
      {/* Header */}
      <header className="flex justify-between items-center border-b pb-2 mb-4">
        <h1 className="text-2xl font-bold">Task Manager</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-700">{email}</span>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-3 py-1 rounded"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Add Task */}
      <div className="flex gap-2">
        <input
          className="flex-1 border p-2 rounded"
          placeholder="New task"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <button
          onClick={createTask}
          className="bg-black text-white px-4 rounded"
        >
          Add
        </button>
      </div>

      {/* Task List */}
      <ul className="space-y-2">
        {tasks.map((task) => (
          <li
            key={task._id}
            className="border p-2 flex justify-between rounded"
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
