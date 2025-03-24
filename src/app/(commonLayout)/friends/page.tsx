"use client";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { useUser } from "@/context/UserProvider";
import {
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useSendFriendRequestMutation,
} from "@/redux/features/user/userApi";
import { IUser, IUserData } from "@/type";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react";
import { toast } from "sonner";

const FriendRequestsReceived = ({ user }: { user: IUser }) => {
  return (
    <div>
      <h3 className=" mb-2 font-semibold text-xl"> Friend Requests </h3>
      <div className="  gap-2 grid grid-cols-1 md:grid-cols-3  ">
        {user?.friendRequestsReceived?.map((item, index) => (
          /* eslint-disable no-console */
          <Card key={index} shadow="sm">
            <CardBody className="overflow-visible p-0">
              <Image
                alt={item?.name}
                className="w-full object-cover h-[140px]"
                radius="lg"
                shadow="sm"
                src={item.profileImage}
                width="100%"
              />
            </CardBody>
            <CardFooter className=" flex flex-col gap-1">
              <Button fullWidth> Confirm </Button>
              <Button fullWidth> Delete </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const SuggestedFriends = () => {
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  // const { data: allUserData } = useGetAllUserQuery<IUserData[]>({
  //   searchQuery: "",
  // });
  const { data: allUserData } = useGetAllUserQuery({
    searchQuery: "",
  });
  const [sendFriendRequest] = useSendFriendRequestMutation();

  const items = allUserData?.data?.filter((usr) => usr?._id !== user?._id);

  const filteredUsers = allUserData?.data?.filter(
    (usr) =>
      usr._id !== user?._id &&
      !userData?.data?.friendRequestsReceived?.some(
        (item) => item?._id === usr?._id
      ) &&
      !userData?.data?.friendRequestsSent?.includes(usr?._id)
  );

  console.log({ filteredUsers });
  console.log(
    "userData?.data?.friendRequestsReceived",
    userData?.data?.friendRequestsReceived
  );

  const createSendRequest = async (id: string) => {
    try {
      await sendFriendRequest({ senderId: user?._id, receiverId: id });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to create chat");
    }
  };

  return (
    <div>
      <h3 className="  mb-2 font-semibold text-xl">People you may know</h3>
      <div className="  gap-2 grid grid-cols-1 md:grid-cols-3  ">
        {filteredUsers?.map((item: IUser) => (
          <Card key={item?._id} shadow="sm">
            <CardBody className="overflow-visible p-0">
              <Image
                alt={item?.name}
                className="w-full object-cover h-[140px]"
                radius="lg"
                shadow="sm"
                src={item.profileImage}
                width="100%"
              />
            </CardBody>
            <CardFooter className=" flex flex-col gap-1">
              <Button fullWidth onClick={() => createSendRequest(item._id)}>
                {" "}
                Add friends{" "}
              </Button>
              <Button fullWidth> Remove </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const FriendsPage = () => {
  const { user } = useUser();
  const { data: userData } = useGetUserByIdQuery<IUserData>(user?._id, {
    skip: !user?._id,
  });

  return (
    <div className="flex  justify-center gap-2 my-5 ">
      <div className="hidden md:block  md:w-[25%] sticky md:top-0 lg:top-[65px]  h-[calc(100vh-90px)]  overflow-y-auto   ">
        <SidebarMenu />
      </div>
      <div className=" md:block  w-full md:w-[75%]    ">
        <FriendRequestsReceived user={userData?.data} />
        <Divider className=" my-8" />
        <SuggestedFriends />
      </div>
    </div>
  );
};

export default FriendsPage;
