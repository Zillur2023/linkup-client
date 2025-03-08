import {
  Avatar,
  Button,
  Card,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
import { Ellipsis } from "lucide-react";

export const friends = [
  {
    name: "Zillur Rahman",
    image:
      "https://img.freepik.com/premium-photo/boss-man-looking-camera-smiling-young-businessman-banker-with-beard-photo-with-close-up-portrait_321831-5908.jpg?semt=ais_hybrid",
  },
  {
    name: "Zillur Rahman",
    image:
      "https://img.freepik.com/premium-photo/boss-man-looking-camera-smiling-young-businessman-banker-with-beard-photo-with-close-up-portrait_321831-5908.jpg?semt=ais_hybrid",
  },
  {
    name: "Zillur Rahman",
    image:
      "https://img.freepik.com/premium-photo/boss-man-looking-camera-smiling-young-businessman-banker-with-beard-photo-with-close-up-portrait_321831-5908.jpg?semt=ais_hybrid",
  },
  {
    name: "Zillur Rahman",
    image:
      "https://img.freepik.com/premium-photo/boss-man-looking-camera-smiling-young-businessman-banker-with-beard-photo-with-close-up-portrait_321831-5908.jpg?semt=ais_hybrid",
  },
];

const Friends = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 my-5  w-full md:w-[70%]  mx-auto  ">
      {friends?.map((friend, i) => (
        <Card
          key={i}
          className=" p-3 flex flex-row items-center justify-between "
        >
          <div className=" flex items-center gap-4">
            <Avatar
              radius="lg"
              src={friend?.image} // Default Image
              className=" w-24 h-24 "
            />
            <div className="   ">
              <p className="text-lg font-semibold text-default-500 ">
                {friend?.name}
              </p>
              <p className="text-sm font-semibold text-default-500 hover:underline ">
                12 mutual friends
              </p>
            </div>
          </div>
          <Dropdown>
            <DropdownTrigger>
              <Button isIconOnly size="sm" variant="light">
                <Ellipsis />
              </Button>
            </DropdownTrigger>
            <DropdownMenu>
              <DropdownItem key="Favorites">Favorites</DropdownItem>
              <DropdownItem key="Edit Friend list">
                Edit Friend list
              </DropdownItem>
              <DropdownItem key="Unfollow">Unfollow</DropdownItem>
              <DropdownItem key="Unfriend">Unfriend</DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Card>
      ))}
    </div>
  );
};

export default Friends;
