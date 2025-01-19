"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidationSchema } from "@/schemas";
import Form from "@/components/form/Form";
import { SubmitHandler } from "react-hook-form";
import Input from "@/components/form/Input";
import Link from "next/link";
import { Button, } from "@heroui/react";
import { useUser } from "@/context/UserProvider";
import { useLoginMutation } from "@/redux/features/auth/authApi";

export type ILoginUser = {
  email: string;
  password: string
}

const LoginPage = () => {
  const router = useRouter();
  // const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const { user ,setIsLoading: userLoading } = useUser();

  console.log("login page user", user)


  const onSubmit: SubmitHandler<ILoginUser> = async (formData) => {
  
    const toastId = toast.loading("Logging in...");

    try {
      const res = await login(formData).unwrap();

      if (res?.success) {
        userLoading(true);
        router.push("/");
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
    
  };


  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
      <h3 className="my-2 text-xl font-bold">Login</h3>
      <div className="w-[35%]">
        <Form  
         //! Only for development
        // defaultValues={{
        //   email: "zillur@gmail.com",
        //   password: "1234",
        // }}
        resolver={zodResolver(loginValidationSchema)}
        onSubmit={onSubmit}>
              <div className=" flex flex-col gap-3">
        
              <Input label="Email" labelPlacement="outside" placeholder="Enter your email" name="email"  />
              <Input
                label="Password"
                labelPlacement="outside"
                placeholder="Enter your password"
                name="password"
                type="password"
              />
              </div>
            <div className="flex py-2 px-1 justify-between">
              {/* <Checkbox
                    classNames={{
                      label: "text-small",
                    }}
                  >
                    Remember me
                  </Checkbox> */}
              <Link color="primary"
                href={"#"}
                className=" text-sm text-blue-600 hover:text-blue-400 transition-colors duration-200"
               >
                Forgot password?
              </Link>
            </div>

            <Button
              className="my-3 w-full rounded-md "
              size="md"
              type="submit"
            >
              Login
            </Button>
        </Form>
        <div className="text-center">
          Not have an account ?{" "}
          <Link
            href={"/register"}
            className="text-blue-600 hover:text-blue-400 transition-colors duration-200"
          >
            Register
          </Link>
        </div>
      </div>
     
    </div>
  );
};

export default LoginPage;