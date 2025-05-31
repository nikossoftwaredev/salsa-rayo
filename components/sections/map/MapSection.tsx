import Card from "@/components/Card";
import { MAP_IFRAME, NAVIGATION } from "@/data/config";
import { SectionTitle } from "@/components/SectionTitle";
import { MdDirections } from "react-icons/md";

const MapSection = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SectionTitle title="MAPS" isMainSection />
      <Card className="sm:w-full md:w-3/4 shadow-md mt-4 flex items-center justify-center">
        <iframe
          title="map"
          src={MAP_IFRAME}
          className="rounded-lg border-hidden invert-[90%] hue-rotate-180"
          width="100%"
          height="400px"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </Card>
      <a
        className="btn btn-accent  my-4 flex items-center justify-center"
        href={NAVIGATION}
        target="_blank"
        rel="noopener noreferrer"
      >
        Get Directions <MdDirections />
      </a>
    </div>
  );
};

export default MapSection;
