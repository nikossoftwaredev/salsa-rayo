/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useTranslations } from "next-intl";
import {
  HTMLInputTypeAttribute,
  MouseEvent,
  useCallback,
  useState,
} from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { SectionTitle } from "@/components/SectionTitle";
import TextArea from "@/components/TextArea";
import TextField from "@/components/TextField";
import { IoMdSend } from "react-icons/io";
import { FaUser, FaPhone, FaEnvelope } from "react-icons/fa6";
import Lightning from "@/components/react-bits/Backgrounds/Lightning/Lightning";

const initFormData = {
  firstname: "",
  lastname: "",
  phone: "",
  email: "",
  message: "",
};

interface InputFieldProps {
  id: string;
  dataField: keyof typeof initFormData;
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

const ContactForm = () => {
  const t = useTranslations('Contact');
  const [loading, setLoading] = useState<boolean>(false);
  const [formData, setFormData] = useState<Record<string, any>>(initFormData);

  const onChangeFormData = useCallback(
    (dataField: string) => (e: any) => {
      setFormData((prev) => ({ ...prev, [dataField]: e.target.value }));
    },
    []
  );

  const onSendEmail = useCallback(
    async (e: MouseEvent<HTMLElement>) => {
      e.preventDefault();
      setLoading(true);

      try {
        await fetch("/api/send-mail", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            formData,
          }),
        });
        setFormData(initFormData);
      } catch (err) {
        console.log(err);
      }

      setLoading(false);
    },
    [formData]
  );

  const disabled = inputFields.some((inputField) => {
    const { dataField, required } = inputField;
    const missingInfo = !formData[dataField];

    return required && missingInfo;
  });

  return (
    <main
      id="contact-form"
      className="flex items-center justify-center flex-col"
    >
      <SectionTitle title={t('title')} isMainSection />
      <Card className="mb-5 w-full max-w-[600px] bg-transparent border border-white/20 shadow-xl hover:bg-black/70 transition-all duration-300 relative overflow-hidden">
        {/* Lightning Effect inside the card */}
        <div className="absolute inset-0 -z-10 opacity-30">
          <Lightning
            hue={280}
            xOffset={0}
            speed={0.3}
            intensity={0.5}
            size={0.6}
          />
        </div>
        <form className="relative z-10">
          <div className="grid p-4 gap-2 sm:grid-cols-1 md:grid-cols-2">
            {inputFields.map((inputField) => {
              const {
                dataField,
                inputType,
                placeholder,
                required,
                colSpan,
                id,
              } = inputField;

              return inputType === "textarea" ? (
                <TextArea
                  key={dataField}
                  className={"col-span-2"}
                  required={false}
                  rows={4}
                  autoComplete={id}
                  value={formData[dataField] as string}
                  placeholder={t(placeholder as any)}
                  onChange={onChangeFormData(dataField)}
                  name={id}
                />
              ) : (
                <div
                  key={dataField}
                  className={colSpan ? "col-span-full relative" : "relative"}
                >
                  <div className="absolute left-3 top-1/2 -translate-y-1/2 z-10">
                    {inputField.icon}
                  </div>
                  <TextField
                    id={id}
                    className="pl-10"
                    required={required}
                    type={inputType}
                    value={formData[dataField as string]}
                    placeholder={t(placeholder as any)}
                    autoComplete={id}
                    onChange={onChangeFormData(dataField)}
                    name={id}
                  />
                </div>
              );
            })}
            <Button
              className="mt-5 col-span-2"
              onClick={onSendEmail}
              disabled={disabled}
              loading={loading}
              type="submit"
            >
              <span className="flex items-center gap-2">
                {t('send')}
                <IoMdSend size={18} />
              </span>
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
};

export default ContactForm;
