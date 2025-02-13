import { ReactNode } from "react";

export default function layout({ children }: { children: ReactNode }) {
  // Log the pathname
  return <div className=" max-w-7xl mx-auto  ">{children}</div>;
}
