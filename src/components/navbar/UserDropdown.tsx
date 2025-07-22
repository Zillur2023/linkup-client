import { useUser } from "@/context/UserProvider";
import { logout } from "@/redux/features/auth/authSlice";
import { useIsAvailableForVeriedQuery } from "@/redux/features/post/postApi";
import { useUpdateVerifiedMutation } from "@/redux/features/user/userApi";
import { useAppDispatch } from "@/redux/hooks";
import { IUser } from "@/type";
import {
  Avatar,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Button,
} from "@heroui/react";
import Link from "next/link";
import { toast } from "sonner";

export const UserDropdown = ({ user }: { user: IUser | null }) => {
  const dispatch = useAppDispatch();
  const { user: loginUser } = useUser();
  const { data: IsAvailableForVerified } = useIsAvailableForVeriedQuery(
    user?._id,
    {
      skip: !user?._id,
    }
  );
  // console.log({ IsAvailableForVerified });

  const [updateVerified] = useUpdateVerifiedMutation();

  const handleUpdateVerified = async (id: string) => {
    const toastId = toast.loading("loading...");

    try {
      const res = await updateVerified(id).unwrap();

      if (res?.data?.paymentSession?.payment_url) {
        const paymentUrl = res.data.paymentSession.payment_url;
        window.location.href = paymentUrl; // Redirect to the payment URL
      }
      // toast.success(res?.message, {id: toastId})
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
      console.log({ error });
    }
  };
  // console.log({ loginUser });
  // console.log({ user });
  if (!loginUser) {
    return (
      <Button as={Link} color="warning" href="login" variant="flat">
        Sign Up
      </Button>
    );
  }

  return (
    <div>
      {user && (
        <Dropdown placement="bottom-end">
          <DropdownTrigger>
            <Avatar
              isBordered
              as="button"
              className="transition-transform"
              // name={user?.name}
              size="sm"
              src={user?.profileImage}
            />
          </DropdownTrigger>
          <DropdownMenu aria-label="Profile Actions" variant="flat">
            <DropdownItem key="profile" className="h-14 gap-2">
              <p className="font-semibold">Signed in as</p>
              <p className="font-semibold">{user?.email}</p>
            </DropdownItem>
            <DropdownItem
              key="settings"
              as={Link}
              href={`/profile?id=${user?._id}`}
            >
              <div className="flex items-center space-x-2">
                <Avatar radius="full" size="sm" src={user?.profileImage} />
                <span>{user?.name}</span>
              </div>
            </DropdownItem>
            {!user?.isVerified && IsAvailableForVerified?.data?.length > 0 ? (
              <DropdownItem
                key="payment"
                className="bg-gradient-to-tr from-pink-500 to-yellow-500 text-white shadow-lg"
                onClick={() => handleUpdateVerified(user?._id as string)}
              >
                Pay for verify
              </DropdownItem>
            ) : null}
            <DropdownItem
              // onClick={() => {
              //   logout();
              //   userLoading(true);
              // }}
              onClick={() => {
                dispatch(logout());
              }}
              key="logout"
              color="danger"
            >
              Log Out
            </DropdownItem>
          </DropdownMenu>
        </Dropdown>
      )}
    </div>
  );
};
