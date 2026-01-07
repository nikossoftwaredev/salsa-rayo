"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaCheckCircle, FaExclamationCircle, FaTimes } from "react-icons/fa";

interface ToastProps {
  message: string;
  type: "success" | "error";
  isVisible: boolean;
  onClose: () => void;
  duration?: number;
}

const Toast: React.FC<ToastProps> = ({
  message,
  type,
  isVisible,
  onClose,
  duration = 5000,
}) => {
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  const bgColor = type === "success" ? "bg-primary" : "bg-destructive";
  const Icon = type === "success" ? FaCheckCircle : FaExclamationCircle;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: -50, x: "-50%" }}
          className={`fixed top-24 left-1/2 transform -translate-x-1/2 z-50 ${bgColor} text-primary-foreground px-6 py-4 rounded-lg shadow-xl flex items-center gap-3 min-w-[300px] max-w-[90vw]`}
        >
          <Icon className="text-2xl flex-shrink-0" />
          <p className="flex-grow text-sm md:text-base">{message}</p>
          <button
            onClick={onClose}
            className="flex-shrink-0 hover:opacity-70 transition-opacity"
            aria-label="Close notification"
          >
            <FaTimes className="text-lg" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Toast;