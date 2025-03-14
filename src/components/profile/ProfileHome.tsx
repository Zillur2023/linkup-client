import React from "react";
import { friends } from "./ProfileFriends";
import { Avatar, Button, Card } from "@heroui/react";
import Posts from "../post/Posts";
import { IUser } from "@/type";
import Link from "next/link";

const ProfileHome = (user: IUser) => {
  console.log("ProfileHome user", user);
  console.log("ProfileHome user id", user?._id);
  return (
    <div className=" flex justify-center w-full md:w-[70%] mx-auto gap-2 my-5">
      <div className=" w-full  space-y-5 hidden lg:block  lg:w-[40%] sticky top-[65px] h-min  ">
        {/* <LinkUpModal openButtonText={"Edit bio"}>
        <LinkUpForm
          // resolver={zodResolver(commentValidationSchema)}
          // onSubmit={(data, reset) => handleUpdateComment(data, reset)}
          onSubmit={() => console.log("zillur")}
          defaultValues={{ boi: userData?.data?.bio }}
        >
          <LinkUpTextarea name={"bio"} label="" />
        </LinkUpForm>
      </LinkUpModal> */}
        <FriendsGrid {...user} />
      </div>
      <div className=" w-full  lg:w-[60%] mx-auto   ">
        <div className=" lg:hidden  mb-5 ">
          <FriendsGrid {...user} />
        </div>
        <Posts userId={user?._id} />
      </div>
    </div>
  );
};

const FriendsGrid = (user: IUser) => {
  return (
    <Card shadow="lg" className="p-3">
      <div className=" flex justify-between items-center">
        <Link
          className=" hover:underline text-xl font-semibold"
          href={`/${user?.name}/friends`}
        >
          Friends
        </Link>
        <Button
          variant="light"
          // color="primary"
          // size="sm"
          as={Link}
          href={`/${user?.name}/friends`}
          className=" text-blue-500"
        >
          See all friens
        </Button>
      </div>
      <h4>100 friends</h4>
      <div className="grid grid-cols-3 gap-1  ">
        {friends?.map((friend, i) => (
          <Card key={i}>
            <Avatar radius="lg" className=" w-full h-24 " src={friend.image} />
            <p className=" text-center px-1"> {friend.name} </p>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default ProfileHome;
