import { IUser, IUserData } from "@/type";
import { Avatar, Button, Card, AvatarGroup } from "@heroui/react";
import { Camera, Edit, UserPlus } from "lucide-react";

export const ProfileHeader = (user: IUser) => {
  return (
    <Card className="" radius="none">
      <div className="relative">
        <Avatar
          src={user?.images?.[0]}
          alt="Cover"
          className=" w-full h-72"
          radius="none"
        />
        <Button
          //   variant="bordered"
          startContent={<Camera />}
          color="default"
          className="absolute bottom-2 right-2 bg-gray-800 dark:bg-none text-white"
          onClick={() => alert("Change Cover Image")}
        >
          Add Cover
        </Button>
      </div>

      <div className=" px-4">
        <div className=" -mt-5 flex   ">
          <div className="relative">
            <Avatar src={user?.images?.[0]} className=" relative  w-28 h-28 " />
            <Button
              size="sm"
              isIconOnly
              color="default"
              className="absolute bottom-5 right-0 bg-gray-800 dark:bg-none text-white rounded-full p-1"
              onClick={() => alert("Change Profile Picture")}
            >
              <Camera />
            </Button>
          </div>
          <div className=" mt-5  w-full px-2 pb-3 ">
            <p className=" text-start text-xl font-semibold "> {user?.name} </p>
            <p className=" text-start"> 1k friends</p>
            <div className=" flex items-center justify-between ">
              <AvatarGroup isBordered max={3} total={10}>
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026024d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258a2462d826712d" />
                <Avatar src="https://i.pravatar.cc/150?u=a042581f4e29026704d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026302d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026702d" />
                <Avatar src="https://i.pravatar.cc/150?u=a04258114e29026708c" />
              </AvatarGroup>
              <Button className="" startContent={<Edit />}>
                Edit Profile
              </Button>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};
