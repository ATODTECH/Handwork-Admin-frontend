"use client"

import { useRef, useState } from "react";
import Image from "next/image";
import { FormikHelpers, useFormik } from "formik";

import { newsletter, callerIcon, emailIcon, locationIcon } from "@/assets/site";
import { JoinNetwork } from "@/components/site/join-network";

import { ContactUsType, FieldConfig, FieldName, SubscribeType } from "@/types/contact-us";
import { validationSchema, validationSubSchema } from "@/schema/validation";
import { useContact, useSubscribe } from "@/hooks/use-contact";

const FIELDS: FieldConfig[] = [
  { name: "name", label: "Name" },
  { name: "phoneNumber", label: "Phone", type: "tel" },
];

const EMAIL_FIELD: FieldConfig = { name: "email", label: "Email", type: "email" };
const MESSAGE_FIELD: FieldConfig = { name: "message", label: "Message", type: "textarea" };

function Field({
  config,
  value,
  focused,
  error,
  touched,
  onFocus,
  onBlur,
  onChange,
}: {
  config: FieldConfig;
  value: string;
  focused: boolean;
  error?: string;
  touched?: boolean;
  onFocus: () => void;
  onBlur: (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
}) {
  const active = focused || value.length > 0;
  const isTextarea = config.type === "textarea";
  const showError = touched && !!error;

  return (
    <div className="w-full">
      <fieldset
        className={`w-full rounded-xl border px-4 transition-colors ${
          showError
            ? "border-red-400"
            : focused
            ? "border-secondary-blue"
            : "border-slate-200"
        } ${isTextarea ? "pb-3": ""}`}
      >
        <legend
          className={`px-1 text-xs font-medium text-secondary-blue transition-all duration-150 
            ${showError ? "text-red-500": "text-secondary-blue"} 
            ${ active ? "ml-1 max-w-50 opacity-100": "ml-1 max-w-0 overflow-hidden opacity-0"
          }`}
        >
          {config.label}
        </legend>

        {isTextarea ? (
          <textarea
            name={config.name}
            value={value}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={active ? "": config.label}
            rows={4}
            className="w-full resize-none bg-transparent text-sm text-black placeholder:text-black focus:outline-none"
          />
        ) : (
          <input
            name={config.name}
            type={config.type ?? "text"}
            value={value}
            onFocus={onFocus}
            onBlur={onBlur}
            onChange={onChange}
            placeholder={active ? "": config.label}
            className="w-full bg-transparent py-3 text-sm text-black placeholder:text-black focus:outline-none"
          />
        )}
      </fieldset>

      {showError && (
        <p className="mt-1 pl-1 text-xs text-red-500">{error}</p>
      )}
    </div>    
  );
}



export const ContentContactIndex = () => {
  const { mutate: contactSubmit, isPending: isSavingContact } = useContact()
  const { mutate: subscribeUser, isPending: isSavingSubscribe } = useSubscribe()
  const [focusedField, setFocusedField] = useState<FieldName | null>(null);
  const subRef = useRef<HTMLInputElement>(null)
  
  const formik = useFormik<ContactUsType>({
    initialValues: {
      name: "",
      phoneNumber: "",
      email: "",
      message: "",
    },
    validationSchema,
    onSubmit: async (values: ContactUsType, { resetForm }: FormikHelpers<ContactUsType>) => {
      contactSubmit(values)
      resetForm();
    },
  });

  const subscribe = useFormik<SubscribeType>({
    initialValues: {
      email: "",
    },
    validationSchema: validationSubSchema,
    onSubmit: async (values: SubscribeType, { resetForm }: FormikHelpers<SubscribeType>) => {
      subscribeUser(values)
      if (subRef.current) subRef.current.value = ""
      resetForm()
    },
  });

  const renderField = (config: FieldConfig) => (
    <Field
      key={config.name}
      config={config}
      value={formik.values[config.name]}
      focused={focusedField === config.name}
      error={formik.errors[config.name]}
      touched={formik.touched[config.name]}
      onFocus={() => setFocusedField(config.name)}
      onBlur={(e) => {
        setFocusedField(null);
        formik.handleBlur(e);
      }}
      onChange={formik.handleChange}
    />
  );
  
  return (
    <section className="w-full flex flex-col items-center relative px-4 p-16 sm:px-16 xl:px-28">
      <div className="flex flex-col w-full lg:max-w-[90%] items-center bg-primary-white">
        <div className="flex flex-col w-[90%] md:w-full my-26">
          <h3 id="report" className="font-semibold text-center sm:text-start text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-14 tracking-[2%] text-secondary-orange mb-6.25">GET IN TOUCH</h3>
          <div className="flex flex-col items-center md:items-start md:flex-row justify-between w-full gap-15 rounded-[25px] ">
            <div className="w-full ">
              <form 
              noValidate
              onSubmit={formik.handleSubmit}>
                <div className="flex flex-col gap-x-4 sm:flex-row">
                  {FIELDS.map(renderField)}
                </div>
                {renderField(EMAIL_FIELD)}
                {renderField(MESSAGE_FIELD)}
                <button
                  type="submit"
                  disabled={formik.isSubmitting || isSavingContact || isSavingSubscribe}
                  className="w-fit rounded-xl tracking-[2%] mt-4 bg-secondary-blue px-10 py-3 text-sm font-bold text-white transition-opacity disabled:cursor-not-allowed hover:opacity-90"
                >
                  Submit
                </button>
              </form>
            </div>
            <div className="relative overflow-hidden rounded-2xl h-auto w-[90%] md:w-140 my-16 md:my-0">
              <Image
              src={newsletter}
              alt="newsletter"
              className="relative w-full h-full object-cover object-top-left"/>
              {/* change back to form */}
              <form noValidate onSubmit={subscribe.handleSubmit} className="absolute flex flex-col -bottom-6 left-1/2 -translate-1/2 w-[85%] gap-2">
                <input type="email" name="email" id="email" placeholder="Email" ref={subRef} onChange={subscribe.handleChange}
                className=" bg-primary-white outline-0 text-sm py-3 px-2 rounded-xl placeholder:text-black placeholder:text-sm" />
                <button type="submit" disabled={subscribe.isSubmitting || isSavingSubscribe || isSavingContact} className=" w-full rounded-xl tracking-[2%] bg-secondary-blue px-10 py-3 text-sm font-bold text-white transition-opacity hover:opacity-90 cursor-pointer disabled:cursor-not-allowed">Subscribe</button>
              </form>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:grid items-center justify-center sm:grid-cols-2 lg:grid-cols-3 gap-6.25 lg:gap-11.25 w-full 425xl:w-auto max-w-[90%] md:max-w-full text-[1rem] my-16">
          <div className="flex flex-col justify-between h-full max-h-120.5 w-full max-w-75 lg:max-w-130.75 py-8.5 425xl:py-10.5 px-5 text-primary-white rounded-[15px] bg-secondary-blue">
            <div className="flex self-center items-center w-fit mb-6 lg:mb-10.5 p-2 gap-4">
              <div className=" h-auto w-12 ">
                <Image src={callerIcon} alt="contact us" className="w-full h-full object-cover" />
              </div>
              <span className=" text-[1rem] font-bold break-all">+23430601026</span>
            </div>
            <div className="flex flex-col h-full gap-2">
              <p className=" font-normal text-sm ">
                Monday to Friday: 8:00am - 5:30pm
              </p>
              <p className=" font-normal text-sm ">
                Saturdays: 8:00am - 5:30pm
              </p>
            </div>
          </div>
          <div className="flex flex-col justify-between items-center h-full max-h-120.5 w-full max-w-75 lg:max-w-130.75 py-8.5 425xl:py-10.5 px-5 text-primary-white rounded-[15px] bg-[#B9C0DB] ">
            <div className="flex items-center w-fit mb-6 lg:mb-10.5 p-2 gap-4">
              <div className=" h-auto w-12 ">
                <Image src={emailIcon} alt="email" className="w-full h-full object-cover" />
              </div>
              <span className=" text-[1rem] font-bold break-all">support@handworkexpert.com</span>
            </div>
            <p className=" font-normal text-sm">
              Have questions or need assistance? Reach out to us, we’re here to help.
            </p>
          </div>
          <div className="flex flex-col justify-between items-center h-full max-h-120.5 w-full max-w-75 lg:max-w-130.75 py-8.5 425xl:py-10.5 px-5 text-primary-white rounded-[15px] sm:col-span-2 sm:mx-auto lg:col-span-1 lg:mx-0 bg-[#5627194D] ">
            <div className="flex items-center w-fit mb-6 lg:mb-10.5 p-2 gap-4">
              <div className=" h-auto w-12 ">
                <Image src={locationIcon} alt="location" className="w-full h-full object-cover" />
              </div>
              <span className=" text-[1rem] font-bold break-all">Location: Lagos. NG</span>
            </div>
            <p className=" font-normal text-sm">
              No 40, Babs-williams close, off san bus stop. Lekki
            </p>
          </div>
        </div>

        {/* map was here previously */}

        <JoinNetwork />
      </div>
    </section>
  )
}
