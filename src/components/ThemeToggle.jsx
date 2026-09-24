import { Moon, Sun } from "lucide-react";
import clsx from "clsx";
import { useTheme } from "./context/ThemeContext";

export default function ThemeToggle({ className }) {
  const { theme, toggleTheme } = useTheme();
  const nextTheme = theme === "dark" ? "light" : "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${nextTheme} mode`}
      title={`Switch to ${nextTheme} mode`}
      className={clsx(
        "flex h-9 w-9 items-center justify-center rounded-full border border-borderline bg-secondary-bg text-secondary transition-colors hover:bg-borderline-light",
        className
      )}
    >
      {theme === "dark" ? <Sun size={17} /> : <Moon size={17} />}
    </button>
  );
}
