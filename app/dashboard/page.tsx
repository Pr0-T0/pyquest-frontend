import Link from "next/link";
import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function PyQuestDashboard() {
  return (
    <div className="min-h-screen flex flex-col">

      {/* MAIN CONTENT */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-2xl font-bold mb-6">Dashboard</h2>

        <div className="grid gap-6 md:grid-cols-3">
          <Card>
            <CardHeader>
              <CardTitle>Python Learning</CardTitle>
              <CardDescription>
                Levels, quests, and hands-on coding challenges
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/learn">
                <Button className="w-full">Start Learning</Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Leaderboards</CardTitle>
              <CardDescription>
                See top performers and your rank
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/leaderboards">
                <Button variant="secondary" className="w-full">
                  View Leaderboards
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Exams</CardTitle>
              <CardDescription>
                Take exams or create one as a teacher
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-3">
              <Link href="/exams/take">
                <Button className="w-full">Take Exam</Button>
              </Link>
              <Link href="/exams/create">
                <Button variant="outline" className="w-full">
                  Create Exam
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
