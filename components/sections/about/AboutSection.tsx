/* eslint-disable @typescript-eslint/no-explicit-any */
import Card from "@/components/Card";
import { FC } from "react";
import Image from "next/image";
import { SectionTitle } from "@/components/SectionTitle";

const AboutCard: FC<{ href: string; children: React.ReactNode }> = ({
  href,
  children,
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
      ΠΕΡΙΣΣΟΤΕΡΑ
    </a>
  </Card>
);

const AboutSection: FC<{ [key: string]: any }> = () => (
  <>
    <SectionTitle title="ABOUT US" isMainSection />
    <section
      id="about"
      className="w-full flex flex-col items-center justify-center gap-4"
    >
      <AboutCard href="/resume">
        <figure className="flex flex-col items-center justify-center">
          <Image
            src="/images/instructor-anna.jpg"
            alt="anna-lontou"
            width={300}
            height={300}
            className="rounded-xl object-cover"
            loading="lazy"
          />
        </figure>
        <div className="p-3">
          <h3 className="text-2xl font-bold mb-4">Anna Lontou</h3>
          <h4 className="text-xl text-primary mb-4">Lead Dance Instructor</h4>
          <div>
            Anna Lontou is a passionate and experienced salsa dance instructor who brings energy and expertise to every class. With over a decade of teaching experience, Anna specializes in Latin dance styles including Salsa, Bachata, and Merengue.
            <br /><br />
            Her dynamic teaching approach combines technical precision with the joy of dance, making classes accessible for beginners while challenging experienced dancers. Anna believes that dance is not just about steps, but about expression, connection, and building confidence through movement.
          </div>
        </div>
      </AboutCard>
      
      <AboutCard href="/resume">
        <figure className="flex flex-col items-center justify-center">
          <Image
            src="/images/instructor-konstantinos.jpg"
            alt="konstantinos-bitsis"
            width={300}
            height={300}
            className="rounded-xl object-cover"
            loading="lazy"
          />
        </figure>
        <div className="p-3">
          <h3 className="text-2xl font-bold mb-4">Konstantinos Bitsis</h3>
          <h4 className="text-xl text-primary mb-4">Senior Dance Instructor</h4>
          <div>
            Konstantinos Bitsis is a seasoned dance instructor with a deep passion for Latin rhythms and social dancing. His expertise spans across various Latin dance styles, with a particular focus on Cuban Salsa and Rueda de Casino.
            <br /><br />
            Known for his patient teaching style and attention to detail, Konstantinos creates a supportive learning environment where students can develop their technique while discovering their own dance personality. His classes emphasize musicality, partner connection, and the cultural roots of Latin dance.
          </div>
        </div>
      </AboutCard>
    </section>
  </>
);

export default AboutSection;
