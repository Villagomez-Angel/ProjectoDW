"use client";

import * as React from "react";

type PhoneImageProps = {
  src: string;
  alt: string;
  className?: string;
  fallbackSrc?: string;
};

export function PhoneImage({
  src,
  alt,
  className,
  fallbackSrc = "/localPhones/generic.png",
}: PhoneImageProps) {
  const [currentSrc, setCurrentSrc] = React.useState(src);

  React.useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        setCurrentSrc((prev) => (prev === fallbackSrc ? prev : fallbackSrc));
      }}
    />
  );
}