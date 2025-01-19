/* eslint-disable @typescript-eslint/no-explicit-any */
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
import { useLoginMutation } from "@/redux/auth/authApi";
import { useUser } from "@/context/UserProvider";
import { setToken } from "@/service/AuthService";

export type ILoginUser = {
  email: string;
  password: string
}

const LoginPage = () => {
  const router = useRouter();
  // const dispatch = useAppDispatch();
  const [login] = useLoginMutation();
  const { setIsLoading: userLoading } = useUser();


  const onSubmit: SubmitHandler<ILoginUser> = async (formData) => {
  
    const toastId = toast.loading("Logging in...");

    try {
      const res = await login(formData).unwrap();

      if (res?.success) {
        userLoading(true);
        // userLoading(false); 
        // const { token } = res.data;
        // const user: any = jwtDecode(token);
        // dispatch(setUser({ user, token }));
        // console.log('res....DATA',res?.data)
        const userlogin = setToken(res?.data)
        console.log({userlogin})
        router.push("/");
        toast.success(res?.message, { id: toastId });
      }
    } catch (error: any) {
      toast.error(error?.data?.message, { id: toastId });
    }
    //  finally {
      // userLoading(false); 
    // }
  };


  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
      <h3 className="my-2 text-xl font-bold">Login</h3>
      <div className="w-[35%]">
        <Form  
         //! Only for development
        defaultValues={{
          email: "zillur@gmail.com",
          password: "1234",
        }}
        resolver={zodResolver(loginValidationSchema)}
        onSubmit={onSubmit}>
            <div className="py-3">
              <Input label="Email" name="email" size="sm" />
            </div>
            <div className="py-3">
              <Input
                label="Password"
                name="password"
                size="sm"
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
               >
                Forgot password?
              </Link>
            </div>

            <Button
              className="my-3 w-full rounded-md "
              size="lg"
              type="submit"
            >
              Login
            </Button>
        </Form>
        <div className="text-center">
          Not have an account ?{" "}
          <Link
            // onClick={() => handleForgetPassword()}
            href={"/register"}
            className="text-blue-500 hover:text-blue-700"
          >
            Register
          </Link>
        </div>
      </div>
     
    </div>
  );
};

export default LoginPage;
