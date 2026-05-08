import { useEffect, useMemo, useState } from "react";
import { getDisplayAvatarUrl } from "../../utils/avatar.js";

export function AvatarImage({ src, className = "", alt = "", ...props }) {
  const fallbackSrc = useMemo(() => getDisplayAvatarUrl(""), []);
  const resolvedSrc = useMemo(() => getDisplayAvatarUrl(src), [src]);
  const [currentSrc, setCurrentSrc] = useState(resolvedSrc);

  useEffect(() => {
    setCurrentSrc(resolvedSrc);
  }, [resolvedSrc]);

  return (
    <img
      {...props}
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
      }}
    />
  );
}
