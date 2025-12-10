import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: "primary" | "secondary" | "danger" | "success";
}

export default function Button({
  children,
  variant = "primary",
  className = "",
  disabled,
  ...props
}: ButtonProps) {
  const baseClasses = `
    px-6 py-3 
    rounded-lg 
    font-semibold 
    text-white 
    transition-all 
    duration-200 
    disabled:opacity-50 
    disabled:cursor-not-allowed
    focus:outline-none 
    focus:ring-2 
    focus:ring-offset-2
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-[#6a00ff] to-[#9a4dff] 
      hover:from-[#7a10ff] hover:to-[#aa5dff] 
      hover:scale-105 
      hover:shadow-lg 
      hover:shadow-purple-500/50
      focus:ring-purple-500
    `,
    secondary: `
      bg-gradient-to-r from-[#4a00b5] to-[#6a00ff] 
      hover:from-[#5a00c5] hover:to-[#7a10ff] 
      hover:scale-105 
      hover:shadow-lg 
      hover:shadow-purple-500/50
      focus:ring-purple-500
    `,
    danger: `
      bg-gradient-to-r from-[#ff0066] to-[#ff3366] 
      hover:from-[#ff1066] hover:to-[#ff4376] 
      hover:scale-105 
      hover:shadow-lg 
      hover:shadow-red-500/50
      focus:ring-red-500
    `,
    success: `
      bg-gradient-to-r from-[#00ff88] to-[#00cc66] 
      hover:from-[#10ff98] hover:to-[#10dd76] 
      hover:scale-105 
      hover:shadow-lg 
      hover:shadow-green-500/50
      focus:ring-green-500
    `,
  };

  return (
    <button
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      disabled={disabled}
      {...props}
    >
      {children}
    </button>
  );
}

