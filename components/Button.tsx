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
      } ${className}`}
    >
      {loading ? (
        <>
          <span className="loading loading-infinity"></span>
          LOADING
        </>
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
