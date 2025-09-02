"use client";

import { useEffect } from "react";
import ContactForm from "@/components/sections/contact-form/ContactForm";
import { motion, AnimatePresence } from "framer-motion";
import { IoMdClose } from "react-icons/io";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const ContactFormModal = ({ isOpen, onClose, initialMessage = "I am interested about the summer offer" }: ContactFormModalProps) => {

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50"
            onClick={onClose}
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, type: "spring", stiffness: 300, damping: 30 }}
            className="fixed inset-0 flex items-center justify-center z-50 p-4"
            onClick={onClose}
          >
            <div 
              className="relative max-w-[600px] w-full max-h-[90vh] overflow-y-auto bg-gradient-to-br from-primary/20 via-base-100 to-accent/20 backdrop-blur-lg rounded-2xl shadow-2xl border border-white/20"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={onClose}
                className="absolute top-4 right-4 z-10 btn btn-sm btn-circle btn-ghost text-white hover:bg-white/10"
                aria-label="Close modal"
              >
                <IoMdClose size={20} />
              </button>
              
              <div className="p-6">
                
                <ContactForm 
                  showTextArea={false}
                  initialMessage={initialMessage}
                  hideTitle={true}
                  onSuccess={onClose}
                />
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ContactFormModal;