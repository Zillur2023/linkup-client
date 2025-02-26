import React from "react";
import { friends } from "./Friends";
import { Avatar, Button, Card, Link } from "@heroui/react";
import Posts from "../post/Posts";
import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUser, IUserData } from "@/type";

const User = () => {
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  return (
    <div className=" flex w-full md:w-[70%] mx-auto gap-2 ">
      <div className=" my-5 hidden lg:block  lg:w-[40%] sticky top-[65px] h-[calc(100vh-65px)]  overflow-y-auto">
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
        <FriendsGrid {...userData?.data} />
      </div>
      <div className=" w-full  lg:w-[60%] mx-auto  ">
        <div className=" lg:hidden my-5">
          <FriendsGrid {...userData?.data} />
        </div>
        <Posts />
      </div>
    </div>
  );
};

const FriendsGrid = (user: IUser) => {
  return (
    <Card className=" p-4 space-y-1">
      <div className=" flex justify-between items-center">
        <Link
          underline="hover"
          color="foreground"
          className=" text-xl font-semibold"
        >
          Friends
        </Link>
        <Button
          variant="light"
          color="primary"
          // size="sm"
          as={Link}
          href={`/${user?.name}/friends`}
        >
          {" "}
          See all friens
        </Button>
      </div>
      <h4>100 friends</h4>
      <div className="grid grid-cols-3 gap-1  ">
        {friends?.map((friend, i) => (
          <Card key={i}>
            <Avatar radius="lg" className=" w-full h-24 " src={friend.image} />
            <p className=" text-center"> {friend.name} </p>
          </Card>
        ))}
      </div>
    </Card>
  );
};

export default User;
