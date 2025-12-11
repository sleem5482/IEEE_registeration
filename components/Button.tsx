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
  isLoading,
  ...props
}: ButtonProps & { isLoading?: boolean }) {
  // Dynamic class generation based on conditions
  const getBaseClasses = () => {
    let classes = "px-6 py-3 rounded-lg font-semibold text-white transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2";
    
    if (disabled || isLoading) {
      classes += " opacity-60 cursor-not-allowed";
    } else {
       classes += " hover:scale-105 hover:shadow-lg";
    }
    
    return classes;
  };

  const getVariantClasses = () => {
    switch (variant) {
      case "primary":
        return "bg-gradient-to-r from-[#6a00ff] to-[#9a4dff] hover:from-[#7a10ff] hover:to-[#aa5dff] focus:ring-purple-500 shadow-purple-500/50";
      case "secondary":
        return "bg-gradient-to-r from-[#4a00b5] to-[#6a00ff] hover:from-[#5a00c5] hover:to-[#7a10ff] focus:ring-purple-500 shadow-purple-500/50";
      case "danger":
        return "bg-gradient-to-r from-[#ff0066] to-[#ff3366] hover:from-[#ff1066] hover:to-[#ff4376] focus:ring-red-500 shadow-red-500/50";
      case "success":
        return "bg-gradient-to-r from-[#00ff88] to-[#00cc66] hover:from-[#10ff98] hover:to-[#10dd76] focus:ring-green-500 shadow-green-500/50";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <button
      className={`${getBaseClasses()} ${getVariantClasses()} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      <div className="flex items-center justify-center gap-2">
        {isLoading && (
          <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        )}
        {children}
      </div>
    </button>
  );
}

