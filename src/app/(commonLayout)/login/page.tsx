"use client";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginValidationSchema } from "@/schemas";
import Link from "next/link";
import { Button } from "@heroui/react";
import { useUser } from "@/context/UserProvider";
import { useLoginMutation } from "@/redux/features/auth/authApi";
import LinkUpForm from "@/components/form/LinkUpForm";
import LinkUpInput from "@/components/form/LinkUpInput";
import { setToken } from "@/service/AuthService";

export type ILoginUser = {
  email: string;
  password: string;
};

const LoginPage = () => {
  const router = useRouter();
  const [login, { isLoading: loginIsLoading }] = useLoginMutation();
  const { setIsLoading: userLoading } = useUser();

  const onSubmit = async (formData: ILoginUser) => {
    try {
      const res = await login(formData).unwrap();

      if (res?.success) {
        userLoading(true);
        setToken(res?.data);
        router.push("/");
      }
    } catch (error: any) {
      toast.error(error?.data?.message);
    }
  };

  return (
    <div className="flex h-[calc(100vh-100px)] flex-col items-center justify-center">
      <h3 className="my-2 text-xl font-bold">Login</h3>
      <div className="w-[35%]">
        <LinkUpForm
          resolver={zodResolver(loginValidationSchema)}
          onSubmit={onSubmit}
        >
          <div className=" flex flex-col gap-3">
            <LinkUpInput
              label="Email"
              labelPlacement="outside"
              placeholder="Enter your email"
              name="email"
            />
            <LinkUpInput
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
            <Link
              color="primary"
              href={"#"}
              className=" text-sm text-blue-600 hover:text-blue-400 transition-colors duration-200"
            >
              Forgot password?
            </Link>
          </div>

          <Button className="my-3 w-full rounded-md " size="md" type="submit">
            {loginIsLoading ? "Logging in..." : "Login"}
          </Button>
        </LinkUpForm>
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
