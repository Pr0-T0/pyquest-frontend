import { Suspense } from "react";
import AttemptClient from "./attemptClient";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading exam...</div>}>
      <AttemptClient />
    </Suspense>
  );
}