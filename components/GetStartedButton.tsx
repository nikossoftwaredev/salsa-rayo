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
    <div className="relative group">
      {/* Glow effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-primary to-accent rounded-xl blur-xl opacity-70 group-hover:opacity-100 transition duration-500 group-hover:duration-200 animate-pulse"></div>
      
      <button
        className="relative btn btn-lg bg-gradient-to-r from-primary to-accent border-none text-white font-bold px-10 py-5 rounded-xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl active:scale-95 overflow-hidden"
        onClick={scrollToAppointment}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        style={{
          background: "linear-gradient(135deg, #5B4FDB, #E31E7F)",
          boxShadow: isHovered
            ? "0 10px 40px rgba(91, 79, 219, 0.4), 0 10px 50px rgba(227, 30, 127, 0.3), inset 0 -2px 10px rgba(255,255,255,0.2)"
            : "0 4px 20px rgba(91, 79, 219, 0.3), 0 4px 25px rgba(227, 30, 127, 0.2)",
        }}
      >
        {/* Shimmer effect */}
        <div 
          className="absolute inset-0 opacity-0 group-hover:opacity-20"
          style={{
            background: "linear-gradient(105deg, transparent 40%, white 50%, transparent 60%)",
            animation: isHovered ? "shimmer 0.8s" : "none",
          }}
        />
        
        {/* Left to Right Fill Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-r from-accent via-primary to-accent transform transition-transform duration-700 ease-out"
          style={{
            transform: isHovered ? "translateX(0%)" : "translateX(-100%)",
            background: "linear-gradient(135deg, #E31E7F, #5B4FDB, #E31E7F)",
          }}
        />

        {/* Button Content */}
        <span className="relative flex items-center gap-3 text-lg font-extrabold tracking-wide z-10">
          Get Started Now
          <FaArrowRight
            className={`transition-all duration-300 ${
              isHovered ? "translate-x-2 scale-125 rotate-[-10deg]" : ""
            }`}
            size={20}
          />
        </span>
        
        {/* Ripple effect on hover */}
        {isHovered && (
          <span className="absolute inset-0 flex items-center justify-center">
            <span className="absolute w-full h-full rounded-xl animate-ping opacity-20 bg-white"></span>
          </span>
        )}
      </button>
    </div>
  );
};

export default GetStartedButton;
