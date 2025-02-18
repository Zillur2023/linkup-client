"use client";
import SidebarMenu from "@/components/shared/SidebarMenu";
import { Button, Card, CardBody, CardFooter, Image } from "@heroui/react";

const list = [
  {
    title: "Orange",
    img: "/images/fruit-1.jpeg",
    price: "$5.50",
  },
  {
    title: "Tangerine",
    img: "/images/fruit-2.jpeg",
    price: "$3.00",
  },
  {
    title: "Raspberry",
    img: "/images/fruit-3.jpeg",
    price: "$10.00",
  },
  {
    title: "Lemon",
    img: "/images/fruit-4.jpeg",
    price: "$5.30",
  },
  {
    title: "Avocado",
    img: "/images/fruit-5.jpeg",
    price: "$15.70",
  },
  {
    title: "Lemon 2",
    img: "/images/fruit-6.jpeg",
    price: "$8.00",
  },
  {
    title: "Banana",
    img: "/images/fruit-7.jpeg",
    price: "$7.50",
  },
  {
    title: "Watermelon",
    img: "/images/fruit-8.jpeg",
    price: "$12.20",
  },
];

const FriendsPage = () => {
  return (
    <div className="flex">
      <div className="hidden lg:block  lg:w-[20%] fixed h-screen overflow-y-auto ">
        <SidebarMenu />
      </div>
      <div className=" lg:block   lg:ml-[20%] mx-auto md:w-[80%] ">
        <div className="  gap-2 grid grid-cols-2 sm:grid-cols-4">
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
