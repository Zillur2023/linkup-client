import Profile from "@/components/user/Profile";

const page = ({ params }: { params: Promise<{ user: string }> }) => {
  console.log({ params });
  return (
    <>
      <Profile />
    </>
  );
};

export default page;
