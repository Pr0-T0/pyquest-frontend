"use client";

import { Suspense } from "react";
import ExamIntroContent from "./ExamIntroContent";

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6">Loading...</div>}>
      <ExamIntroContent />
    </Suspense>
  );
}