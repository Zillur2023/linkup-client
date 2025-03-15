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
      {/* <div className="hidden lg:block  lg:w-[20%] sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto ">
        <SidebarMenu items={items} />
      </div> */}
      <div>
        <TabsMenu selectedKey={url} items={items} />
        {/* <Tabs
          aria-label="Tabs"
          selectedKey={url}
          // fullWidth

          color="primary"
          variant="underlined"
        >
          {items.map((item) => (
            <Tab
              key={item.href}
              className=" w-full h-full"
              title={
                <Button
                  className={`${
                    pathname === item.href ? "text-blue-500" : ""
                  }  `}
                  href={item.href}
                  as={Link}
                  variant="light"
                >
                  {item.label}
                </Button>
              }
            />
          ))}
        </Tabs> */}
      </div>
      <div className=" lg:block    mx-auto w-full md:w-[80%] ">
        <div className=" mx-auto w-[70%] ">{renderSection()}</div>
      </div>
    </div>
  );
};

export default SearchPage;
