"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { loginSchema, type LoginFormData } from "@/lib/validation";
import Input from "@/components/Input";
import Button from "@/components/Button";
import { useRouter } from "next/navigation";
import { set } from "zod";

export default function LoginPage() {
  const { login, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({});
  const [showSuccess, setShowSuccess] = useState(false);

  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof LoginFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    try {
      const validatedData = loginSchema.parse(formData);
      await login(validatedData);
      
      setShowSuccess(true);
      setTimeout(() => {
        router.push('/admin/users');
      }, 2000);
      // Reset form after 3 seconds
      // setTimeout(() => {
      //   setShowSuccess(false);
      //   setFormData({
      //     email: "",
      //     password: "",
      //   });
      // }, 3000);
    } catch (error) {
      if (error instanceof Error && "errors" in error) {
        const zodErrors = error as { errors: Array<{ path: string[]; message: string }> };
        const newErrors: Partial<Record<keyof LoginFormData, string>> = {};
        zodErrors.errors.forEach((err) => {
          const field = err.path[0] as keyof LoginFormData;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      } else if (error instanceof Error) {
        alert(error.message);
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a0066] via-[#3b0f85] to-[#4f00b5] flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            IEEE Login
          </h1>
          <p className="text-white/70 text-center mb-8">Welcome back!</p>

          {showSuccess ? (
            <div className="text-center py-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                <svg
                  className="w-8 h-8 text-green-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-green-400 mb-2">Login Successful!</h2>
              <p className="text-white/80">You have successfully logged in</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={errors.email}
                placeholder="example@email.com"
              />

              <Input
                label="Password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                error={errors.password}
                placeholder="Enter your password"
              />

              <div className="pt-2">
                <Button type="submit" isLoading={authLoading} disabled={authLoading} className="w-full">
                  {authLoading ? "Logging in..." : "Login"}
                </Button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

