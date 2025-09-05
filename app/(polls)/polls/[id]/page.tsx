import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { submitVote } from "./vote";

interface PollPageProps {
  params: Promise<{ id: string }>;
  searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function PollDetailPage(props: PollPageProps) {
  const params = await props.params;
  const sp = props.searchParams ? await props.searchParams : undefined;
  const { id } = params;

  if (!id) return notFound();

  const supabase = await createSupabaseServerClient();
  const { data: poll } = await supabase
    .from("polls")
    .select("id, question")
    .eq("id", id)
    .single();
  if (!poll) return notFound();

  const { data: options } = await supabase
    .from("poll_options")
    .select("id, text")
    .eq("poll_id", id)
    .order("idx", { ascending: true });

  return (
    <main className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>{poll.question}</CardTitle>
          <CardDescription>Choose one option and submit your vote.</CardDescription>
        </CardHeader>
        <CardContent>
          {sp?.voted === "1" ? (
            <div className="rounded-md border border-green-300 bg-green-50 text-green-800 p-3 text-sm">Thank you for voting!</div>
          ) : (
            <form className="space-y-3" action={submitVote}>
              <input type="hidden" name="poll_id" value={poll.id as string} />
              {(options ?? []).map((opt) => (
                <label key={opt.id} className="flex items-center gap-3">
                  <input name="option_id" type="radio" value={opt.id as string} className="h-4 w-4" required />
                  <span className="text-sm">{opt.text}</span>
                </label>
              ))}
              <div className="flex justify-end">
                <Button type="submit">Vote</Button>
              </div>
            </form>
          )}
        </CardContent>
        <CardFooter />
      </Card>
    </main>
  );
}


