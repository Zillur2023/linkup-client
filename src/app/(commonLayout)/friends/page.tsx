"use client";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { useSocketContext } from "@/context/socketContext";
import { useUser } from "@/context/UserProvider";
import {
  useAcceptFriendRequestMutation,
  useGetAllUserQuery,
  useGetUserByIdQuery,
  useRejectFriendRequestMutation,
  useSendFriendRequestMutation,
} from "@/redux/features/user/userApi";
import { IUser } from "@/type";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Image,
} from "@heroui/react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const FriendRequestsReceived = ({ user }: { user: IUser }) => {
  const { socket } = useSocketContext();
  const [localUserData, setLocalUserData] = useState<IUser | null>(null);
  console.log({ localUserData });
  const [rejectFriendRequest] = useRejectFriendRequestMutation();
  const [acceptFriendRequest] = useAcceptFriendRequestMutation();

  useEffect(() => {
    if (user) {
      setLocalUserData(user);
    }
  }, [user]);

  useEffect(() => {
    if (!socket) return;

    const handleUserAcceptFriendRequest = (user: IUser) => {
      console.log("You sent a friend request:", user);
      setLocalUserData(user);
    };

    const handleUserAcceptFriendRequestUpdateRequester = (user: IUser) => {
      console.log("You received a friend request:", user);
      setLocalUserData(user);
    };

    const handleUserRejectFriendRequest = (user: IUser) => {
      console.log("You reject friend request:", user);
      setLocalUserData(user);
    };

    const handleUserRejectFriendRequestUpdateRequester = (user: IUser) => {
      console.log("You reject friend request and upate in requester", user);
      setLocalUserData(user);
    };

    socket.on("userAcceptFriendRequest", handleUserAcceptFriendRequest);
    socket.on(
      "userAcceptFriendRequestUpdateRequester",
      handleUserAcceptFriendRequestUpdateRequester
    );
    socket.on("userRejectFriendRequest", handleUserRejectFriendRequest);
    socket.on(
      "userRejectFriendRequestUpdateRequester",
      handleUserRejectFriendRequestUpdateRequester
    );

    return () => {
      socket.off("userAcceptFriendRequest", handleUserAcceptFriendRequest);
      socket.off(
        "userAcceptFriendRequestUpdateRequester",
        handleUserAcceptFriendRequestUpdateRequester
      );
      socket.off("userRejectFriendRequest", handleUserRejectFriendRequest);
      socket.off(
        "userRejectFriendRequestUpdateRequester",
        handleUserRejectFriendRequestUpdateRequester
      );
    };
  }, [socket]);

  const handleRejectFriendRequest = async (requesterId: string) => {
    console.log({ requesterId });
    try {
      if (requesterId) {
        await rejectFriendRequest({
          userId: user?._id,
          requesterId,
        });
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to  reject friend request");
    }
  };

  const handleAcceptFriendRequest = async (requesterId: string) => {
    try {
      if (requesterId) {
        await acceptFriendRequest({
          userId: user?._id,
          requesterId,
        });
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <div>
      <div>
        <h3 className=" mb-2 font-semibold text-xl"> Friend Requests </h3>

        {localUserData && (
          <div className="gap-2 grid grid-cols-1 md:grid-cols-3">
            {localUserData.friendRequestsReceived.map((item, index) => {
              console.log({ item });
              console.log("item?._id", item?._id);
              return (
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
                  <CardFooter className="flex flex-col gap-1">
                    <Button
                      fullWidth
                      onClick={() =>
                        handleAcceptFriendRequest(item?._id as string)
                      }
                    >
                      Confirm
                    </Button>
                    <Button
                      fullWidth
                      onClick={() =>
                        handleRejectFriendRequest(item?._id as string)
                      }
                    >
                      Delete
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
      <Divider className=" my-8" />
      <SuggestedFriends user={localUserData as IUser} />
    </div>
  );
};

const SuggestedFriends = ({ user }: { user: IUser }) => {
  const { data: allUserData } = useGetAllUserQuery({
    searchQuery: "",
  });
  const [sendFriendRequest] = useSendFriendRequestMutation();

  const filteredUsers = allUserData?.data?.filter(
    (usr: any) =>
      usr._id !== user?._id &&
      !user?.friendRequestsReceived?.some((item) => item?._id === usr?._id) &&
      !user?.friendRequestsSent?.some((item) => item?._id === usr?._id) &&
      !user?.friends?.some((item) => item?._id === usr?._id)
    // !user?.friendRequestsSent?.includes(usr?._id)
  );

  const SendFriendRequest = async (receiverId: string) => {
    try {
      await sendFriendRequest({ senderId: user?._id, receiverId });
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to send friend request");
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
              <Button
                fullWidth
                onClick={() => SendFriendRequest(item._id as string)}
              >
                Add friend
              </Button>
              <Button fullWidth isDisabled>
                {" "}
                Remove{" "}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
};

const FriendsPage = () => {
  const { user } = useUser();
  const { data: userData, refetch } = useGetUserByIdQuery(user?._id as string, {
    skip: !user?._id,
  });
  const { socket } = useSocketContext();
  const [localUserData, setLocalUserData] = useState<IUser | null>(null);

  useEffect(() => {
    if (userData?.data) {
      setLocalUserData(userData.data);
    }
  }, [userData]);

  useEffect(() => {
    if (!socket) return;

    const handleSendFriendRequest = (user: IUser) => {
      console.log("You sent a friend request:", user);
      setLocalUserData(user);
      refetch();
    };

    const handleReceiveFriendRequest = (user: IUser) => {
      console.log("You received a friend request:", user);
      setLocalUserData(user);
      refetch();
    };

    socket.on("friendRequestSent", handleSendFriendRequest);
    socket.on("friendRequestReceived", handleReceiveFriendRequest);

    return () => {
      socket.off("friendRequestSent", handleSendFriendRequest);
      socket.off("friendRequestReceived", handleReceiveFriendRequest);
    };
  }, [socket, refetch]);

  return (
    <div className="flex  justify-center gap-2 my-5 ">
      <div className="hidden md:block  md:w-[25%] sticky md:top-0 lg:top-[65px]  h-[calc(100vh-90px)]  overflow-y-auto   ">
        <SidebarMenu />
      </div>
      <div className=" md:block  w-full md:w-[75%]    ">
        <FriendRequestsReceived user={localUserData as IUser} />
        {/* <Divider className=" my-8" />
         <SuggestedFriends user={userData?.data as IUser} /> */}
      </div>
    </div>
  );
};

export default FriendsPage;
