import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface PollPageProps {
  params: Promise<{ id: string }>;
}

export default async function PollDetailPage(props: PollPageProps) {
  const params = await props.params;
  const { id } = params;

  if (!id) return notFound();

  // Placeholder content; will fetch poll by id later
  const question = `Poll #${id}`;
  const options = ["Option A", "Option B", "Option C"];

  return (
    <main className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>{question}</CardTitle>
          <CardDescription>Choose one option and submit your vote.</CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-3">
            {options.map((opt) => (
              <label key={opt} className="flex items-center gap-3">
                <input name="option" type="radio" value={opt} className="h-4 w-4" />
                <span className="text-sm">{opt}</span>
              </label>
            ))}
          </form>
        </CardContent>
        <CardFooter className="flex justify-end">
          <Button type="submit">Vote</Button>
        </CardFooter>
      </Card>
    </main>
  );
}


