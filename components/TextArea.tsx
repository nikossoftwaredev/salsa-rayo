/* eslint-disable react/jsx-props-no-spreading */
import { DetailedHTMLProps, TextareaHTMLAttributes } from "react";

type TextFieldProps = DetailedHTMLProps<
  TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

const TextArea = (props: TextFieldProps) => {
  const { className } = props;

  return (
    <textarea
      {...props}
      className={`textarea textarea-bordered ${className}`}
    />
  );
};

export default TextArea;
