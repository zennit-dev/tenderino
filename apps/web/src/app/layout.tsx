import "./globals.css";
import { cn } from "@zenncore/utils";
import type { LayoutProps } from "@zenncore/types/navigation";
import { Toaster } from "@zennui/web/toaster";
import { ThemeProvider } from "next-themes";

export default ({ children }: LayoutProps) => {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="flex items-center justify-between"
    >
      <body
        suppressHydrationWarning
        className={cn(
          "h-screen min-h-screen w-screen bg-accent font-sans text-foreground"
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Toaster />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
};
