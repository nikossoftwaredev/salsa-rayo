"use client";

import { FaMusic, FaHeart, FaGuitar } from "react-icons/fa";
import { GiMicrophone, GiMusicalNotes, GiTrumpet } from "react-icons/gi";
import { IoMusicalNotesOutline } from "react-icons/io5";
import PartnerIcon from "@/components/icons/PartnerIcon";
import Lightning from "@/components/react-bits/Backgrounds/Lightning/Lightning";

const BackgroundEffects = () => {
  const floatingIcons = [
    { Icon: FaMusic, delay: "0s", duration: "15s", left: "10%", top: "15%" },
    { Icon: FaHeart, delay: "2s", duration: "18s", left: "85%", top: "25%" },
    {
      Icon: GiMusicalNotes,
      delay: "4s",
      duration: "20s",
      left: "20%",
      top: "60%",
    },
    { Icon: FaGuitar, delay: "1s", duration: "16s", left: "75%", top: "70%" },
    {
      Icon: GiMicrophone,
      delay: "3s",
      duration: "19s",
      left: "50%",
      top: "20%",
    },
    {
      Icon: IoMusicalNotesOutline,
      delay: "5s",
      duration: "17s",
      left: "15%",
      top: "80%",
    },
    {
      Icon: GiTrumpet,
      delay: "2.5s",
      duration: "21s",
      left: "80%",
      top: "45%",
    },
    { Icon: FaMusic, delay: "6s", duration: "14s", left: "35%", top: "35%" },
    {
      Icon: PartnerIcon,
      delay: "3.5s",
      duration: "22s",
      left: "60%",
      top: "65%",
    },
  ];

  return (
    <>
      {/* Lightning Background Effect */}
      <div className="fixed inset-0 z-0 w-full h-screen">
        <Lightning
          hue={250}
          xOffset={0}
          speed={1}
          intensity={1}
          size={1}
        />
      </div>

      {/* Subtle Gradient Background */}
      <div className="fixed inset-0 z-0 bg-gradient-to-br from-primary/5 via-transparent to-accent/5 opacity-70" />

      {/* Ambient Lighting Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Main ambient light */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse" />
        <div
          className="absolute bottom-1/4 right-1/3 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-pulse"
          style={{ animationDelay: "2s" }}
        />

        {/* Secondary lighting */}
        <div
          className="absolute top-1/2 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-2xl"
          style={{ animation: "glow 8s ease-in-out infinite" }}
        />
        <div
          className="absolute bottom-1/3 right-1/4 w-72 h-72 bg-accent/8 rounded-full blur-2xl"
          style={{
            animation: "glow 10s ease-in-out infinite",
            animationDelay: "3s",
          }}
        />

        {/* Subtle light rays */}
        <div
          className="absolute top-0 left-1/4 w-1 h-full bg-gradient-to-b from-primary/20 via-primary/5 to-transparent opacity-30"
          style={{ animation: "shimmer 12s ease-in-out infinite" }}
        />
        <div
          className="absolute top-0 right-1/3 w-1 h-full bg-gradient-to-b from-accent/15 via-accent/3 to-transparent opacity-40"
          style={{
            animation: "shimmer 15s ease-in-out infinite",
            animationDelay: "4s",
          }}
        />
      </div>

      {/* Floating Icons */}
      {floatingIcons.map((item, index) => (
        <div
          key={index}
          className="fixed z-0 text-primary/20 pointer-events-none"
          style={{
            left: item.left,
            top: item.top,
            animation: `float ${item.duration} ease-in-out infinite`,
            animationDelay: item.delay,
          }}
        >
          <item.Icon size={24} />
        </div>
      ))}

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
            opacity: 0.2;
          }
          25% {
            transform: translateY(-10px) rotate(5deg);
            opacity: 0.3;
          }
          50% {
            transform: translateY(-20px) rotate(-3deg);
            opacity: 0.15;
          }
          75% {
            transform: translateY(-15px) rotate(7deg);
            opacity: 0.25;
          }
        }

        @keyframes glow {
          0%,
          100% {
            opacity: 0.3;
            transform: scale(1);
          }
          50% {
            opacity: 0.6;
            transform: scale(1.1);
          }
        }

        @keyframes shimmer {
          0%,
          100% {
            opacity: 0.2;
            transform: scaleY(1);
          }
          50% {
            opacity: 0.5;
            transform: scaleY(1.2);
          }
        }
      `}</style>
    </>
  );
};

export default BackgroundEffects;
