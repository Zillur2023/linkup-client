import { Card, Skeleton } from "@heroui/react";

export function PostSkeleton({ length }: { length: number }) {
  return (
    <>
      {[...new Array(length)].map((_, index) => (
        <Card
          key={index}
          className="w-full space-y-5 p-4 sm:rounded-none md:rounded-md"
          radius="none"
        >
          <div className=" w-full flex  items-center gap-3">
            <Skeleton className="flex rounded-full w-10 h-8" />
            <div className="w-full flex flex-col gap-2">
              <Skeleton className="h-2 w-3/5 rounded-lg" />
              <Skeleton className="h-2 w-4/5 rounded-lg" />
            </div>
            <Skeleton className=" h-6 w-10 rounded-lg" />
          </div>
          <div className="space-y-3">
            <Skeleton className="h-3 w-full rounded-lg bg-default-200" />
            <Skeleton className="h-3 w-full rounded-lg bg-default-200" />
            <Skeleton className="h-3 w-4/5 rounded-lg bg-default-200" />
          </div>
          <Skeleton className="h-36 rounded-lg bg-default-300" />
          <div className=" flex items-center justify-between">
            <Skeleton className=" h-6 w-10 rounded-lg" />
            <Skeleton className=" h-6 w-10 rounded-lg" />
            <Skeleton className=" h-6 w-10 rounded-lg" />
            <Skeleton className=" h-6 w-10 rounded-lg" />
          </div>
        </Card>
      ))}
    </>
  );
}
