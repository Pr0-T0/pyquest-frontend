export type RunCodeResult = {
  stdout?: string;
  stderr?: string;
  exit_code?: number;
};

export async function runCodeAPI(
  code: string,
  stdin: string = ""
): Promise<RunCodeResult> {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_EXECUTOR_URL}/run`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, stdin }),
    }
  );

  if (!res.ok) {
    throw new Error("Execution server error");
  }

  return res.json();
}
