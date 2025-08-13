"use client";

import { useTranslations } from "next-intl";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import ContactFormModal from "@/components/ContactFormModal";

interface PackageCardProps {
  originalPrice?: string;
  discountedPrice?: string;
  onClaim?: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  originalPrice = "75",
  discountedPrice = "60",
  onClaim,
}) => {
  const t = useTranslations("Package");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClaim = () => {
    if (onClaim) {
      onClaim();
    } else {
      setIsModalOpen(true);
    }
  };

  const features = [
    t("totalClasses"),
    t("classesPerWeek"),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-sm mx-auto"
    >
      <Card className="relative overflow-hidden bg-gradient-to-br from-base-300 via-base-200 to-base-300 border-2 border-primary/30 hover:border-primary/60 transition-all duration-500 hover:shadow-2xl hover:shadow-primary/30 hover:scale-[1.02]">
        {/* Valid Until Badge */}
        <div className="absolute top-0 right-0 z-10">
          <div className="relative">
            <div className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-2 rounded-bl-2xl animate-pulse-slow">
              {t("validUntilBadge")}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-lg opacity-50"></div>
          </div>
        </div>

        <div className="p-8 space-y-6">
          {/* Title */}
          <div className="text-center pt-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {t("summerOffer")}
            </h3>
            <p className="text-sm text-white/60 mt-1">
              {t("forEveryone")}
            </p>
          </div>

          {/* Price Section */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-3">
              <span className="text-2xl text-white/50 line-through">
                {originalPrice}€
              </span>
              <span className="text-5xl font-bold text-white">
                {discountedPrice}€
              </span>
            </div>
          </div>

          {/* Features List */}
          <div className="space-y-3">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="flex items-start gap-3 group"
              >
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-primary/20 to-accent/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-accent/30 transition-all duration-300">
                  <FaBolt className="text-primary text-sm group-hover:text-accent transition-colors duration-300" />
                </div>
                <span className="text-white/80 text-sm leading-relaxed">
                  {feature}
                </span>
              </motion.div>
            ))}
            
            {/* Redeemable note with asterisk */}
            <div className="flex items-start gap-3 mt-4 pt-2 border-t border-white/10">
              <span className="text-white/50 text-xs italic">
                {t("redeemableUntil")}
              </span>
            </div>
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-primary to-accent text-white border-none hover:shadow-xl hover:shadow-primary/50 font-bold text-base md:text-lg py-3"
              outlined={false}
            >
              <span className="flex items-center justify-center gap-2">
                {t("claimOffer")}
              </span>
            </Button>
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-accent/10 rounded-full blur-3xl"></div>
      </Card>
      
      <ContactFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        initialMessage="I am interested about the summer offer"
      />
    </motion.div>
  );
};

export default PackageCard;