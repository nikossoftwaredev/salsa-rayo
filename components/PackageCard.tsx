"use client";

import { useTranslations } from "next-intl";
import Card from "@/components/Card";
import Button from "@/components/Button";
import { FaBolt } from "react-icons/fa";
import { motion } from "framer-motion";
import { useState } from "react";
import ContactFormModal from "@/components/ContactFormModal";

interface PackageCardProps {
  title: string;
  price: string;
  numberOfLessons: number;
  isMostPopular: boolean;
  isStudentDiscount?: boolean;
  onClaim?: () => void;
}

const PackageCard: React.FC<PackageCardProps> = ({
  title,
  price,
  numberOfLessons,
  isMostPopular,
  isStudentDiscount = false,
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

  const lessonsPerMonth = numberOfLessons * 4;
  
  const displayPrice = isStudentDiscount 
    ? (parseFloat(price) * 0.9).toFixed(0)
    : price;
  
  const features = [
    t("hoursPerMonth", { hours: lessonsPerMonth }),
    t("classesPerWeek", { classes: numberOfLessons }),
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="w-full max-w-sm mx-auto"
    >
      <Card className={`relative overflow-hidden bg-gradient-to-br from-base-300 via-base-200 to-base-300 border-2 ${isMostPopular ? 'border-primary hover:border-accent hover:shadow-2xl hover:shadow-accent/50' : 'border-primary/30 hover:border-primary/60 hover:shadow-2xl hover:shadow-primary/30'} transition-all duration-500 hover:scale-[1.02]`}>
        {/* Most Popular Badge */}
        {isMostPopular && (
          <div className="absolute top-0 right-0 z-10">
            <div className="relative">
              <div className="bg-gradient-to-r from-primary to-accent text-white text-xs font-bold px-4 py-2 rounded-bl-2xl animate-pulse-slow">
                {t("mostPopular")}
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent blur-lg opacity-50"></div>
            </div>
          </div>
        )}

        <div className="p-8 space-y-6">
          {/* Title */}
          <div className="text-center pt-4">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              {title}
            </h3>
          </div>

          {/* Price Section */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-3">
              {isStudentDiscount && (
                <span className="text-2xl text-white/50 line-through">
                  {price}€
                </span>
              )}
              <span className="text-5xl font-bold text-white">
                {displayPrice}€
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
          </div>

          {/* CTA Button */}
          <div className="pt-4">
            <Button
              onClick={handleClaim}
              className="w-full bg-gradient-to-r from-primary to-accent text-white border-none hover:shadow-xl hover:shadow-primary/50 font-bold text-base md:text-lg py-3"
              outlined={false}
            >
              <span className="flex items-center justify-center gap-2">
                {t("getStarted")}
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
        initialMessage={`I am interested in the ${title} (${numberOfLessons} classes per week)${isStudentDiscount ? ' with student discount' : ''}`}
      />
    </motion.div>
  );
};

export default PackageCard;