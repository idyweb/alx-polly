import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PollForm } from "@/components/forms/PollForm";

export default function NewPollPage() {
  return (
    <main className="container mx-auto max-w-2xl p-4">
      <Card>
        <CardHeader>
          <CardTitle>Create a new poll</CardTitle>
          <CardDescription>Define your question and add at least two options.</CardDescription>
        </CardHeader>
        <CardContent>
          <PollForm />
        </CardContent>
        <CardFooter className="flex justify-end gap-2">
          <Button variant="secondary">Cancel</Button>
          <Button>Create</Button>
        </CardFooter>
      </Card>
    </main>
  );
}


