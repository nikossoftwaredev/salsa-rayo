/* eslint-disable react/jsx-props-no-spreading */
import { DetailedHTMLProps, InputHTMLAttributes } from "react";

type TextFieldProps = DetailedHTMLProps<
  InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>;

const TextField = (props: TextFieldProps) => {
  const { className = "" } = props;

  return (
    <input {...props} className={`input input-bordered w-full placeholder:text-base-content/40 ${className}`} />
  );
};

export default TextField;
