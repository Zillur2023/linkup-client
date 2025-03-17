"use client";

import { Button, Tab, Tabs, Tooltip } from "@heroui/react";
import Link from "next/link";
import React, { ReactNode } from "react";

interface TabsMenuProps {
  selectedKey: string | number | null | undefined;
  items: {
    href: string;
    label: ReactNode;
    icon?: ReactNode;
  }[];
  tooltip?: boolean;
  isIconOnly?: boolean;
}

const TabsMenu: React.FC<TabsMenuProps> = ({
  selectedKey,
  items,
  tooltip = false,
  isIconOnly = false,
}) => {
  return (
    <Tabs
      aria-label="Tabs"
      selectedKey={selectedKey}
      color="primary"
      variant="underlined"
    >
      {items.map((item) => (
        <Tab
          key={item.href}
          className="w-full h-full"
          title={
            tooltip ? (
              <Tooltip content={item?.icon}>
                <Button
                  // size={isIconOnly ? "lg" : "md"}
                  size={"lg"}
                  isIconOnly={isIconOnly}
                  className={`${
                    selectedKey === item.href ? "text-blue-500" : ""
                  }   `}
                  href={item.href}
                  as={Link}
                  variant="light"
                >
                  {item?.label}
                </Button>
              </Tooltip>
            ) : (
              <Button
                className={`${
                  selectedKey === item.href ? "text-blue-500" : ""
                }  `}
                href={item.href}
                as={Link}
                variant="light"
              >
                {item.label}
              </Button>
            )
          }
        />
      ))}
    </Tabs>
  );
};

export default TabsMenu;
