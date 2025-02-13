import { IUser } from "@/type";
import {
  Avatar,
  Button,
  Card,
  AvatarGroup,
  Tabs,
  Tab,
  Divider,
} from "@heroui/react";
import { Camera } from "lucide-react";
import LinkUpForm from "../form/LinkUpForm";
import LinkUpInputFile from "../form/LinkUpInputFile";
import LinkUpReset from "../form/LinkUpReset";
import LinkUpModal from "../shared/LinkUpModal";
import { toast } from "sonner";
import { useUpdateUserMutation } from "@/redux/features/user/userApi";
import EditProfile from "./EditProfile";
import { usePathname } from "next/navigation";
import { friends } from "./Friends";

interface ProfileHeaderProps {
  user: IUser;
}

// export const ProfileHeader = (user: IUser) => {
export const ProfileHeader = ({ user }: ProfileHeaderProps) => {
  const pathname = usePathname();
  const [updateUser] = useUpdateUserMutation();

  const handleEditImage = async (data: any, reset?: () => void) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify({ _id: user?._id }));
    if (data?.coverImage) {
      formData.append("coverImage", data?.coverImage);
    } else if (data?.profileImage) {
      formData.append("profileImage", data?.profileImage);
    }

    console.log("formDatA editCOver", [...formData.entries()]);

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
      <div className="relative">
        <Avatar
          src={user?.coverImage}
          alt="Cover"
          className=" w-full h-72"
          radius="none"
        />

        <div className="absolute bottom-2 right-2 ">
          <LinkUpModal
            buttonSize="md"
            openButtonText={`${
              user?.coverImage ? "Update cover image" : "Add cover image"
            }`}
            startContent={<Camera />}
            title={`${
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

      <div className=" px-4">
        <div className=" -mt-5 flex   ">
          <div className="relative">
            <Avatar
              src={user?.profileImage}
              className=" relative  w-28 h-28 "
            />

            <div className="absolute bottom-5 right-0 ">
              <LinkUpModal
                radius="full"
                openButtonIcon={<Camera />}
                title={`${
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
            <p className=" text-start text-xl font-semibold "> {user?.name} </p>
            <p className=" text-start"> {friends?.length} friends </p>
            <div className=" flex items-center justify-between ">
              <AvatarGroup max={8} total={friends?.length}>
                {friends?.map((friend, i) => (
                  <Avatar key={i} src={friend?.image} />
                ))}
              </AvatarGroup>
              {/* <Button className="" startContent={<Edit />}>
                Edit Profile
              </Button> */}
              <div>
                <EditProfile {...user} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <Divider />
      <Tabs
        aria-label="Tabs"
        selectedKey={pathname}
        fullWidth
        classNames={{
          tabList: " w-full relative rounded-none p-0 flex justify-start  ",
          cursor: "w-full bg-blue-500",
          tab: "max-w-fit px-3 h-12 hover:bg-default-200 rounded-md ",
          tabContent: "group-data-[selected=true]:text-blue-500",
        }}
        color="primary"
        variant="underlined"
      >
        <Tab key={`/${user?.name}`} title={"posts"} href={`/${user?.name}`} />
        <Tab
          key={`/${user?.name}/friends`}
          title={"friends"}
          href={`/${user?.name}/friends`}
        />
      </Tabs>
    </Card>
  );
};
