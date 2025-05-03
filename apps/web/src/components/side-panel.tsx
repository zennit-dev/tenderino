"use client";

import { Sidebar, SidebarBody, SidebarLink } from "@/components/sidebar";
import {
  ArrowLeftIcon,
  ChartCircleIcon,
  SettingsIcon,
  ShopIcon,
  UsersIcon,
} from "@zennui/icons";
import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";
import Image from "next/image";
import { usePathname } from "next/navigation";

export const SidePanel = () => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const [_, role] = pathname.split("/");
  const links = [
    {
      label: "Dashboard",
      href: `/${role}`,
      icon: <ChartCircleIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Tenders",
      href: `/${role}/tenders`,
      icon: <ShopIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Vendor",
      href: `/${role}/vendors`,
      icon: <UsersIcon className="h-5 w-5 shrink-0" />,
    },
    {
      label: "Settings",
      href: "#",
      icon: <SettingsIcon className="h-5 w-5 shrink-0" />,
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
      className="relative z-20 flex items-center space-x-2 py-1 text-sm font-normal text-black"
    >
      <Image
        src="/images/logo.png"
        alt="AADF"
        width={50}
        height={50}
        className="size-[30px] min-w-[30px]"
      />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium whitespace-pre text-black dark:text-white"
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
        className="size-[30px] min-w-[30px]"
      />
    </Link>
  );
};
