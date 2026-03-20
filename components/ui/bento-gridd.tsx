import { ReactNode } from "react";
import { cn } from "@/lib/utils";

const BentoGrid = ({
  children,
  className,
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}) => {
  return (
    <div className={cn("grid w-full gap-[3px]", className)} style={style}>
      {children}
    </div>
  );
};

const BentoCard = ({
  className,
  children,
  style,
}: {
  className?: string;
  children: ReactNode;
  style?: React.CSSProperties;
}) => (
  <div
    className={cn(
      "group relative overflow-hidden bg-[#161410] border border-[rgba(184,154,106,0.07)] transition-all duration-500 hover:border-[rgba(184,154,106,0.25)]",
      className,
    )}
    style={style}
  >
    {children}
  </div>
);

export { BentoCard, BentoGrid };