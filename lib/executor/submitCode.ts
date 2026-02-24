export type SubmitResult = {
  success: boolean;
  verdict?: "Accepted" | "Wrong Answer" | "Runtime Error";
  failed_at?: number;
  input?: string;
  expected?: string;
  output?: string;
  error?: string;
  passed?: number;
  total?: number;
};

export async function submitCodeAPI(
  code: string,
  taskId: number,
  userId?: string
): Promise<SubmitResult> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_EXECUTOR_URL}/submit`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        code,
        task_id: taskId,
        user_id: userId,
      }),
    }
  );

  if (!res.ok) {
    throw new Error("Submission server error");
  }

  return res.json();
}