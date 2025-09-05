import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

// Placeholder data for scaffolding
const mockPolls = [
  { id: "1", question: "What is your favorite programming language?", responses: 42 },
  { id: "2", question: "Tabs or spaces?", responses: 58 },
];

export default function PollsPage() {
  return (
    <main className="container mx-auto max-w-3xl p-4 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Polls</h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">Browse and vote on community polls.</p>
        </div>
        <Button asChild>
          <Link href="/polls/new">Create Poll</Link>
        </Button>
      </div>

      <div className="grid gap-4">
        {mockPolls.map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <CardTitle className="text-base">
                <Link href={`/polls/${poll.id}`} className="hover:underline">
                  {poll.question}
                </Link>
              </CardTitle>
              <CardDescription>{poll.responses} responses</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" size="sm">
                <Link href={`/polls/${poll.id}`}>View</Link>
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}


