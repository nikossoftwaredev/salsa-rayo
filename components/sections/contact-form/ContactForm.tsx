/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTranslations } from "next-intl";
import {
  HTMLInputTypeAttribute,
  MouseEvent,
  useCallback,
  useState,
} from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SectionTitle } from "@/components/SectionTitle";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { IoMdSend } from "react-icons/io";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa6";
import { sendContactFormEmail } from "@/server-actions/send-email";
import Toast from "@/components/Toast";
import { z } from "zod";

// Zod validation schema
const formSchema = z.object({
  firstname: z.string().min(1, "validation.firstNameRequired"),
  lastname: z.string().min(1, "validation.lastNameRequired"),
  email: z.string().email("validation.invalidEmail"),
  phone: z.string()
    .min(10, "validation.invalidPhone")
    .regex(
      /^[+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{4,12}$/,
      "validation.invalidPhone"
    ),
  message: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const initFormData = (initialMessage: string): FormData => ({
  firstname: "",
  lastname: "",
  phone: "",
  email: "",
  message: initialMessage,
});

interface InputFieldProps {
  id: string;
  dataField: keyof FormData;
  inputType: HTMLInputTypeAttribute;
  placeholder: string;
  required: boolean;
  colSpan?: number;
  icon?: React.ReactNode;
}

const inputFields: InputFieldProps[] = [
  {
    id: "firstname",
    dataField: "firstname",
    inputType: "text",
    placeholder: "firstName",
    required: true,
    icon: <FaUser className="text-primary" size={18} />,
  },
  {
    id: "lastname",
    dataField: "lastname",
    inputType: "text",
    placeholder: "lastName",
    required: true,
    icon: <FaUser className="text-primary" size={18} />,
  },
  {
    id: "email",
    dataField: "email",
    inputType: "email",
    placeholder: "email",
    required: true,
    icon: <FaEnvelope className="text-primary" size={18} />,
  },
  {
    id: "phone",
    dataField: "phone",
    inputType: "tel",
    placeholder: "phone",
    required: true,
    icon: <FaPhone className="text-primary" size={18} />,
  },
  {
    id: "message",
    dataField: "message",
    inputType: "textarea",
    placeholder: "message",
    required: false,
    colSpan: 2,
  },
];

interface ContactFormProps {
  showTextArea?: boolean;
  initialMessage?: string;
  hideTitle?: boolean;
  onSuccess?: () => void;
}

const ContactForm = ({ showTextArea = true, initialMessage = "", hideTitle = false, onSuccess }: ContactFormProps) => {
  const t = useTranslations("Contact");
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<FormData>(initFormData(initialMessage));
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [toast, setToast] = useState<{
    isVisible: boolean;
    message: string;
    type: "success" | "error";
  }>({
    isVisible: false,
    message: "",
    type: "success",
  });

  const onChangeFormData = useCallback(
    (dataField: keyof FormData) => (e: any) => {
      const value = e.target.value;
      setFormData((prev) => ({ ...prev, [dataField]: value }));
      
      // Clear error for this field when user starts typing
      if (errors[dataField]) {
        setErrors((prev) => ({ ...prev, [dataField]: undefined }));
      }
    },
    [errors]
  );

  const onSendEmail = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      
      // Validate form data
      try {
        formSchema.parse(formData);
        setErrors({});
      } catch (error) {
        if (error instanceof z.ZodError) {
          const fieldErrors: Partial<Record<keyof FormData, string>> = {};
          error.issues.forEach((err: any) => {
            if (err.path[0]) {
              // Get the translation key from the error message
              const errorKey = err.message;
              fieldErrors[err.path[0] as keyof FormData] = t(errorKey as any);
            }
          });
          setErrors(fieldErrors);
          
          // Show error toast
          setToast({
            isVisible: true,
            message: t("validation.pleaseCorrectErrors"),
            type: "error",
          });
          return;
        }
      }
      
      setLoading(true);

      try {
        const result = await sendContactFormEmail(formData);

        if (result.success) {
          // Track Facebook Pixel Lead event
          if (typeof window !== 'undefined' && (window as any).fbq) {
            (window as any).fbq('track', 'Lead', {
              value: 0,
              currency: 'EUR',
              content_name: 'Contact Form',
              content_category: 'Dance Classes',
            });
          }
          
          setToast({
            isVisible: true,
            message: result.message,
            type: "success",
          });
          setFormData(initFormData(initialMessage));
          setErrors({});
          
          // Call onSuccess callback if provided
          if (onSuccess) {
            setTimeout(() => {
              onSuccess();
            }, 1500); // Wait a bit for user to see success message
          }
        } else {
          setToast({
            isVisible: true,
            message: result.message,
            type: "error",
          });
        }
      } catch (err) {
        console.error("Error sending email:", err);
        setToast({
          isVisible: true,
          message: "An unexpected error occurred. Please try again later.",
          type: "error",
        });
      }

      setLoading(false);
    },
    [formData, t, initialMessage, onSuccess]
  );

  const disabled = inputFields.some((inputField) => {
    const { dataField, required } = inputField;
    const missingInfo = !formData[dataField];

    return required && missingInfo;
  });

  return (
    <main
      id="contact-form"
      className="flex items-center justify-center flex-col scroll-mt-20"
    >
      <Toast
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onClose={() => setToast({ ...toast, isVisible: false })}
      />
      {!hideTitle && <SectionTitle title={t("title")} isMainSection />}
      <Card className="mb-5 w-full max-w-[600px] bg-transparent border border-white/20 shadow-xl hover:bg-black/70 transition-all duration-300">
        <form>
          <div className="grid p-4 gap-6 grid-cols-1 md:grid-cols-2">
            {inputFields.filter(field => showTextArea || field.dataField !== "message").map((inputField) => {
              const {
                dataField,
                inputType,
                placeholder,
                required,
                colSpan,
                id,
              } = inputField;

              return inputType === "textarea" ? (
                <Textarea
                  key={dataField}
                  className={`col-span-1 md:col-span-2 ${errors[dataField] ? "textarea-error" : ""}`}
                  required={false}
                  rows={6}
                  autoComplete={id}
                  value={formData[dataField] as string}
                  placeholder={t(placeholder as any)}
                  onChange={onChangeFormData(dataField)}
                  name={id}
                />
              ) : (
                <div
                  key={dataField}
                  className={colSpan ? "col-span-1 md:col-span-full relative" : "relative"}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    {inputField.icon}
                  </div>
                  <Input
                    id={id}
                    className={`pl-10 ${errors[dataField] ? "input-error" : ""}`}
                    required={required}
                    type={inputType}
                    value={formData[dataField as keyof FormData]}
                    placeholder={t(placeholder as any)}
                    autoComplete={id}
                    onChange={onChangeFormData(dataField)}
                    name={id}
                  />
                  {errors[dataField] && (
                    <span className="text-xs text-error absolute -bottom-5 left-3">
                      {errors[dataField]}
                    </span>
                  )}
                </div>
              );
            })}
            <Button
              className="mt-5 col-span-1 md:col-span-2"
              onClick={onSendEmail}
              disabled={disabled || loading}
              type="submit"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    {t("sending")}
                  </>
                ) : (
                  <>
                    {t("send")}
                    <IoMdSend size={18} />
                  </>
                )}
              </span>
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
};

export default ContactForm;