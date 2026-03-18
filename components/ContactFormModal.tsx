"use client";

import ContactForm from "@/components/sections/contact-form/ContactForm";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";

interface ContactFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMessage?: string;
}

const ContactFormModal = ({
  isOpen,
  onClose,
  initialMessage = "I am interested about the summer offer",
}: ContactFormModalProps) => (
  <Dialog open={isOpen} onOpenChange={(open) => { if (!open) onClose(); }}>
    <DialogContent className="sm:max-w-[600px] px-2 pt-10 pb-2 sm:px-4 sm:pb-4 gap-0">
      <DialogTitle className="sr-only">Contact Us</DialogTitle>
      <DialogDescription className="sr-only">Send us a message</DialogDescription>
      <ContactForm
        showTextArea={false}
        initialMessage={initialMessage}
        hideTitle
        onSuccess={onClose}
      />
    </DialogContent>
  </Dialog>
);

export default ContactFormModal;
