import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
        
      </Card>
    </main>
  );
}


