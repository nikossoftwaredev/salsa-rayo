/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/ui/card";
import { FC, useState } from "react";
import Image from "next/image";
import { SectionTitle } from "@/components/SectionTitle";
import { useTranslations } from "next-intl";
import Logo from "@/components/Logo";

const AboutCard: FC<{
  children: React.ReactNode;
}> = ({ children }) => (
  <Card className="grid grid-cols-1 lg:grid-cols-2 justify-center md:w-3/4 p-4 leading-8 text-lg font-medium hover:shadow-2xl transition-all duration-300 border border-border text-muted-foreground">
    {children}
  </Card>
);

const InstructorDescription: FC<{
  description: string;
  name: string;
}> = ({ description, name }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const paragraphs = description.split('\n\n');
  const firstParagraph = paragraphs[0];
  const remainingParagraphs = paragraphs.slice(1).join('\n\n');

  return (
    <>
      {/* Desktop: Show full description */}
      <div className="hidden md:block whitespace-pre-line">{description}</div>
      
      {/* Mobile: Show accordion */}
      <div className="md:hidden">
        <div className="whitespace-pre-line">{firstParagraph}</div>
        {paragraphs.length > 1 && !isExpanded && (
          <div className="mt-4">
            <button
              onClick={() => setIsExpanded(true)}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-sm border border-primary text-primary rounded-md hover:bg-primary hover:text-white transition-colors duration-200"
              aria-label={`Show more about ${name}`}
            >
              <span>Δείτε περισσότερα</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
        )}
        {isExpanded && paragraphs.length > 1 && (
          <div className="whitespace-pre-line mt-4 animate-fadeIn">
            {remainingParagraphs}
          </div>
        )}
      </div>
    </>
  );
};

const AboutSection: FC<{ [key: string]: any }> = () => {
  const t = useTranslations("About");

  return (
    <div id="about" className="scroll-mt-20">
      <SectionTitle title={t("title")} isMainSection />
      <section
        className="w-full flex flex-col items-center justify-center gap-4"
      >
        {/* School Card */}
        <AboutCard>
          <div className="flex flex-col items-center justify-center p-8 md:p-12">
            <div className="pointer-events-none">
              <div className="block md:hidden">
                <Logo size="xxl" />
              </div>
              <div className="hidden md:block">
                <Logo size="xxxl" />
              </div>
            </div>
          </div>
          <div className="p-3">
            <h3 className="text-2xl font-bold mb-4 text-foreground">{t("schoolName")}</h3>
            <InstructorDescription 
              description={t("schoolDescription")} 
              name={t("schoolName")}
            />
          </div>
        </AboutCard>

        {/* Anna Card */}
        <AboutCard>
          <figure className="flex flex-col items-center justify-center p-4">
            <Image
              src="/images/instructor-anna.jpg"
              alt={t("annaImageAlt")}
              width={300}
              height={300}
              className="rounded-xl object-cover"
              loading="lazy"
            />
          </figure>
          <div className="p-3">
            <h3 className="text-2xl font-bold mb-4 text-foreground">{t("annaName")}</h3>
            <InstructorDescription 
              description={t("annaDescription")} 
              name={t("annaName")}
            />
          </div>
        </AboutCard>

        {/* Konstantinos Card */}
        <AboutCard>
          <figure className="flex flex-col items-center justify-center p-4">
            <Image
              src="/images/instructor-konstantinos.jpg"
              alt={t("konstantinosImageAlt")}
              width={300}
              height={300}
              className="rounded-xl object-cover"
              loading="lazy"
            />
          </figure>
          <div className="p-3">
            <h3 className="text-2xl font-bold mb-4 text-foreground">{t("konstantinosName")}</h3>
            <InstructorDescription 
              description={t("konstantinosDescription")} 
              name={t("konstantinosName")}
            />
          </div>
        </AboutCard>
      </section>
    </div>
  );
};

export default AboutSection;