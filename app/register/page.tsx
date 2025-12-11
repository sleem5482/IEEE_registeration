"use client";

import React, { useState } from "react";
import { registerSchema, type RegisterFormData } from "@/lib/validation";
import Input from "@/components/Input";
import Select from "@/components/Select";
import Button from "@/components/Button";
import Link from "next/link";

const governorates = [
  { value: "cairo", label: "القاهرة" },
  { value: "giza", label: "الجيزة" },
  { value: "alexandria", label: "الإسكندرية" },
  { value: "sharqia", label: "الشرقية" },
  { value: "dakahlia", label: "الدقهلية" },
  { value: "beheira", label: "البحيرة" },
  { value: "monufia", label: "المنوفية" },
  { value: "qalyubia", label: "القليوبية" },
  { value: "gharbia", label: "الغربية" },
  { value: "kafr_el_sheikh", label: "كفر الشيخ" },
];

const colleges = [
  { value: "engineering", label: "الهندسة" },
  { value: "medicine", label: "الطب" },
  { value: "pharmacy", label: "الصيدلة" },
  { value: "science", label: "العلوم" },
  { value: "commerce", label: "التجارة" },
  { value: "arts", label: "الآداب" },
  { value: "law", label: "القانون" },
];

const levels = [
  { value: "1", label: "الفرقة الأولى" },
  { value: "2", label: "الفرقة الثانية" },
  { value: "3", label: "الفرقة الثالثة" },
  { value: "4", label: "الفرقة الرابعة" },
  { value: "5", label: "الفرقة الخامسة" },
];

const genders = [
  { value: "male", label: "ذكر" },
  { value: "female", label: "أنثى" },
];

export default function RegisterPage() {
  const [formData, setFormData] = useState<RegisterFormData>({
    nameAr: "",
    nameEn: "",
    phone: "",
    governorate: "",
    nationalId: "",
    college: "",
    level: "",
    email: "",
    age: "",
    gender: undefined,
  });

  const [errors, setErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name as keyof RegisterFormData]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    try {
      const validatedData = registerSchema.parse(formData);
      console.log("Form submitted:", validatedData);
      
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));
      
      setShowSuccess(true);
      // Reset form after 3 seconds
      setTimeout(() => {
        setShowSuccess(false);
        setFormData({
          nameAr: "",
          nameEn: "",
          phone: "",
          governorate: "",
          nationalId: "",
          college: "",
          level: "",
          email: "",
          age: "",
          gender: undefined,
        });
      }, 3000);
    } catch (error) {
      if (error instanceof Error && "errors" in error) {
        const zodErrors = error as { errors: Array<{ path: string[]; message: string }> };
        const newErrors: Partial<Record<keyof RegisterFormData, string>> = {};
        zodErrors.errors.forEach((err) => {
          const field = err.path[0] as keyof RegisterFormData;
          newErrors[field] = err.message;
        });
        setErrors(newErrors);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#2a0066] via-[#3b0f85] to-[#4f00b5] flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl shadow-xl p-8">
          <h1 className="text-3xl font-bold text-white mb-2 text-center">
            IEEE Registration
          </h1>
          <p className="text-white/70 text-center mb-8">Join the IEEE Community</p>

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
              <h2 className="text-2xl font-bold text-green-400 mb-2">Success!</h2>
              <p className="text-white/80">User Registered Successfully</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="الاسم رباعي بالعربي"
                  name="nameAr"
                  value={formData.nameAr}
                  onChange={handleChange}
                  error={errors.nameAr}
                  dir="rtl"
                  placeholder="أدخل الاسم الكامل بالعربية"
                />
                <Input
                  label="Full name in English"
                  name="nameEn"
                  value={formData.nameEn}
                  onChange={handleChange}
                  error={errors.nameEn}
                  placeholder="Enter full name in English"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Phone Number"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  error={errors.phone}
                  placeholder="01XXXXXXXXX"
                />
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={errors.email}
                  placeholder="example@email.com"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="المحافظة"
                  name="governorate"
                  value={formData.governorate}
                  onChange={handleChange}
                  error={errors.governorate}
                  dir="rtl"
                  options={governorates}
                />
                <Input
                  label="الرقم القومي"
                  name="nationalId"
                  value={formData.nationalId}
                  onChange={handleChange}
                  error={errors.nationalId}
                  dir="rtl"
                  placeholder="14 رقم"
                  maxLength={14}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Select
                  label="الكلية"
                  name="college"
                  value={formData.college}
                  onChange={handleChange}
                  error={errors.college}
                  dir="rtl"
                  options={colleges}
                />
                <Select
                  label="الفرقة"
                  name="level"
                  value={formData.level}
                  onChange={handleChange}
                  error={errors.level}
                  dir="rtl"
                  options={levels}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="السن"
                  name="age"
                  type="number"
                  value={formData.age}
                  onChange={handleChange}
                  error={errors.age}
                  dir="rtl"
                  placeholder="السن"
                  min={16}
                  max={100}
                />
                <Select
                  label="النوع"
                  name="gender"
                  value={formData.gender || ""}
                  onChange={handleChange}
                  error={errors.gender}
                  dir="rtl"
                  options={genders}
                />
              </div>

              <div className="pt-4">
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? "Registering..." : "Register"}
                </Button>
              </div>
              <div className="text-center">
              <p className="text-center">you have an accont ? </p> 
              <Link href="/login" className=" text-blue-400 text-[22px]">login</Link>
              </div>
             
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

