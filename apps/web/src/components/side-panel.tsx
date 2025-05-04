"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar";
import {
  ArrowLeftIcon,
  CallIcon,
  ChartCircleIcon,
  EditIcon,
  LogOutIcon,
  SettingsIcon,
  ShopIcon,
  ThemeIcon,
  UsersIcon,
} from "@zennui/icons";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const SidePanel = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [_, role] = pathname.split("/");

  const { theme, setTheme } = useTheme();

  const links =
    role === "vendor"
      ? [
          {
            label: "Dashboard",
            href: `/${role}`,
            icon: <ChartCircleIcon className="h-5 w-5 shrink-0 text-neutral" />,
          },
          {
            label: "Tenders",
            href: `/${role}/tenders`,
            icon: <ShopIcon className="h-5 w-5 shrink-0 text-neutral" />,
          },
        ]
      : [
          {
            label: "Dashboard",
            href: `/${role}`,
            icon: <ChartCircleIcon className="h-5 w-5 shrink-0 text-neutral" />,
          },
          {
            label: "Tenders",
            href: `/${role}/tenders`,
            icon: <ShopIcon className="h-5 w-5 shrink-0 text-neutral" />,
          },
          {
            label: "Vendor",
            href: `/${role}/vendors`,
            icon: <UsersIcon className="h-5 w-5 shrink-0 text-neutral" />,
          },
          {
            label: "Conference",
            href: `/evaluation/conference`,
            icon: <CallIcon className="h-5 w-5 shrink-0 text-neutral" />,
          },
          {
            label: "Board",
            href: `/evaluation/board`,
            icon: <EditIcon className="h-5 w-5 shrink-0 text-neutral" />,
          },
          {
            label: "Settings",
            href: "#",
            icon: <SettingsIcon className="h-5 w-5 shrink-0 text-neutral" />,
          },
        ];

  return (
    <Sidebar open={open} setOpen={setOpen}>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-1 flex-col overflow-x-hidden overflow-y-auto">
          {open ? <Logo /> : <LogoIcon />}
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link) => (
              <SidebarLink key={link.href} link={link} />
            ))}
          </div>
        </div>
        <div>
          <SidebarLink
            link={{
              label: "Theme",
              href: "#",
              icon: (
                <ThemeIcon
                  className="text-neutral"
                  onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                />
              ),
            }}
          />
          <SidebarLink
            link={{
              label: "Sign Out",
              href: "#",
              icon: <LogOutIcon className="text-error-dimmed" />,
            }}
          />
          <SidebarLink
            link={{
              label: "Manu Arora",
              href: "#",
              icon: (
                <img
                  src="https://assets.aceternity.com/manu.png"
                  className="h-7 w-7 shrink-0 rounded-full"
                  width={50}
                  height={50}
                  alt="Avatar"
                />
              ),
            }}
          />
        </div>
      </SidebarBody>
    </Sidebar>
  );
};
export const Logo = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-foreground"
    >
      <Image
        src="/images/logo.png"
        alt="AADF"
        width={50}
        height={50}
        className="size-[28px] min-w-[28px]"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 1,
        }}
        className="font-medium whitespace-pre text-foreground"
      >
        AADF
      </motion.span>
    </Link>
  );
};
export const LogoIcon = () => {
  return (
    <Link
      href="/"
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/images/logo.png"
        alt="AADF"
        width={50}
        height={50}
        className="size-[28px] min-w-[28px]"
      />
    </Link>
  );
};
