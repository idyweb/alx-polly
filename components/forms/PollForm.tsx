"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export function PollForm() {
  return (
    <form className="grid gap-4">
      <div className="grid gap-2">
        <Label htmlFor="question">Question</Label>
        <Input id="question" placeholder="What do you want to ask?" />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="options">Options (one per line)</Label>
        <Textarea id="options" placeholder={"Option A\nOption B"} />
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="secondary">Cancel</Button>
        <Button type="submit">Create</Button>
      </div>
    </form>
  );
}

export default PollForm;


