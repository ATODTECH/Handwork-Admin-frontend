"use client"

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus } from "lucide-react";
import { JoinNetwork } from "@/components/site/join-network";


interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "What is HandworkExpert?",
    answer:
      "is a platform that connects users with skilled artisans for various services, including plumbing, electrical work, painting, carpentry, and more",
  }, {
    question: "How does it work?",
    answer: "Just signup and join the platform.",
  }, {
    question: "How do i book an artisan?",
    answer:
      "Browse the service category, view artisan profiles, and schedule a booking that suits your availability.",
  }, {
    question: "Are the artisans verified?",
    answer:
      "Yes, all artisans on our platform go through a strict verification process to ensure reliability and quality.",
  }, {
    question: "What if I’m not satisfied with the service?",
    answer:
      "You can contact our customer support team, and we’ll assist you in resolving any issues.",
  }, {
    question: "How do i sign up as an artisan?",
    answer:
      "Download the app, complete your profile, and submit the necessary verification documents to get started.",
  }, {
    question: "How do i receive payment as an artisan?",
    answer:
      "Payments are transferred directly to your registered bank account after the job is completed and approved.",
  }, {
    question: "Can i set my service rate?",
    answer:
      "Yes, artisans can set competitive rates for their services within the platform.",
  }, {
    question: "What payment method are supported?",
    answer:
      "We accept major credit/debit cards, mobile payment systems, and other secure options.",
  }, {
    question: "Is my payment information secure?",
    answer:
      "Absolutely. We use advanced encryption technology to protect your data.",
  },
];

function AccordionItem({
  item,
  isOpen,
  onToggle,
}: {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="rounded-xl px-5 bg-white">
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between py-5 text-left"
      >
        <span className="text-[1rem] 425xl:text-lg font-semibold text-primary-text">{item.question}</span>
        <motion.span
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="shrink-0 text-[#858585]"
        >
          <Plus size={18} strokeWidth={2.5} />
        </motion.span>
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <p className="pb-5 font-normal text-sm 425xl:text-[1rem] leading-relaxed text-black">
              {item.answer}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const ContentFAQIndex = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex((prev) => (prev === index ? null : index));
  };

  return (
    <section className="w-full flex flex-col items-center relative px-4 p-16 sm:px-16 xl:px-28 bg-[#FCFCFC]">
      <div className="flex flex-col w-full lg:max-w-[90%] items-center">
        <div className="flex flex-col items-center w-[90%] md:w-full my-16">
          <h3 className="font-semibold text-center text-2xl 425xl:text-3xl sm:text-4xl lg:text-[2.75rem] lg:leading-14 tracking-[2%] text-secondary-orange mb-6.25">Frequently Asked Questions</h3>
          <p className=" text-[#858585] tracking-[2%] text-center text-sm 425xl:text-[1rem] max-w-[95%] 425xl:max-w-[80%] md:max-w-[50%]">
            Have questions? Here you’ll find the answers most valued by our customers, along with access to step-by-step instructions and support.
          </p>
        </div>

        <div className="flex flex-col gap-4 w-full my-16">
          {FAQS.map((item, index) => (
            <AccordionItem
              key={item.question}
              item={item}
              isOpen={openIndex === index}
              onToggle={() => handleToggle(index)}
            />
          ))}
        </div>

        <JoinNetwork />
      </div>
    </section>
  )
}

export default ContentFAQIndex