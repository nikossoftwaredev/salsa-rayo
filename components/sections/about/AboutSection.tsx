/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { Card } from "@/components/ui/card";
import { FC, useState } from "react";
import Image from "next/image";
import { SectionTitle } from "@/components/SectionTitle";
import { useTranslations } from "next-intl";
import Logo from "@/components/Logo";
import { IoCalendarOutline, IoTrophyOutline, IoSchoolOutline, IoHeartOutline } from "react-icons/io5";
import { MdExpandMore, MdExpandLess } from "react-icons/md";

// Highlight component for key stats/info
const Highlight: FC<{ icon: React.ReactNode; label: string; value: string }> = ({ icon, label, value }) => (
  <div className="flex items-center gap-3 p-3 bg-primary/5 rounded-lg">
    <div className="text-primary">{icon}</div>
    <div>
      <p className="text-xs text-muted-foreground">{label}</p>
      <p className="font-semibold text-foreground">{value}</p>
    </div>
  </div>
);

// Improved card component with better styling
const AboutCard: FC<{
  children: React.ReactNode;
  isSchool?: boolean;
}> = ({ children, isSchool }) => (
  <Card className={`
    overflow-hidden transition-all duration-300
    hover:shadow-xl hover:-translate-y-1
    border-2 border-border/50 hover:border-primary/30
    ${isSchool ? 'bg-gradient-to-br from-primary/5 to-transparent' : ''}
  `}>
    {children}
  </Card>
);

// Improved instructor description with better readability
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
      {/* Desktop: Show full description with better formatting */}
      <div className="hidden md:block space-y-4">
        {paragraphs.map((paragraph, index) => (
          <p key={index} className="text-foreground/90 leading-relaxed">
            {paragraph}
          </p>
        ))}
      </div>
      
      {/* Mobile: Show accordion */}
      <div className="md:hidden">
        <p className="text-foreground/90 leading-relaxed">{firstParagraph}</p>
        {paragraphs.length > 1 && (
          <div className="mt-4">
            {!isExpanded ? (
              <button
                onClick={() => setIsExpanded(true)}
                className="flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
                aria-label={`Show more about ${name}`}
              >
                <span>Read more</span>
                <MdExpandMore className="w-5 h-5" />
              </button>
            ) : (
              <>
                <div className="mt-4 space-y-4 animate-fadeIn">
                  {remainingParagraphs.split('\n\n').map((paragraph, index) => (
                    <p key={index} className="text-foreground/90 leading-relaxed">
                      {paragraph}
                    </p>
                  ))}
                </div>
                <button
                  onClick={() => setIsExpanded(false)}
                  className="mt-4 flex items-center gap-2 text-primary font-medium hover:text-primary/80 transition-colors"
                  aria-label="Show less"
                >
                  <span>Show less</span>
                  <MdExpandLess className="w-5 h-5" />
                </button>
              </>
            )}
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
      <section className="w-full max-w-6xl mx-auto px-4">
        <div className="space-y-8">
          {/* School Card - Now full width with better layout */}
          <AboutCard isSchool>
            <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-6 lg:p-8">
              {/* Logo and highlights section */}
              <div className="lg:col-span-2 space-y-6">
                <div className="flex justify-center lg:justify-start">
                  <Logo size="xxl" />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Highlight
                    icon={<IoCalendarOutline size={20} />}
                    label="Founded"
                    value="2025"
                  />
                  <Highlight
                    icon={<IoSchoolOutline size={20} />}
                    label="Location"
                    value="Agios Dimitrios"
                  />
                  <Highlight
                    icon={<IoTrophyOutline size={20} />}
                    label="Awards"
                    value="Multiple"
                  />
                  <Highlight
                    icon={<IoHeartOutline size={20} />}
                    label="Passion"
                    value="100%"
                  />
                </div>
              </div>
              
              {/* School description */}
              <div className="lg:col-span-3 space-y-4">
                <div>
                  <h3 className="text-3xl font-bold text-foreground mb-2">{t("schoolName")}</h3>
                  <p className="text-primary font-medium">Dance School</p>
                </div>
                <div className="prose prose-lg max-w-none">
                  <InstructorDescription 
                    description={t("schoolDescription")} 
                    name={t("schoolName")}
                  />
                </div>
              </div>
            </div>
          </AboutCard>

          {/* Instructors Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Anna Card */}
            <AboutCard>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src="/images/instructor-anna.jpg"
                      alt={t("annaImageAlt")}
                      fill
                      className="rounded-full object-cover object-[center_30%]"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{t("annaName")}</h3>
                    <p className="text-primary font-medium">{t("annaTitle")}</p>
                  </div>
                </div>
                <InstructorDescription 
                  description={t("annaDescription")} 
                  name={t("annaName")}
                />
              </div>
            </AboutCard>

            {/* Konstantinos Card */}
            <AboutCard>
              <div className="p-6 space-y-6">
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src="/images/instructor-konstantinos.jpg"
                      alt={t("konstantinosImageAlt")}
                      fill
                      className="rounded-full object-cover object-[center_30%]"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-foreground">{t("konstantinosName")}</h3>
                    <p className="text-primary font-medium">{t("konstantinosTitle")}</p>
                  </div>
                </div>
                <InstructorDescription 
                  description={t("konstantinosDescription")} 
                  name={t("konstantinosName")}
                />
              </div>
            </AboutCard>
          </div>
        </div>
      </section>
    </div>
  );
};

export default AboutSection;