import Button from "./Button";
import Logo from "./Logo";
import { SectionTitle } from "./SectionTitle";

const HeroSection = () => {
  return (
    <section
      id="hero"
      className="hero min-h-screen w-full bg-no-repeat flex items-center justify-center"
      style={{
        backgroundImage: "url(/images/hero-image.png)",
      }}
    >
      <div className="p-4 flex flex-col items-center justify-center w-full text-center text-white space-y-6 bg-black bg-opacity-50">
        <Logo />
        <SectionTitle title="Dance and connect" />
        <p className="text-2xl font-extrabold ">
          This is your getaway to the magical world of social dancing!
        </p>
        <div className="text-base md:text-xl">
          <p>Learn to dance, make friends, and extend your skills.</p>
          <p>Join our classes today!</p>
        </div>
        <Button variant="primary">Get Started Now</Button>
      </div>
    </section>
  );
};

export default HeroSection;
