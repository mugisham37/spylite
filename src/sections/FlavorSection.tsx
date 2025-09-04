import { FlavorSectionProps } from "../types/components";
import FlavorTitle from "../components/FlavorTitle";
import FlavorSlider from "../components/FlavorSlider";

const FlavorSection: React.FC<FlavorSectionProps> = ({
  className = "",
  animationConfig,
}) => {
  return (
    <section className={`flavor-section min-h-screen ${className}`}>
      <div className="h-full flex lg:flex-row flex-col items-center relative">
        {/* Title section - takes up 57% width on large screens */}
        <div className="lg:w-[57%] flex-none h-80 lg:h-full md:mt-20 xl:mt-0">
          <FlavorTitle {...(animationConfig ? { animationConfig } : {})} />
        </div>

        {/* Slider section - takes remaining space */}
        <div className="h-full flex-1">
          <FlavorSlider />
        </div>
      </div>
    </section>
  );
};

export default FlavorSection;
