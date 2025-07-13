"use client";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { registerValidationSchema } from "@/schemas";
import { useCreateUserMutation } from "@/redux/features/user/userApi";
import { Button } from "@heroui/react";
import LinkUpForm from "@/components/form/LinkUpForm";
import LinkUpInput from "@/components/form/LinkUpInput";
import LinkUpInputFile from "@/components/form/LinkUpInputFile";

export type IRegisterUser = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage = () => {
  const router = useRouter();
  const [createUser, { isLoading: createUserIsLoading }] =
    useCreateUserMutation();

  // const onSubmit: SubmitHandler<IRegisterUser> = async (data) => {
  const onSubmit = async (data: any) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("profileImage", data?.profileImage);
    const toastId = toast.loading("Registering...");

    try {
      const res = await createUser(formData).unwrap();

      if (res?.success) {
        router.push("/login");
        toast.success("Register successfully", { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className=" h-auto flex flex-col items-center justify-center">
      <h3 className="my-2 text-xl font-bold">Register</h3>
      <div className="w-[35%] ">
        <LinkUpForm
          resolver={zodResolver(registerValidationSchema)}
          onSubmit={onSubmit}
        >
          <div className="flex flex-col gap-3">
            <LinkUpInput
              label="Name"
              labelPlacement="outside"
              placeholder="Enter your name"
              name="name"
            />
            <LinkUpInput
              label="Email"
              labelPlacement="outside"
              placeholder="Enter your email"
              name="email"
            />
            <LinkUpInput
              label="Password"
              labelPlacement="outside"
              placeholder="Enter your passwords"
              name="password"
              type="password"
            />
            <div className="py-3">
              <LinkUpInputFile name="profileImage" label="Upload image" />
            </div>
          </div>
          <Button className={`my-3 w-full rounded-md `} size="md" type="submit">
            {createUserIsLoading ? "Registering..." : "Register"}
          </Button>
        </LinkUpForm>
        <div className="text-center">
          Already have an account ?{" "}
          <Link href={"/login"} className="text-blue-500 hover:text-blue-700">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
