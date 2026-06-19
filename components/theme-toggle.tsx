import { useState , useEffect } from "react";
import { Sun, Moon } from "lucide-react";


const ThemeToggle = () => {
  const [isDark, setIsDark] = useState(
    localStorage.getItem("codix-theme") === "dark",
  );

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDark);
    localStorage.setItem("codix-theme", isDark ? "dark" : "light");
    console.log("isDark",isDark);
  }, [isDark]);

  const toggleTheme = () => {
    setIsDark(!isDark);
  };

  return (
    <button
      onClick={toggleTheme}
      className="relative w-8 h-8 flex items-center justify-center bg-moon-surface border border-moon-border rounded-full"
    >
      <Sun
        size={18}
        className={`absolute text-sun-accent transition-all duration-300 
                ${isDark ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-50"}`}
      />
      <Moon
        size={18}
        className={`absolute text-moon-bg-secondary transition-all duration-300 
                ${isDark ?  "opacity-0 rotate-90 scale-50" :  "opacity-100 rotate-0 scale-100"}`}
      />
    </button>
  );
};

export default ThemeToggle;
