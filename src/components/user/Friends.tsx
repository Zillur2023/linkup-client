import { Avatar } from "@heroui/react";

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
    <div className="">
      <h3 className="text-lg font-semibold mb-2">Friends</h3>
      <div className="grid grid-cols-2 gap-2 ">
        {friends?.map((friend, i) => (
          <div key={i} className="flex flex-col items-center">
            <Avatar
              radius="lg"
              src={friend?.image} // Default Image
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

export default Friends;
