import { Suspense } from "react";
import TaskClient from "./taskClient";

export default function Page() {
  return (
    <Suspense fallback={<div>Loading task...</div>}>
      <TaskClient />
    </Suspense>
  );
}
