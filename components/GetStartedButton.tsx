import Button from "@/components/Button";
import { useCallback } from "react";
import { FaArrowRight } from "react-icons/fa";

const GetStartedButton = () => {
  const scrollToAppointment = useCallback(() => {
    const appointmentDiv = document.getElementById("contact-form");

    if (appointmentDiv) {
      appointmentDiv.scrollIntoView({ behavior: "smooth", block: "center" });
      appointmentDiv.focus();
    }
  }, []);

  return (
    <Button variant="accent" outlined={false} onClick={scrollToAppointment}>
      Get Started Now <FaArrowRight />
    </Button>
  );
};

export default GetStartedButton;
