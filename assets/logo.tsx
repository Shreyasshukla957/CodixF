import { BiLoaderCircle } from "react-icons/bi";

const CodixLogo = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 130 36" className={className ?? "h-8 w-auto"}>
    <text
      x="0"
      y="28"
      fontFamily="'Share Tech Mono', monospace"
      fontSize="28"
      fontWeight="400"
      letterSpacing="-1"
      fill="currentColor"
    >
      CODIX
    </text>
    <BiLoaderCircle
      className="text-sun-accent dark:text-moon-lzincy hover:animate-spin"
      size={16}
    />
  </svg>
);

export default CodixLogo;
