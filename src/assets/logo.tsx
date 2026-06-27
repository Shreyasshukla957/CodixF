import { BiLoaderCircle } from "react-icons/bi";

const CodixLogo = ({ className }: { className?: string }) => (
  <div className="flex items-center gap-0.5">
    <svg viewBox="0 0 130 36" className={className ?? "h-8 w-auto"}>
      <text
        x="0"
        y="28"
        fontFamily="'Share Tech Mono', monospace"
        fontSize="32"
        fontWeight="400"
        letterSpacing="-1"
        fill="currentColor"
      >
        CODIX
      </text>
    </svg>
    <BiLoaderCircle
      className="text-sun-accent dark:text-moon-lzincy hover:animate-spin -ml-7 mb-1"
      size={22}
    />
  </div>
);

export default CodixLogo;