"use client";
import Posts from "@/components/post/Posts";
import SidebarMenu from "@/components/shared/SidebarMenu";
import TabsMenu from "@/components/shared/TabsMenu";
import { Button, Tab, Tabs } from "@heroui/react";
import { FileText, Newspaper } from "lucide-react";
import Link from "next/link";
import { useParams, usePathname, useSearchParams } from "next/navigation";

const SearchPage = () => {
  const pathname = usePathname();
  console.log({ pathname });
  const params = useParams();
  const { slug } = params;
  // console.log({ slug });
  const searchParams = useSearchParams();
  const query = searchParams.get("q");
  console.log({ query });
  const url = query ? `${pathname}?q=${query}` : pathname;

  const items = [
    { href: `/search/top?q=${query}`, label: "All", icon: <Newspaper /> },
    {
      href: `/search/posts?q=${query}`,
      label: "Posts",
      icon: <FileText />,
    },
  ];

  const renderSection = () => {
    switch (slug) {
      case "top":
        // return <Posts searchQuery={query!} />;
        return <p>Top</p>;
      case "posts":
        return <Posts searchQuery={query!} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row  justify-center gap-2 my-5  ">
      <div className="hidden md:block  md:w-[25%] sticky md:top-0 lg:top-[65px]  h-[calc(100vh-90px)]  overflow-y-auto ">
        <SidebarMenu items={items} />
      </div>
      <div className=" block md:hidden">
        <TabsMenu selectedKey={url} items={items} />
      </div>
      <div className="  md:block  w-full md:w-[75%]   ">
        <div className=" mx-auto w-[70%] ">{renderSection()}</div>
      </div>
    </div>
  );
};

export default SearchPage;
