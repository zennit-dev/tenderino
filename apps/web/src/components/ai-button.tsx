import { AIIcon } from "@zennui/icons";
import { Button, type ButtonProps } from "@zennui/web/button";
import { cn } from "@zenncore/utils";
import { motion } from "framer-motion";

export const AIButton = ({ children, className, ...props }: ButtonProps) => {
  return (
    <motion.div whileHover="hover" initial="initial" className="inline-block">
      <motion.div
        variants={{
          initial: {
            background: "linear-gradient(to right, #289BD6, #D82657)",
          },
          hover: {
            background: [
              "linear-gradient(to right, #289BD6, #D82657)",
              "linear-gradient(to right, #D82657, #289BD6)",
              "linear-gradient(to right, #289BD6, #D82657)",
            ],
          },
        }}
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          ease: "linear",
        }}
        className="rounded-md overflow-hidden"
      >
        <Button
          {...props}
          className={cn(
            "border-none transition-all duration-300 hover:shadow-lg bg-transparent text-white !bg-none",
            className
          )}
          style={{ backgroundColor: "transparent" }}
        >
          <AIIcon />
          {children}
        </Button>
      </motion.div>
    </motion.div>
  );
};
