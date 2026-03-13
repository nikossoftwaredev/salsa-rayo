"use client";

import { useTranslations } from "next-intl";
import { Card } from "@/components/ui/card";
import { FaBolt } from "react-icons/fa";
import { IoCardOutline, IoChatbubblesOutline, IoReloadOutline, IoChevronDown } from "react-icons/io5";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface PackageCardProps {
  title: string;
  price: string;
  numberOfLessons: number;
  isMostPopular: boolean;
  isStudentDiscount?: boolean;
  isLoading?: boolean;
  onPayOnline: () => void;
  onContactUs: () => void;
}

const PackageCard = ({
  title,
  price,
  numberOfLessons,
  isMostPopular,
  isStudentDiscount = false,
  isLoading = false,
  onPayOnline,
  onContactUs,
}: PackageCardProps) => {
  const t = useTranslations("Package");

  const lessonsPerMonth = numberOfLessons * 4;

  const displayPrice = isStudentDiscount
    ? Math.floor(parseFloat(price) * 0.9).toString()
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
      <div className="relative">
        {/* Most Popular Badge - floating pill on card border */}
        {isMostPopular && (
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-10">
            <div className="backdrop-blur-sm bg-brand-pink/90 border border-brand-pink/50 rounded-full px-4 py-1 shadow-lg shadow-brand-pink/30">
              <span className="text-xs font-bold text-white whitespace-nowrap">{t("mostPopular")}</span>
            </div>
          </div>
        )}

        <Card className={`relative overflow-hidden border-2 ${isMostPopular ? 'border-brand-pink hover:shadow-[0_20px_50px_rgba(255,0,255,0.4)] hover:shadow-brand-pink/50' : 'border-primary/50 hover:shadow-[0_20px_50px_rgba(139,92,246,0.3)] hover:shadow-primary/40'} transition-all duration-500`}>
        <div className="p-8 space-y-6">
          {/* Title */}
          <div className="text-center pt-2">
            <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-brand-pink bg-clip-text text-transparent">
              {title}
            </h3>
          </div>

          {/* Price Section */}
          <div className="text-center py-4">
            <div className="flex items-center justify-center gap-3">
              {isStudentDiscount && (
                <span className="text-2xl text-muted-foreground line-through">
                  {price}€
                </span>
              )}
              <span className="text-5xl font-bold text-foreground">
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
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-gradient-to-r from-primary/20 to-brand-pink/20 flex items-center justify-center group-hover:from-primary/30 group-hover:to-brand-pink/30 transition-all duration-300">
                  <FaBolt className="text-primary text-sm group-hover:text-brand-pink transition-colors duration-300" />
                </div>
                <span className="text-foreground/80 text-sm leading-relaxed">
                  {feature}
                </span>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <div className="pt-4">
            {isLoading ? (
              <div className="h-11 w-full rounded-lg bg-gradient-to-r from-primary to-brand-pink flex items-center justify-center gap-2 text-white font-bold opacity-80">
                <IoReloadOutline size={18} className="animate-spin" />
                {t("getStarted")}
              </div>
            ) : (
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <button className="group relative w-full h-11 rounded-lg bg-gradient-to-r from-primary to-brand-pink text-white font-bold text-base flex items-center overflow-hidden cursor-pointer hover:shadow-lg hover:shadow-primary/25 hover:scale-[1.03] transition-all duration-200 outline-none focus-visible:ring-2 focus-visible:ring-ring">
                    <span className="flex-1 text-center">{t("getStarted")}</span>
                    <span className="flex items-center justify-center w-10 h-full border-l border-white/20 group-hover:bg-white/10 transition-colors">
                      <IoChevronDown size={16} />
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={6} className="w-64 p-1.5">
                  <DropdownMenuItem onClick={onPayOnline} className="cursor-pointer gap-3 px-3 py-3 rounded-md">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center">
                      <IoCardOutline size={18} className="text-primary" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{t("payOnline")}</span>
                      <span className="text-xs text-muted-foreground">{t("payOnlineDesc")}</span>
                    </div>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={onContactUs} className="cursor-pointer gap-3 px-3 py-3 rounded-md">
                    <div className="flex-shrink-0 w-9 h-9 rounded-full bg-brand-pink/10 flex items-center justify-center">
                      <IoChatbubblesOutline size={18} className="text-brand-pink" />
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-sm">{t("contactUs")}</span>
                      <span className="text-xs text-muted-foreground">{t("contactUsDesc")}</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        {/* Background decoration */}
        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
        <div className="absolute -top-20 -left-20 w-40 h-40 bg-brand-pink/10 rounded-full blur-3xl"></div>
      </Card>
      </div>
    </motion.div>
  );
};

export default PackageCard;
