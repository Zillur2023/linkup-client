import { IUser } from "@/type";
import React from "react";
import LinkUpModal from "../shared/LinkUpModal";
import LinkUpForm from "../form/LinkUpForm";
import LinkUpInputFile from "../form/LinkUpInputFile";
import { Button } from "@heroui/react";
import LinkUpReset from "../form/LinkUpReset";
import { MdEdit } from "react-icons/md";

import LinkUpTextarea from "../form/LinkUpTextarea";
import { useUpdateUserMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";

const ProfileEdit = (user: IUser) => {
  const [updateUser] = useUpdateUserMutation();
  const onSubmit = async (data: any, reset?: (values?: any) => void) => {
    const formData = new FormData();

    formData.append("coverImage", data?.coverImage);
    formData.append("profileImage", data?.profileImage);

    formData.append(
      "data",
      JSON.stringify({
        ...data,
        _id: user?._id,
      })
    );

    const toastId = toast.loading("loading...");
    try {
      const res = await updateUser(formData).unwrap();
      if (res.success) {
        toast.success(res.message, { id: toastId });
        // reset?.();
        reset?.({
          bio: res.data?.bio, // Use updated bio
          profileImage: res.data?.profileImage, // Use updated profile image
          coverImage: res.data?.coverImage, // Use updated cover image
        });
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.data?.message, { id: toastId });
    }
  };

  return (
    <LinkUpModal
      startContent={<MdEdit size={24} />}
      openButtonText={"Edit Profile"}
      header={` Edit Profile`}
      variant="solid"
    >
      <LinkUpForm
        //   resolver={zodResolver(postEditorValidationSchema)}
        onSubmit={onSubmit}
        defaultValues={{
          bio: user?.bio,
          profileImage: user?.profileImage,
          coverImage: user?.coverImage,
        }}
      >
        <div className="py-3">
          <LinkUpTextarea
            name="bio"
            label={`${user?.bio ? "Update bio" : "Add bio"}`}
          />
        </div>

        <div className="py-3">
          <LinkUpInputFile
            name="coverImage"
            label={`${
              user?.coverImage ? "Update cover image" : "Add cover image"
            }`}
          />
        </div>
        <div className="py-3">
          <LinkUpInputFile
            name="profileImage"
            label={`${
              user?.profileImage ? "Update profile image" : "Add profile image"
            }`}
          />
        </div>

        <div className="flex gap-4">
          <Button className="w-full" size="sm" color="primary" type="submit">
            Submit
          </Button>
          {/* <Button type="reset" size="sm" variant="bordered">
          Reset
        </Button> */}
          <LinkUpReset />
        </div>
      </LinkUpForm>
    </LinkUpModal>
  );
};

export default ProfileEdit;
