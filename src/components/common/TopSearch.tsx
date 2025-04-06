import React from "react";
import Posts from "../post/Posts";
import { useGetAllUserQuery } from "@/redux/features/user/userApi";
import { Listbox, ListboxItem } from "@heroui/react";
import Link from "next/link";
import { IUser } from "@/type";

const TopSearch = ({ query }: { query: string }) => {
  const { data: allUserData } = useGetAllUserQuery({ searchQuery: query });

  return (
    <div>
      {allUserData?.data && (
        <Listbox aria-label="Search Results">
          {allUserData?.data?.map((user: IUser) => (
            <ListboxItem
              key={user._id}
              as={Link}
              href={`/profile?id=${user._id}`}
              //   onClick={() => onSearchChange("")}
              color="default"
            >
              {user.name}
            </ListboxItem>
          ))}
        </Listbox>
      )}
      <Posts searchQuery={query} />
    </div>
  );
};

export default TopSearch;
