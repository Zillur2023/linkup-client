import { IUser } from "@/type";
import { Card, Input, Listbox, ListboxItem } from "@heroui/react";
import { GoSearch } from "react-icons/go";

import Link from "next/link";

interface SearchBarProps {
  search: string;
  isFocused: boolean;
  onSearchChange: (value: string) => void;
  onFocusChange: (isFocused: boolean) => void;
  onSearchSubmit: () => void;
  searchResults: IUser[];
  inputRef: React.RefObject<HTMLInputElement | null>;
}

const SearchBar = ({
  search,
  isFocused,
  onSearchChange,
  onFocusChange,
  onSearchSubmit,
  searchResults,
  inputRef,
}: SearchBarProps) => {
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && inputRef.current) {
      inputRef.current.blur(); // Removes focus from input
      onSearchSubmit();
    }
  };

  return (
    <Card
      shadow={search && isFocused && searchResults.length > 0 ? "md" : "none"}
      radius={search && isFocused && searchResults.length > 0 ? "md" : "none"}
      className="px-1 py-2 absolute top-2"
    >
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={handleKeyDown}
          classNames={{
            base: ` w-[8rem]  md:w-[10rem]  md:w-full 
            
              `,
            mainWrapper: "h-full",
            input: "text-small",
            inputWrapper:
              "h-full font-normal bg-default-400/20 dark:bg-default-500/20",
          }}
          placeholder="Type to search..."
          size="sm"
          startContent={!isFocused && <GoSearch size={24} />}
          type="search"
          onFocus={() => onFocusChange(true)}
          onBlur={() => onFocusChange(false)}
        />
      </div>
      {search && isFocused && searchResults.length > 0 && (
        <Listbox aria-label="Search Results">
          {searchResults.map((user) => (
            <ListboxItem
              key={user._id}
              as={Link}
              href={`/profile?id=${user._id}`}
              onClick={() => onSearchChange("")}
              color="default"
            >
              {user.name}
            </ListboxItem>
          ))}
        </Listbox>
      )}
    </Card>
  );
};

export default SearchBar;
