"use client";
import Posts from "@/components/post/Posts";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { FileText, Newspaper } from "lucide-react";
import { useParams, useSearchParams } from "next/navigation";

const SearchPage = () => {
  const params = useParams();
  const { slug } = params;
  console.log({ slug });
  const searchParams = useSearchParams();
  const query = searchParams.get("q");

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
        return <p>Top</p>;
      case "posts":
        return <Posts />;
      default:
        return null;
    }
  };

  return (
    <div className="flex  justify-center gap-2 my-5  ">
      <div className="hidden lg:block  lg:w-[20%] sticky top-[65px] h-[calc(100vh-65px)] overflow-y-auto ">
        <SidebarMenu items={items} />
      </div>
      <div className=" lg:block    mx-auto w-full md:w-[80%] ">
        <div className=" mx-auto w-[70%] ">{renderSection()}</div>
      </div>
    </div>
  );
};

export default SearchPage;
