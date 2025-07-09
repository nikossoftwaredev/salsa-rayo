/* eslint-disable react/jsx-props-no-spreading */
import { ButtonHTMLAttributes, ReactNode } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  loading?: boolean;
  variant?: "primary" | "neutral" | "secondary" | "accent" | "ghost" | "link";
  outlined?: boolean;
}

const Button = (props: ButtonProps) => {
  const {
    className,
    children,
    loading = false,
    variant,
    outlined = true,
    ...buttonPros
  } = props;

  return (
    <button
      type="button"
      {...buttonPros}
      className={`btn ${variant ? `btn-${variant}` : ""} ${
        outlined ? "btn-outline" : "btn-active"
      } relative group overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      {/* Hover gradient overlay */}
      <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></span>
      
      {/* Content */}
      <span className="relative z-10">
        {loading ? (
          <>
            <span className="loading loading-infinity"></span>
            LOADING
          </>
        ) : (
          children
        )}
      </span>
    </button>
  );
};

export default Button;
