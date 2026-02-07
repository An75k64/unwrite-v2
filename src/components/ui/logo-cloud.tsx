import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { cn } from "@/lib/utils";

export function LogoCloud({ className, logos, ...props }) {
  return (
    <div
      {...props}
      className={cn(
        "overflow-hidden py-10 [mask-image:linear-gradient(to_right,transparent,black_20%,black_80%,transparent)]",
        className
      )}
    >
      <InfiniteSlider gap={64} reverse speed={10} speedOnHover={10}>
        {logos.map((logo) => (
          <img
            key={`logo-${logo.alt}`}
            src={logo.src}
            alt={logo.alt}
            loading="lazy"
            height={logo.height || 60}
            width={logo.width || "auto"}
            className="pointer-events-none h-12 md:h-14 select-none opacity-80 hover:opacity-100 transition-opacity"
            style={{ backgroundColor: "transparent" }}
          />
        ))}
      </InfiniteSlider>
    </div>
  );
}
