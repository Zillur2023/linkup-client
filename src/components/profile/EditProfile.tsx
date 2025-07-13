import { IUser } from "@/type";
import React, { useRef } from "react";
import LinkUpModal from "../shared/LinkUpModal";
import LinkUpForm from "../form/LinkUpForm";
import LinkUpInputFile from "../form/LinkUpInputFile";
import { Button } from "@heroui/react";
import { MdEdit } from "react-icons/md";

import LinkUpTextarea from "../form/LinkUpTextarea";
import { useUpdateUserMutation } from "@/redux/features/user/userApi";
import { toast } from "sonner";

const EditProfile = (user: IUser) => {
  const clickSubmitRef = useRef<HTMLButtonElement | null>(null);
  const [updateUser, { isLoading: updateUserIsLoading }] =
    useUpdateUserMutation();
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

    try {
      const res = await updateUser(formData).unwrap();
      if (res.success) {
        // reset?.();
        reset?.({
          bio: res.data?.bio, // Use updated bio
          profileImage: res.data?.profileImage, // Use updated profile image
          coverImage: res.data?.coverImage, // Use updated cover image
        });
      }
    } catch (error: any) {
      console.log({ error });
      toast.error(error?.data?.message);
    }
  };

  return (
    <LinkUpModal
      startContent={<MdEdit size={24} />}
      openButtonText={"Edit Profile"}
      header={` Edit Profile`}
      scrollBehavior={"inside"}
      variant="solid"
      footer={
        <div className=" w-full ">
          <Button
            fullWidth
            size="sm"
            color="primary"
            onClick={() => clickSubmitRef?.current?.click()}
          >
            {"Submit"}
          </Button>
        </div>
      }
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

        <Button
          ref={clickSubmitRef}
          className="w-full hidden"
          size="sm"
          color="primary"
          type="submit"
        >
          {updateUserIsLoading ? "Updating..." : "Update"}
        </Button>
      </LinkUpForm>
    </LinkUpModal>
  );
};

export default EditProfile;
