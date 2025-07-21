"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance/axiosInstance";

export default function ProtectedRoute({ children }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    verifyUser();
  }, [router]);

  const verifyUser = async () => {
    try {
      const res = await axiosInstance.get("/api/check-user");
      if (res.status === 200) {
        setLoading(false);
      }
    } catch (err) {
      console.error("Auth check failed:", err);
      sessionStorage.clear();
      router.replace("/login");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div>
      <main style={{ marginLeft: 250, padding: 20, height: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
