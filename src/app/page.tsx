import PostEditor from "@/components/post/PostEditor";
import Posts from "@/components/post/Posts";
import Navbar from "@/components/shared/Navbar";

export default function Home() {
  return (
    <>
    <Navbar/>
    <PostEditor/>
    <Posts/>
    </>
  );
}
