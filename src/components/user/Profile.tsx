"use client";

import { useUser } from "@/context/UserProvider";
import { useGetUserByIdQuery } from "@/redux/features/user/userApi";
import { IUserData } from "@/type";
import { usePathname } from "next/navigation";
import { ProfileHeader } from "./ProfileHeader";
import Posts from "../post/Posts";
import Friends, { friends } from "./Friends";
import NotAvailablePage from "../shared/NotAvailablePage";
import { Avatar, Card, card } from "@heroui/react";
import LinkUpModal from "../shared/LinkUpModal";
import LinkUpTextarea from "../form/LinkUpTextarea";
import LinkUpForm from "../form/LinkUpForm";

const Profile = () => {
  const pathname = usePathname();
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  const profileName = userData?.data?.name;
  const accessRoute = [`/${profileName}`, `/${profileName}/friends`];

  // Check if the current pathname is valid
  const isPathValid = accessRoute.includes(pathname);
  // const isPathValid = accessRoute.filter((item) => item === pathname);

  // Logging for debugging
  console.log({ pathname, isPathValid });

  // If the pathname is invalid, show the NotAvailablePage
  if (!isPathValid) {
    return <NotAvailablePage />;
  }

  // Render the appropriate section based on the pathname
  const renderSection = () => {
    switch (pathname) {
      case `/${profileName}`:
        return (
          <div className="w-[70%] mx-auto py-4 flex ">
            <div className="p-2 hidden lg:block  lg:w-[20%] fixed  overflow-y-auto mt-0  ">
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
              <div className="grid grid-cols-3 gap-1  ">
                {friends?.map((friend, i) => (
                  <Card key={i}>
                    <Avatar
                      radius="lg"
                      className=" w-full h-24 "
                      src={friend.image}
                    />
                    <p className=" text-center"> {userData?.data?.name} </p>
                  </Card>
                ))}
              </div>
            </div>
            <div className="w-[60%] lg:block lg:w-[60%] lg:ml-[40%] ">
              <Posts />
            </div>
          </div>
        );
      case `/${profileName}/friends`:
        return (
          <div className="w-[70%] mx-auto py-4">
            <Friends />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div>
      <div className="w-[70%] mx-auto ">
        <ProfileHeader user={userData?.data} />
      </div>
      {renderSection()}
    </div>
  );
};

export default Profile;
