// app/learn/[levelId]/page.tsx
import { Suspense } from "react";
import LevelTasksClient from "./levelTaskClient";


export default function Page() {
  return (
    <Suspense fallback={<div>Loading tasks...</div>}>
      <LevelTasksClient />
    </Suspense>
  );
}
