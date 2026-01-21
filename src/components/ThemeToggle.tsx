import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/ThemeProvider";
import { Button } from "@/components/ui/button";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();

  const toggleTheme = () => {
    if (theme === "dark") {
      setTheme("light");
    } else {
      setTheme("dark");
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative w-10 h-10 border border-primary/30 hover:border-primary hover:bg-primary/10 transition-all overflow-hidden group"
      title={theme === "dark" ? "تفعيل الوضع الفاتح" : "تفعيل وضع الظلام"}
    >
      <Sun className="h-5 w-5 text-primary transition-all duration-500 rotate-0 scale-100 dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-5 w-5 text-primary transition-all duration-500 rotate-90 scale-0 dark:rotate-0 dark:scale-100" />
      <span className="sr-only">تبديل المظهر</span>
    </Button>
  );
}
