"use client";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";

const list = [
  {
    title: "Orange",
    img: "data:image/jpeg;base64,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",
    price: "$5.50",
  },
];

const FriendsPage = () => {
  return (
    <div className="flex ">
      <div className="hidden lg:block  lg:w-[20%] fixed h-screen overflow-y-auto  ">
        <SidebarMenu />
      </div>
      <div className=" lg:block   lg:ml-[20%] mx-auto w-full md:w-[80%]   ">
        <div className="  gap-2 grid grid-cols-1 md:grid-cols-3 p-4 ">
          {list.map((item, index) => (
            /* eslint-disable no-console */
            <Card key={index} shadow="sm">
              <CardBody className="overflow-visible p-0">
                <Image
                  alt={item.title}
                  className="w-full object-cover h-[140px]"
                  radius="lg"
                  shadow="sm"
                  src={item.img}
                  width="100%"
                />
              </CardBody>
              <CardFooter className=" flex flex-col gap-1">
                <Button fullWidth> Add friends </Button>
                <Button fullWidth> Remove </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FriendsPage;
