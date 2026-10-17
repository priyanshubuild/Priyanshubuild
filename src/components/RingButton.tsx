import React from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

type RingButtonSize = "sm" | "md" | "lg";

type RingButtonProps = {
  text: string;
  href?: string;
  icon?: React.ElementType | React.ReactNode;
  size?: RingButtonSize;
  className?: string;
  target?: string;
  rel?: string;
  ariaLabel?: string;
};

const ringButtonSizeStyles: Record<
  RingButtonSize,
  {
    buttonSize: "sm" | "default" | "lg";
    buttonPadding: string;
    textSize: string;
    iconSize: string;
  }
> = {
  sm: {
    buttonSize: "sm",
    buttonPadding: "px-3 py-1.5 md:py-2",
    textSize: "text-xs md:text-sm",
    iconSize: "h-3.5 w-3.5 sm:h-4 sm:w-4",
  },
  md: {
    buttonSize: "default",
    buttonPadding: "px-4 py-2 md:py-3",
    textSize: "text-xs md:text-base",
    iconSize: "h-4 w-4 sm:h-5 sm:w-5",
  },
  lg: {
    buttonSize: "lg",
    buttonPadding: "px-6 py-2 md:py-4",
    textSize: "text-xs md:text-lg",
    iconSize: "h-4 w-4 sm:h-5 sm:w-5",
  },
};

const RingButton = ({
  text,
  href,
  icon: Icon,
  size = "lg",
  className,
  target,
  rel,
  ariaLabel,
}: RingButtonProps) => {
  const sizeStyles = ringButtonSizeStyles[size];

  let iconNode = null;
  if (React.isValidElement(Icon)) {
    iconNode = React.cloneElement(
      Icon as React.ReactElement<{ className?: string }>,
      {
        className: cn(
          (Icon.props as { className?: string }).className,
          sizeStyles.iconSize,
        ),
      },
    );
  } else if (
    typeof Icon === "function" ||
    (typeof Icon === "object" && Icon !== null && "$$typeof" in Icon)
  ) {
    const IconComponent = Icon as React.ElementType;
    iconNode = (
      <IconComponent className={sizeStyles.iconSize} aria-hidden="true" />
    );
  }

  const content = (
    <>
      {iconNode}
      <span className={cn(sizeStyles.textSize)}>{text}</span>
      <span className="pointer-events-none absolute -inset-[4px] rounded-lg border border-[#1C1C1F]" />
    </>
  );

  if (href) {
    return (
      <Button
        asChild
        size={sizeStyles.buttonSize}
        className={cn(
          "relative flex scale-100 items-center gap-2 rounded-md border border-[#39393D] transition-colors hover:scale-[0.99] hover:bg-[#1C1C1F]/50",
          sizeStyles.buttonPadding,
          className,
        )}
      >
        <Link href={href} target={target} rel={rel} aria-label={ariaLabel}>
          {content}
        </Link>
      </Button>
    );
  }

  return (
    <Button
      aria-label={ariaLabel}
      size={sizeStyles.buttonSize}
      className={cn(
        "relative flex scale-100 items-center gap-2 rounded-md border border-[#39393D] transition-colors hover:scale-[0.99] hover:bg-[#1C1C1F]/50",
        sizeStyles.buttonPadding,
        className,
      )}
    >
      {content}
    </Button>
  );
};

export default RingButton;
