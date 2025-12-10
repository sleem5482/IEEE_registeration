import React from "react";

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  error?: string;
  dir?: "ltr" | "rtl";
  options: { value: string; label: string }[];
}

export default function Select({
  label,
  error,
  dir = "ltr",
  options,
  className = "",
  ...props
}: SelectProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white/90 mb-2">{label}</label>
      <select
        dir={dir}
        className={`
          w-full px-4 py-3 
          bg-white/5 
          border ${error ? "border-red-400" : "border-white/20"} 
          rounded-lg 
          text-white 
          focus:outline-none 
          focus:ring-2 
          focus:ring-purple-500/50 
          focus:border-purple-400 
          transition-all
          backdrop-blur-sm
          ${className}
        `}
        {...props}
      >
        <option value="" className="bg-[#2a0066] text-white">
          {dir === "rtl" ? "اختر..." : "Select..."}
        </option>
        {options.map((option) => (
          <option key={option.value} value={option.value} className="bg-[#2a0066] text-white">
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

