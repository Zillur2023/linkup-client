"use client";
import { Listbox, ListboxItem } from "@heroui/react";
import Link from "next/link"; // Import Link from Next.js

export const items = [
  { href: "feed", label: "Feed" },
  { href: "/change-password", label: "Change password" },
  { href: "/about-us", label: "About us" },
  { href: "/contact-us", label: "Contact us" },
];

export default function SidebarMenu() {
  return (
    <div className="bg-default-100 dark:bg-default-100 h-screen max-w-[320px]">
      <Listbox
        isVirtualized
        className="max-w-xs "
        label={"Select from 1000 items"}
        // placeholder="Select..."
        virtualization={{
          maxListboxHeight: 400,
          itemHeight: 40,
        }}
      >
        {items.map((item, index) => (
          <ListboxItem
            key={index}
            value={item.label}
            as={Link}
            href={item.href}
          >
            {item.label}
          </ListboxItem>
        ))}
      </Listbox>
    </div>
  );
}
