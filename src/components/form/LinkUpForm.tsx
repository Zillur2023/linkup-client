"use client";

import { BaseSyntheticEvent, ReactNode } from "react";
import { FormProvider, SubmitHandler, useForm } from "react-hook-form";

interface formConfig {
  defaultValues?: Record<string, any>;
  resolver?: any;
}

interface IProps extends formConfig {
  children: ReactNode;
  // onSubmit: SubmitHandler<any>;
  onSubmit:  (data: any, reset?: () => void) => void;
}

export default function LinkUpForm({
  children,
  onSubmit,
  defaultValues,
  resolver,
}: IProps) {
  const formConfig: formConfig = {};

  if (!!defaultValues) {
    formConfig["defaultValues"] = defaultValues;
  }

  if (!!resolver) {
    formConfig["resolver"] = resolver;
  }

  const methods = useForm(formConfig);
  const { handleSubmit, reset } = methods;

  // const submitHandler = methods.handleSubmit;

  const submitHandler = handleSubmit((data) => onSubmit(data, reset));

  console.log({submitHandler})
  console.log("Form Errors:", methods.formState.errors);

  return (
    <FormProvider {...methods}>
     {/* <form onSubmit={submitHandler(onSubmit)}></form> */}
      <form onSubmit={submitHandler}>
        {children}

      </form>
    </FormProvider>
  );
}
