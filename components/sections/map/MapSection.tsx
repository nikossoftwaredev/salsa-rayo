import Card from "@/components/Card";
import { MAP_IFRAME, NAVIGATION } from "@/data/config";
import { SectionTitle } from "@/components/SectionTitle";
import { MdDirections } from "react-icons/md";

const MapSection = () => {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <SectionTitle title="MAPS" isMainSection />
      <Card className="sm:w-full md:w-3/4 shadow-md mt-4">
        <div className="relative w-full h-[400px]">
          <iframe
            title="map"
            src={MAP_IFRAME}
            className="rounded-lg border-hidden invert-[90%] hue-rotate-180 w-full h-full"
            width="100%"
            height="100%"
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
          <a
            className="btn btn-accent btn-sm absolute top-4 right-4 flex items-center gap-2 shadow-lg hover:shadow-xl z-10"
            href={NAVIGATION}
            target="_blank"
            rel="noopener noreferrer"
          >
            Get Directions <MdDirections size={18} />
          </a>
        </div>
      </Card>
    </div>
  );
};

export default MapSection;
