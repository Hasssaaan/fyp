"use client";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import { toast } from "react-hot-toast";

export default function LoginPage() {
  const router = useRouter();
  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const [buttonDisabled, setButtonDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    try {
      setLoading(true);
      await axios.post("/api/users/login", user);
      toast.success("Login successful");

      // Get role after login
      const meRes = await axios.get("/api/users/me");
      const role = meRes.data.user.role;

      if (role === "admin") {
        router.push("/admin");
      } else if (role === "freelancer") {
        router.push("/freelancer");
      } else if (role === "client") {
        router.push("/client");
      } else {
        router.push("/profile"); // fallback
      }
    } catch (error: any) {
      toast.error(error?.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setButtonDisabled(!(user.email && user.password));
  }, [user]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-2xl font-semibold mb-4">
        {loading ? "Processing..." : "Login"}
      </h1>

      <label htmlFor="email">Email</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 text-black"
        id="email"
        type="text"
        value={user.email}
        onChange={(e) => setUser({ ...user, email: e.target.value })}
        placeholder="Email"
      />

      <label htmlFor="password">Password</label>
      <input
        className="p-2 border border-gray-300 rounded-lg mb-4 text-black"
        id="password"
        type="password"
        value={user.password}
        onChange={(e) => setUser({ ...user, password: e.target.value })}
        placeholder="Password"
      />

      <button
        onClick={onLogin}
        disabled={buttonDisabled}
        className="p-2 border border-gray-300 rounded-lg mb-4 disabled:opacity-50"
      >
        Login
      </button>

      <Link className="text-blue-500 hover:underline" href="/signup">
        Don’t have an account? Sign up
      </Link>
    </div>
  );
}
