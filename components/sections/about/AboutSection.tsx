/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Card from "@/components/Card";
import { FC } from "react";
import Image from "next/image";
import { SectionTitle } from "@/components/SectionTitle";
import { useTranslations } from "next-intl";

const AboutCard: FC<{ href: string; children: React.ReactNode; buttonText: string }> = ({
  href,
  children,
  buttonText,
}) => (
  <Card className="grid grid-cols-1 lg:grid-cols-2 justify-center md:w-3/4 p-4 leading-8 text-lg font-medium bg-base-200 shadow-xl hover:shadow-2xl transition-all duration-300">
    {children}
    <p></p>
    <a
      className="ml-auto btn btn-outline"
      href={href}
      target={href.startsWith("/") ? "_self" : "_blank"}
      rel="noreferrer"
    >
      {buttonText}
    </a>
  </Card>
);

const AboutSection: FC<{ [key: string]: any }> = () => {
  const t = useTranslations('About');
  
  return (
  <>
    <SectionTitle title={t('title')} isMainSection />
    <section
      id="about"
      className="w-full flex flex-col items-center justify-center gap-4"
    >
      <AboutCard href="/resume" buttonText={t('moreInfo')}>
        <figure className="flex flex-col items-center justify-center">
          <Image
            src="/images/instructor-anna.jpg"
            alt={t('annaImageAlt')}
            width={300}
            height={300}
            className="rounded-xl object-cover"
            loading="lazy"
          />
        </figure>
        <div className="p-3">
          <h3 className="text-2xl font-bold mb-4">{t('annaName')}</h3>
          <h4 className="text-xl text-primary mb-4">{t('annaTitle')}</h4>
          <div>
            {t('annaDescription')}
          </div>
        </div>
      </AboutCard>
      
      <AboutCard href="/resume" buttonText={t('moreInfo')}>
        <figure className="flex flex-col items-center justify-center">
          <Image
            src="/images/instructor-konstantinos.jpg"
            alt={t('konstantinosImageAlt')}
            width={300}
            height={300}
            className="rounded-xl object-cover"
            loading="lazy"
          />
        </figure>
        <div className="p-3">
          <h3 className="text-2xl font-bold mb-4">{t('konstantinosName')}</h3>
          <h4 className="text-xl text-primary mb-4">{t('konstantinosTitle')}</h4>
          <div>
            {t('konstantinosDescription')}
          </div>
        </div>
      </AboutCard>
    </section>
  </>
  );
};

export default AboutSection;
