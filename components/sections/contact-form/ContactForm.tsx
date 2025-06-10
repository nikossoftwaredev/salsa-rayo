/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import {
  HTMLInputTypeAttribute,
  MouseEvent,
  useCallback,
  useState,
} from "react";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { SectionTitle } from "@/components/SectionTitle";
import TextArea from "./TextArea";
import TextField from "./TextField";
import { IoMdSend, IoMdMail, IoMdPerson, IoMdCall } from "react-icons/io";

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
    placeholder: "First Name",
    required: true,
    icon: <IoMdPerson className="text-primary" />,
  },
  {
    id: "lastname",
    dataField: "lastname",
    inputType: "text",
    placeholder: "Last Name",
    required: true,
    icon: <IoMdPerson className="text-primary" />,
  },
  {
    id: "email",
    dataField: "email",
    inputType: "email",
    placeholder: "Email",
    required: true,
    icon: <IoMdMail className="text-accent" />,
  },
  {
    id: "phone",
    dataField: "phone",
    inputType: "tel",
    placeholder: "Phone",
    required: true,
    icon: <IoMdCall className="text-accent" />,
  },
  {
    id: "message",
    dataField: "message",
    inputType: "textarea",
    placeholder: "Type your message...",
    required: false,
    colSpan: 2,
  },
];

const ContactForm = () => {
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
      <SectionTitle title="CONTACT US" isMainSection />
      <Card className="mb-5 w-full max-w-[600px]">
        <form>
          <div className="grid p-4 gap-2 sm:grid-cols-1 md:grid-cols-2">
            {inputFields.map((inputField) => {
              const {
                dataField,
                inputType,
                placeholder,
                required,
                colSpan,
                id,
                icon,
              } = inputField;

              return inputType === "textarea" ? (
                <TextArea
                  key={dataField}
                  className={"col-span-2"}
                  required={false}
                  rows={4}
                  autoComplete={id}
                  value={formData.info as string}
                  placeholder={placeholder}
                  onChange={onChangeFormData("info")}
                  name={id}
                />
              ) : (
                <div
                  key={dataField}
                  className={`${colSpan ? "col-span-full" : ""} relative`}
                >
                  {icon && (
                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2 z-10">
                      {icon}
                    </div>
                  )}
                  <TextField
                    id={id}
                    className={`w-full ${icon ? "pl-10" : "pl-4"}`}
                    required={required}
                    type={inputType}
                    value={formData[dataField as string]}
                    placeholder={placeholder}
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
              Send <IoMdSend />
            </Button>
          </div>
        </form>
      </Card>
    </main>
  );
};

export default ContactForm;
