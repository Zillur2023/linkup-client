import PostEditor from "@/components/post/PostEditor";
import Posts from "@/components/post/Posts";

export default function Home() {
  return (
    <>
    <h1>Root route homePage</h1>
    <Posts/>
    <PostEditor/>
    </>
  );
}
