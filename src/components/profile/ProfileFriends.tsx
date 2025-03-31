import { useRemoveFriendMutation } from "@/redux/features/user/userApi";
import { IUser } from "@/type";
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

const ProfileFriends = ({ user }: { user: IUser }) => {
  const [removeFriend] = useRemoveFriendMutation();

  const RemoveFriend = async (friendId: string) => {
    try {
      await removeFriend({ userId: user?._id, friendId });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 my-5  w-full md:w-[70%]  mx-auto  ">
      {user?.friends?.map((friend, i) => (
        <Card
          key={i}
          className=" p-3 flex flex-row items-center justify-between "
        >
          <div className=" flex items-center gap-4">
            <Avatar
              radius="lg"
              src={friend?.profileImage} // Default Image
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
              <DropdownItem
                key="Unfriend"
                onClick={() => RemoveFriend(friend?._id as string)}
              >
                Unfriend
              </DropdownItem>
            </DropdownMenu>
          </Dropdown>
        </Card>
      ))}
    </div>
  );
};

export default ProfileFriends;
