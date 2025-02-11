import { Avatar } from "@heroui/react";

const FriendsList = ({
  friends,
}: {
  friends: { name: string; image: string }[];
}) => {
  return (
    <div className="">
      <h3 className="text-lg font-semibold mb-2">Friends</h3>
      <div className="grid grid-cols-2 gap-2 ">
        {friends?.map((friend, i) => (
          <div key={i} className="flex flex-col items-center">
            <Avatar
              radius="lg"
              src={friend?.profileImage} // Default Image
              className=" w-28 h-28 "
            />
            <p className="text-sm font-semibold text-default-500">
              {friend.name}
            </p>{" "}
            {/* Default Name */}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FriendsList;
