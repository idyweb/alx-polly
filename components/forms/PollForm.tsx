"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { createPoll } from "@/app/(polls)/polls/new/actions";

export function PollForm() {
  return (
    <form className="grid gap-4" action={createPoll}>
      <div className="grid gap-2">
        <Label htmlFor="question">Question</Label>
        <Input id="question" name="question" placeholder="What do you want to ask?" required />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="options">Options (one per line)</Label>
        <Textarea id="options" name="options" placeholder={"Option A\nOption B"} required />
      </div>
      <div className="flex items-center gap-2">
        <input id="allow_multiple" name="allow_multiple" type="checkbox" className="h-4 w-4" />
        <Label htmlFor="allow_multiple">Allow selecting multiple options</Label>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary">Cancel</Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}

export default PollForm;


