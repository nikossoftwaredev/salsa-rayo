import { useCallback, useState } from "react";
import { FaArrowRight } from "react-icons/fa";

const GetStartedButton = () => {
  const [isHovered, setIsHovered] = useState(false);

  const scrollToAppointment = useCallback(() => {
    const appointmentDiv = document.getElementById("contact-form");

    if (appointmentDiv) {
      appointmentDiv.scrollIntoView({ behavior: "smooth", block: "center" });
      appointmentDiv.focus();
    }
  }, []);

  return (
    <div className="relative">
      <button
        className="relative btn btn-lg bg-gradient-to-r from-primary to-accent border-none text-white font-bold px-8 py-4 rounded-lg transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 overflow-hidden"
        onClick={scrollToAppointment}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: "linear-gradient(45deg, #18A07B, #7737b8)",
          boxShadow:
            "0 0 20px rgba(24, 160, 123, 0.3), 0 0 30px rgba(119, 55, 184, 0.2)",
        }}
      >
        {/* Left to Right Fill Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-accent to-primary transform transition-transform duration-500 ease-out"
          style={{
            transform: isHovered ? "translateX(0%)" : "translateX(-100%)",
          }}
        />

        {/* Button Content */}
        <span className="relative flex items-center gap-3 text-lg z-10">
          Get Started Now
          <FaArrowRight
            className={`transition-all duration-300 ${
              isHovered ? "translate-x-2 scale-125" : ""
            }`}
          />
        </span>
      </button>
    </div>
  );
};

export default GetStartedButton;
