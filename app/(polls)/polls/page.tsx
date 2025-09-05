import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { deletePoll } from "./actions";

// Placeholder data for scaffolding
const mockPolls = [
  { id: "1", question: "What is your favorite programming language?", responses: 42 },
  { id: "2", question: "Tabs or spaces?", responses: 58 },
];

export default async function PollsPage({ searchParams }: { searchParams?: Promise<Record<string, string | string[] | undefined>> }) {
  const sp = searchParams ? await searchParams : undefined;
  const created = sp?.created === "1";
  const deleted = sp?.deleted === "1";
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: polls } = await supabase
    .from("polls")
    .select("id, question, owner_id, created_at")
    .order("created_at", { ascending: false });

  return (
    <main className="container mx-auto max-w-3xl p-4 space-y-6">
      {created ? (
        <div className="rounded-md border border-green-300 bg-green-50 text-green-800 p-3 text-sm">
          Poll created successfully.
        </div>
      ) : null}
      {deleted ? (
        <div className="rounded-md border border-yellow-300 bg-yellow-50 text-yellow-800 p-3 text-sm">
          Poll deleted.
        </div>
      ) : null}
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
        {(polls ?? []).map((poll) => (
          <Card key={poll.id}>
            <CardHeader>
              <CardTitle className="text-base">
                <Link href={`/polls/${poll.id}`} className="hover:underline">
                  {poll.question}
                </Link>
              </CardTitle>
              <CardDescription>Created {new Date(poll.created_at as string).toLocaleString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="secondary" size="sm">
                <Link href={`/polls/${poll.id}`}>View</Link>
              </Button>
              {user?.id === poll.owner_id ? (
                <div className="inline-flex gap-2 ml-3">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/polls/${poll.id}/edit`}>Edit</Link>
                  </Button>
                  <form action={deletePoll}>
                    <input type="hidden" name="poll_id" value={poll.id as string} />
                    <Button type="submit" variant="destructive" size="sm">Delete</Button>
                  </form>
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}


