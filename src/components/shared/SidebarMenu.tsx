'use client'
import { Listbox, ListboxItem } from '@heroui/react';
import Link from 'next/link';
import React from 'react';

export const links = [
  { href: "/news-feed", label: "News Feed" },
  { href: "/about-us", label: "About Us" },
  { href: "/contact-us", label: "Contact Us" },
];

const SidebarMenu = () => {
  return (
    
    <div className=" bg-default-100  ">

      <Listbox aria-label="Actions" onAction={(key) => alert(key)}>
        {links.map((link) => <ListboxItem key={link.href}> <Link href={link.href}  className=' block w-full'>{link?.label} </Link> </ListboxItem>)}
       
      </Listbox>
      </div>
  );
};

export default SidebarMenu;
