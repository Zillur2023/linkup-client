import { IUser } from "@/type";
import { Avatar, Button, Card, AvatarGroup, Divider } from "@heroui/react";
import { Camera } from "lucide-react";
import LinkUpForm from "../form/LinkUpForm";
import LinkUpInputFile from "../form/LinkUpInputFile";
import LinkUpReset from "../form/LinkUpReset";
import LinkUpModal from "../shared/LinkUpModal";
import { toast } from "sonner";
import { useUpdateUserMutation } from "@/redux/features/user/userApi";
import EditProfile from "./ProfileEdit";
import { usePathname, useSearchParams } from "next/navigation";
import Link from "next/link";
import TabsMenu from "../shared/TabsMenu";

interface ProfileHeaderProps {
  user: IUser;
  profileRoute: { href: string; label: string }[];
}

export const ProfileHeader = ({ user, profileRoute }: ProfileHeaderProps) => {
  // export const ProfileHeader = (user: IUser) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");
  const sk = searchParams.get("sk");
  const url = sk ? `${pathname}?id=${id}&sk=${sk}` : `${pathname}?id=${id}`;
  // const url = query ? `${pathname}?id=${query}` : pathname;
  const [updateUser] = useUpdateUserMutation();

  const handleEditImage = async (data: any, reset?: () => void) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ _id: user?._id }));
    if (data?.coverImage) {
      formData.append("coverImage", data?.coverImage);
    } else if (data?.profileImage) {
      formData.append("profileImage", data?.profileImage);
    }

    // console.log("formDatA editCOver", [...formData.entries()]);

    const toastId = toast.loading("loading..");

    try {
      const res = await updateUser(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message, { id: toastId });
        reset?.();
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  return (
    <Card className="" radius="none">
      <div className="w-full md:w-[70%] mx-auto  ">
        <div className="relative">
          {user && (
            <Avatar
              src={user?.coverImage}
              alt="Cover"
              className=" w-full h-72"
              radius="none"
            />
          )}

          <div className="absolute bottom-2 right-2 ">
            <LinkUpModal
              buttonSize="md"
              openButtonText={
                <span className="hidden lg:block">
                  {user?.coverImage ? "Update cover image" : "Add cover image"}
                </span>
              }
              startContent={<Camera />}
              header={`${
                user?.coverImage ? "Update cover image" : "Add cover image"
              }`}
              variant="solid"
              className="bg-gray-800 dark:bg-none text-white"
            >
              <LinkUpForm
                // resolver={zodResolver(postEditorValidationSchema)}
                onSubmit={handleEditImage}
              >
                <div className="py-3">
                  <LinkUpInputFile name="coverImage" label="Add cover image" />
                </div>

                <div className="flex gap-4">
                  <Button
                    className="w-full"
                    size="sm"
                    color="primary"
                    type="submit"
                  >
                    Submit
                  </Button>
                  <LinkUpReset />
                </div>
              </LinkUpForm>
            </LinkUpModal>
          </div>
        </div>

        <div className=" px-5">
          <div className=" -mt-5 flex flex-col lg:flex-row mx-auto   ">
            <div className="relative mx-auto  ">
              {user && (
                <Avatar
                  src={user?.profileImage}
                  className=" relative  w-28 h-28 "
                  radius="full"
                />
              )}

              <div className="absolute bottom-5 right-0 ">
                <LinkUpModal
                  radius="full"
                  openButtonIcon={<Camera />}
                  header={`${
                    user?.profileImage
                      ? "Update profile image"
                      : "Add profile image"
                  }`}
                  variant="solid"
                  className="bg-gray-800 dark:bg-none text-white"
                >
                  <LinkUpForm
                    // resolver={zodResolver(postEditorValidationSchema)}
                    onSubmit={handleEditImage}
                  >
                    <div className="py-3">
                      <LinkUpInputFile
                        name="profileImage"
                        label={`${
                          user?.profileImage
                            ? "Update profile image"
                            : "Add profile image"
                        }`}
                      />
                    </div>

                    <div className="flex gap-4">
                      <Button
                        className="w-full"
                        size="sm"
                        color="primary"
                        type="submit"
                      >
                        Submit
                      </Button>
                      <LinkUpReset />
                    </div>
                  </LinkUpForm>
                </LinkUpModal>
              </div>
            </div>
            <div className=" mt-5  w-full px-2 pb-3 ">
              <p className=" text-center lg:text-start text-xl font-semibold ">
                {user?.name}
              </p>
              <p className=" text-center lg:text-start">
                {user?.friends?.length} friends
              </p>
              <div className=" flex flex-col lg:flex-row items-center justify-between ">
                <Link href={`/${user?.name}/friends`}>
                  <AvatarGroup
                    max={8}
                    className=" hover:cursor-pointer"
                    total={user?.friends?.length}
                    renderCount={(count) => (
                      <p className="text-small text-foreground font-medium ms-2 hover:underline hover:cursor-pointer">
                        +{count} others
                      </p>
                    )}
                  >
                    {user?.friends?.map((friend, i) => (
                      <Avatar
                        key={i}
                        src={friend?.profileImage}
                        onClick={() => console.log({ i })}
                      />
                    ))}
                  </AvatarGroup>
                </Link>
                {/* <Button className="" startContent={<Edit />}>
                Edit Profile
              </Button> */}
                <div className=" my-2">
                  <EditProfile {...user} />
                </div>
              </div>
            </div>
          </div>
          <Divider />
          <TabsMenu selectedKey={url} items={profileRoute} />
        </div>
      </div>
    </Card>
  );
};
