/* eslint-disable @next/next/no-img-element */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { toast } from "sonner";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { SubmitHandler } from "react-hook-form";
import Link from "next/link";
import { ChangeEvent, useState } from "react";
import { registerValidationSchema } from "@/schemas";
import { useCreateUserMutation } from "@/redux/features/user/userApi";
import { Avatar, Badge, Button } from "@heroui/react";
import LinkUpForm from "@/components/form/LinkUpForm";
import LinkUpInput from "@/components/form/LinkUpInput";
import LinkUpInputFile from "@/components/form/LinkUpInputFile";

export type IRegisterUser = {
  name: string;
  email: string;
  password: string;
};

const RegisterPage: React.FC = () => {
  const router = useRouter();
  const [createUser] = useCreateUserMutation();

  // const onSubmit: SubmitHandler<IRegisterUser> = async (data) => {
  const onSubmit = async (data: any, reset?: () => void) => {
    const formData = new FormData();
    formData.append("data", JSON.stringify(data));
    formData.append("images", data?.images?.[0]);
    console.log("resgister data", data);

    const toastId = toast.loading("loading..");

    try {
      const res = await createUser(formData).unwrap();

      if (res?.success) {
        toast.success(res?.message, { id: toastId });
        router.push("/login");
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
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
              <LinkUpInputFile name="images" label="Upload image" />
            </div>
          </div>
          <Button className="my-3 w-full rounded-md " size="md" type="submit">
            Register
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
