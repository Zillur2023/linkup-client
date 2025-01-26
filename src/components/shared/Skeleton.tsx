import {Card, Skeleton} from "@heroui/react";

export  function PostSkeleton() {
  return (
    <Card className="w-[200px] space-y-5 p-4" radius="lg">
            <div className=" w-full flex  items-center gap-3">
      <div>
        <Skeleton className="flex rounded-full w-8 h-8" />
      </div>
      <div className="w-full flex flex-col gap-2">
        <Skeleton className="h-2 w-3/5 rounded-lg" />
        <Skeleton className="h-2 w-4/5 rounded-lg" />
      </div>
      <div>
        <Skeleton className=" h-6 w-8 rounded-lg"/>
      </div>
    </div>
    <div className="space-y-3">
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
      </div>
      <Skeleton className="rounded-lg">
        <div className="h-24 rounded-lg bg-default-300" />
      </Skeleton>
      {/* <div className="space-y-3">
        <Skeleton className="w-3/5 rounded-lg">
          <div className="h-3 w-3/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-4/5 rounded-lg">
          <div className="h-3 w-4/5 rounded-lg bg-default-200" />
        </Skeleton>
        <Skeleton className="w-2/5 rounded-lg">
          <div className="h-3 w-2/5 rounded-lg bg-default-300" />
        </Skeleton>
      </div> */}
    </Card>
  );
}
