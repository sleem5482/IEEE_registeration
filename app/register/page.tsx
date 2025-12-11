"use client";

import React, { useState, useRef, useEffect } from "react";
import { ZodError } from "zod";
import { useAuth } from "@/context/AuthContext";
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
    { value: "damietta", label: "دمياط" },
    { value: "ismailia", label: "الإسماعيلية" },
    { value: "suez", label: "السويس" },
    { value: "luxor", label: "الأقصر" },
    { value: "aswan", label: "أسوان" },
    { value: "assuit", label: "أسيوط" },
    { value: "minya", label: "المنيا" },
    { value: "fayoum", label: "الفيوم" },
    { value: "bani_suef", label: "بني سويف" },
    { value: "red_sea", label: "البحر الأحمر" },
    { value: "south_sinai", label: "جنوب سيناء" },
    { value: "north_sinai", label: "شمال سيناء" },
    { value: "qena", label: "قنا" },
    { value: "sohag", label: "سوهاج" },
];
const colleges = [
    { value: "engineering", label: "الهندسة" },
    { value: "medicine", label: "الطب" },
    { value: "pharmacy", label: "الصيدلة" },
    { value: "science", label: "العلوم" },
    { value: "commerce", label: "التجارة" },
    { value: "arts", label: "الآداب" },
    { value: "law", label: "القانون" },
    { value: "agriculture", label: "الزراعة" },
    { value: "nursing", label: "التمريض" },
    { value: "computer_science", label: "علوم الحاسب" },
    { value: "education", label: "التربية" },
    { value: "veterinary", label: "الطب البيطري" },
    { value: "philosophy", label: "الفلسفة" },
    { value: "tourism", label: "السياحة والفنادق" },
    { value: "fine_arts", label: "الفنون الجميلة" },
    { value: "dentistry", label: "طب الأسنان" },
    { value: "engineering_tech", label: "الهندسة التكنولوجية" },
    { value: "applied_science", label: "العلوم التطبيقية" },
    { value: "navigation_and_space", label: "علوم الملاحة وتكنولوجيا الفضاء" },
];

const levels = [
    { value: "1", label: "First" },
    { value: "2", label: "Second" },
    { value: "3", label: "Third" },
    { value: "4", label: "Fourth" },
    { value: "5", label: "Fifth" },
];

const genders = [
    { value: "male", label: "Male" },
    { value: "female", label: "Female" },
];

