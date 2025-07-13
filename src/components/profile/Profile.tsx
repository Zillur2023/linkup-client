import React from "react";
import { Avatar, Button, Card } from "@heroui/react";
import Posts from "../post/Posts";
import { IUser } from "@/type";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

const Profile = (user: IUser) => {
  return (
    <div className=" flex justify-center w-full md:w-[70%] mx-auto gap-2 my-5">
      {user?.friends?.length > 0 && (
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
      )}
      <div className=" w-full  lg:w-[60%]   ">
        <div className=" lg:hidden  mb-5 ">
          <FriendsGrid {...user} />
        </div>
        <Posts userId={user?._id} />
      </div>
    </div>
  );
};

const FriendsGrid = (user: IUser) => {
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  return (
    <>
      <Card shadow="lg" className="p-3">
        <div className=" flex justify-between items-center">
          <Link
            className=" hover:underline text-xl font-semibold"
            // href={`/${user?.name}/friends`}
            href={`/profile?id=${id}&sk=friends`}
          >
            Friends
          </Link>
          <Button
            variant="light"
            // color="primary"
            // size="sm"
            as={Link}
            href={`/profile?id=${id}&sk=friends`}
            className=" text-blue-500"
          >
            See all friens
          </Button>
        </div>
        <h4>{user?.friends?.length} friends</h4>
        <div className="grid grid-cols-3 gap-1  ">
          {user?.friends?.map((friend, i) => (
            <Card key={i}>
              <Avatar
                radius="lg"
                className=" w-full h-24 "
                src={friend?.profileImage}
              />
              <p className=" text-center px-1"> {friend?.name} </p>
            </Card>
          ))}
        </div>
      </Card>
    </>
  );
};

export default Profile;
