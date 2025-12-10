import { z } from "zod";

// Registration form schema
export const registerSchema = z.object({
  nameAr: z
    .string()
    .min(1, "الاسم رباعي بالعربي مطلوب")
    .regex(/[\u0600-\u06FF\s]+/, "يجب أن يحتوي الاسم على أحرف عربية"),
  nameEn: z
    .string()
    .min(1, "Full name in English is required")
    .regex(/^[a-zA-Z\s]+$/, "Full name must contain only English letters"),
  phone: z
    .string()
    .min(1, "Phone number is required")
    .regex(/^01[0-2,5]\d{8}$/, "Phone number must be a valid Egyptian number (11 digits starting with 01)"),
  governorate: z.string().min(1, "المحافظة مطلوبة"),
  nationalId: z
    .string()
    .min(1, "الرقم القومي مطلوب")
    .length(14, "الرقم القومي يجب أن يكون 14 رقم")
    .regex(/^\d+$/, "الرقم القومي يجب أن يحتوي على أرقام فقط"),
  college: z.string().min(1, "الكلية مطلوبة"),
  level: z.string().min(1, "الفرقة مطلوبة"),
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  age: z
    .string()
    .min(1, "السن مطلوب")
    .refine((val) => {
      const num = parseInt(val);
      return !isNaN(num) && num >= 16 && num <= 100;
    }, "السن يجب أن يكون بين 16 و 100"),
  gender: z.enum(["male", "female"], {
    required_error: "النوع مطلوب",
  }),
});

export type RegisterFormData = z.infer<typeof registerSchema>;

// Login form schema
export const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Invalid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

export type LoginFormData = z.infer<typeof loginSchema>;