export default function RegisterPage() {
    const { register, isLoading: authLoading } = useAuth();

    // keep file as File | null while the rest are strings
    const [formData, setFormData] = useState<
        Partial<RegisterFormData & { payment_image?: File | null }>
    >({
        nameAr: "",
        nameEn: "",
        phone: "",
        governorate: "",
        nationalId: "",
        college: "",
        level: "",
        email: "",
        age: "",
        gender: "male",
        payment_image: undefined,
        payment_code: "",
        needsBus: false,
    });

    const [errors, setErrors] = useState<
        Partial<Record<keyof RegisterFormData | "general", string>>
    >({});
    const [showSuccess, setShowSuccess] = useState(false);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    // keep preview URL cleaned up
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const name = e.target.name as keyof typeof formData;

        if (e.target instanceof HTMLInputElement && e.target.type === "file") {
            const file = e.target.files?.[0] ?? null;
            setFormData((prev) => ({ ...prev, [name]: file }));
            setErrors((prev) => ({ ...prev, [name]: undefined }));

            if (file) {
                const url = URL.createObjectURL(file);
                setPreviewUrl(url);
            } else {
                setPreviewUrl(null);
            }

            return;
        }

        const value = (e.target as HTMLInputElement | HTMLSelectElement).value;
        setFormData((prev) => ({ ...prev, [name]: value }));
        if (errors[name as keyof RegisterFormData]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    const toFormData = (obj: Record<string, any>) => {
        const fd = new FormData();
        Object.entries(obj).forEach(([key, value]) => {
            if (value === undefined || value === null) return;
            // If the value is an object but not a File, stringify it
            if (value instanceof File) {
                fd.append(key, value);
            } else if (typeof value === "object") {
                fd.append(key, JSON.stringify(value));
            } else {
                fd.append(key, String(value));
            }
        });
        return fd;
    };

    const resetForm = () => {
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
            gender: "male",
            payment_image: undefined,
            payment_code: "",
            needsBus: false,
        });
        setErrors({});
        setPreviewUrl(null);
        if (fileInputRef.current) fileInputRef.current.value = "";
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrors({});

        try {
            // We'll validate all fields except the file itself (most schemas don't validate File)
            const { payment_image, ...rest } = formData as any;

            // parse validated data (without file)
            const validated = registerSchema.parse(rest);

            // if user uploaded a file, send FormData; otherwise send plain object
            if (payment_image instanceof File) {
                const fd = toFormData(validated as Record<string, any>);
                fd.append("payment_image", payment_image);
                await register(fd);
            } else {
                await register(validated);
            }

            setShowSuccess(true);
            resetForm();

            // hide success after 3s
            setTimeout(() => setShowSuccess(false), 3000);
        } catch (err) {
            if (err instanceof ZodError) {
                // Map Zod errors to fields
                const zodErrors: Partial<
                    Record<keyof RegisterFormData, string>
                > = {};
                err.errors.forEach((z) => {
                    const field = z.path[0] as
                        | keyof RegisterFormData
                        | undefined;
                    if (field) zodErrors[field] = z.message;
                });
                setErrors((prev) => ({ ...prev, ...zodErrors }));
            } else if (err instanceof Error) {
                // server / API error
                setErrors((prev) => ({ ...prev, general: err.message }));
            } else {
                setErrors((prev) => ({ ...prev, general: "Unknown error" }));
            }
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#2a0066] via-[#3b0f85] to-[#4f00b5] flex items-center justify-center p-4">
            <div className="w-full max-w-2xl">
                <div className="bg-white/10 border border-white/20 backdrop-blur-xl rounded-xl shadow-xl p-8">
                    <h1 className="text-3xl font-bold text-white mb-2 text-center">
                        IEEE Registration
                    </h1>
                    <p className="text-white/70 text-center mb-4">
                        Join the Event
                    </p>

                    {errors.general && (
                        <div className="bg-red-600/10 border border-red-600/20 text-red-300 p-3 rounded mb-4 text-sm">
                            {errors.general}
                        </div>
                    )}

                    {showSuccess ? (
                        <div className="text-center py-8">
                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-500/20 mb-4">
                                <svg
                                    className="w-8 h-8 text-green-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24">
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={2}
                                        d="M5 13l4 4L19 7"
                                    />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-green-400 mb-2">
                                تم التسجيل بنجاح!
                            </h2>
                            <p className="text-white/80">
                                شكرا علي التسجيل انت دلوقتي pending لحد ما يتم
                                مراجعتك
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-4"
                            noValidate>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Arabic Full Name"
                                    name="nameAr"
                                    value={formData.nameAr ?? ""}
                                    onChange={handleChange}
                                    error={errors.nameAr}
                                    pattern="^[\u0600-\u06FF\s]*$"
                                    required
                                    dir="rtl"
                                    placeholder="أدخل الاسم رباعي بالعربية"
                                />
                                <Input
                                    label="English Full Name"
                                    name="nameEn"
                                    value={formData.nameEn ?? ""}
                                    onChange={handleChange}
                                    error={errors.nameEn}
                                    pattern="^[a-zA-Z\s]*$"
                                    required
                                    placeholder="Enter full name in English"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone ?? ""}
                                    onChange={handleChange}
                                    error={errors.phone}
                                    pattern="^01[0-1,2,5]\d{8}$"
                                    required
                                    placeholder="01XXXXXXXXX"
                                />
                                <Input
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={formData.email ?? ""}
                                    onChange={handleChange}
                                    error={errors.email}
                                    pattern="^[^\s@]+@[^\s@]+\.[^\s@]+$"
                                    required
                                    placeholder="example@email.com"
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="Governorate"
                                    name="governorate"
                                    value={formData.governorate ?? ""}
                                    onChange={handleChange}
                                    error={errors.governorate}
                                    options={governorates}
                                />
                                <Input
                                    label="National ID"
                                    name="nationalId"
                                    value={formData.nationalId ?? ""}
                                    onChange={handleChange}
                                    error={errors.nationalId}
                                    pattern="^\d{14}$"
                                    required
                                    placeholder="14 digits"
                                    maxLength={14}
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Select
                                    label="College"
                                    name="college"
                                    value={formData.college ?? ""}
                                    onChange={handleChange}
                                    error={errors.college}
                                    options={colleges}
                                    required
                                />
                                <Select
                                    label="Level"
                                    name="level"
                                    value={formData.level ?? ""}
                                    onChange={handleChange}
                                    error={errors.level}
                                    options={levels}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Age"
                                    name="age"
                                    type="text"
                                    value={formData.age ?? ""}
                                    onChange={handleChange}
                                    error={errors.age}
                                    placeholder="Age"
                                    min={16}
                                    max={100}
                                    required
                                />
                                <Select
                                    label="Gender"
                                    name="gender"
                                    value={formData.gender ?? ""}
                                    onChange={handleChange}
                                    error={errors.gender}
                                    options={genders}
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-white/90 mb-1">
                                        Payment Image
                                    </label>
                                    <input
                                        ref={fileInputRef}
                                        name="payment_image"
                                        onChange={handleChange}
                                        type="file"
                                        accept="image/*"
                                        className="block w-full text-sm text-white/90 bg-white/5 border border-white/10 rounded p-2 cursor-pointer"
                                    />
                                    {errors.payment_image && (
                                        <p className="text-xs text-red-400 mt-1">
                                            {errors.payment_image}
                                        </p>
                                    )}
                                    {previewUrl && (
                                        <img
                                            src={previewUrl}
                                            alt="preview"
                                            className="mt-2 max-h-28 object-contain rounded"
                                        />
                                    )}
                                </div>

                                <Input
                                    label="Payment Code"
                                    name="payment_code"
                                    value={formData.payment_code ?? ""}
                                    onChange={handleChange}
                                    error={errors.payment_code}
                                    placeholder="Enter Payment Code"
                                />
                            </div>

                            {/* حقل الباص */}
                            <div className="bg-white/5 border border-white/10 rounded-lg p-4">
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        name="needsBus"
                                        checked={formData.needsBus ?? false}
                                        onChange={(e) => {
                                            setFormData((prev) => ({
                                                ...prev,
                                                needsBus: e.target.checked,
                                            }));
                                            if (errors.needsBus) {
                                                setErrors((prev) => ({
                                                    ...prev,
                                                    needsBus: undefined,
                                                }));
                                            }
                                        }}
                                        className="w-5 h-5 rounded border-white/20 bg-white/5 text-purple-600 focus:ring-2 focus:ring-purple-500/50"
                                    />
                                    <span className="text-white/90 font-medium">
                                        Do you need a bus?
                                    </span>
                                </label>
                                {errors.needsBus && (
                                    <p className="text-xs text-red-400 mt-2 flex items-center gap-1">
                                        <span>⚠</span>
                                        {errors.needsBus}
                                    </p>
                                )}
                            </div>

                            <div className="pt-4">
                                <Button
                                    type="submit"
                                    isLoading={authLoading}
                                    disabled={authLoading}
                                    className="w-full">
                                    {authLoading
                                        ? "Registering..."
                                        : "Register"}
                                </Button>
                            </div>

                            {/* Link to Login */}
                            <div className="text-center mt-4">
                                <p className="text-white/70 text-sm">
                                    Do you already have an account?{" "}
                                    <Link
                                        href="/login"
                                        className="text-purple-400 hover:text-purple-300 font-medium underline">
                                        Login
                                    </Link>
                                </p>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
