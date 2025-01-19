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
import Form from "@/components/form/Form";
import Input from "@/components/form/Input";
import { Avatar, Badge, Button } from "@heroui/react";

export type IRegisterUser = {
  name: string;
  email: string;
  password: string
}

const RegisterPage: React.FC = () => {

  const router = useRouter();
  const [createUser] = useCreateUserMutation();
  const [imageFiles, setImageFiles] = useState<File[] | []>([]);
  const [imagePreviews, setImagePreviews] = useState<string[] | []>([]);

  console.log({imageFiles})

  console.log({imagePreviews})


  const onSubmit: SubmitHandler<IRegisterUser> = async (data) => {
    const formData = new FormData();
    formData.append("data",JSON.stringify(data))
    formData.append("image", imageFiles?.[0])
 
    const toastId = toast.loading("loading..")

   try {
    const res = await createUser(formData).unwrap();


    if (res?.success) {
      toast.success(res?.message, {id: toastId});
      router.push("/login");
    } 
   } catch (error:any) {
     toast.error(error?.data?.message, {id: toastId})
   }
  };
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files![0];

    setImageFiles(() => [ file]);

    if (file) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setImagePreviews(() => [ reader.result as string]);
      };

      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImageFiles([]);
    setImagePreviews([]);
  };

  return (
    <div className=" h-auto flex flex-col items-center justify-center">
    <h3 className="my-2 text-xl font-bold">Register</h3>
    <div className="w-[35%] ">
      <Form
        //! Only for development
        // defaultValues={{
        //   name: "zillur Rahman",
        //   email: "zillur@gmail.com",
        //   password: "1234",
        // }}
        resolver={zodResolver(registerValidationSchema)}
        onSubmit={onSubmit}
      >
       <div className="flex flex-col gap-3">
       <Input label="Name" labelPlacement="outside" placeholder="Enter your name" name="name" />
          <Input label="Email" labelPlacement="outside" placeholder="Enter your email" name="email"  />
          <Input
            label="Password"
            labelPlacement="outside"
            placeholder="Enter your passwords"
            name="password"
            type="password"
          />
        <div className="">
        <label
                  className="flex py-1 w-full cursor-pointer items-center justify-center rounded-xl border-2 border-default-200 text-default-500 shadow-sm transition-all duration-100 hover:border-default-400"
                  htmlFor="image"
                >
                  Upload image
                </label>
                <input
                  multiple
                  className="hidden"
                  id="image"
                  type="file"
                  onChange={(e) => handleImageUpload(e)}
                />
        </div>
       </div>
    
             {
              imagePreviews.length > 0 && <div className="my-5 gap-5 flex flex-wrap items-center justify-center">
                <Badge color="danger" onClick={() => handleRemoveImage()} content={ <button className="text-natural-500 hover:text-natural-700 font-bold text-sm">
                &#x2715;
              </button>} shape="rectangle" showOutline={false}>
                      <Avatar className=" w-32 h-auto " isBordered radius="md" src={imagePreviews?.[0]} />
                    </Badge>
              </div>
             }

        <Button
          className="my-3 w-full rounded-md "
          size="md"
          type="submit"
        >
          Register
        </Button>
      </Form>
      <div className="text-center">
        Already have an account ? <Link href={"/login"} className="text-blue-500 hover:text-blue-700">Login</Link>
      </div>
    </div>
  </div>
  );
};

export default RegisterPage;
