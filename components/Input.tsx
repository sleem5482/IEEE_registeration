import React from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  dir?: "ltr" | "rtl";
}

export default function Input({ label, error, dir = "ltr", className = "", ...props }: InputProps) {
  return (
    <div className="w-full">
      <label className="block text-sm font-medium text-white/90 mb-2">{label}</label>
      <input
        dir={dir}
        className={`
          w-full px-4 py-3 
          bg-white/5 
          border ${error ? "border-red-400" : "border-white/20"} 
          rounded-lg 
          text-white 
          placeholder:text-white/40 
          focus:outline-none 
          focus:ring-2 
          focus:ring-purple-500/50 
          focus:border-purple-400 
          transition-all
          backdrop-blur-sm
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="mt-1 text-sm text-red-400 flex items-center gap-1">
          <span>⚠</span>
          {error}
        </p>
      )}
    </div>
  );
}

