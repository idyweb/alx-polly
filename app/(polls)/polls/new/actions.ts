"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

function generateSlug(input?: string): string {
  const rand = Math.random().toString(36).slice(2, 8);
  if (!input) return rand;
  const base = input
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .slice(0, 24);
  return base ? `${base}-${rand}` : rand;
}

export async function createPoll(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/sign-in");

  const question = String(formData.get("question") ?? "").trim();
  const optionsRaw = String(formData.get("options") ?? "");
  const allowMultipleStr = String(formData.get("allow_multiple") ?? "false");
  const allowMultiple = allowMultipleStr === "true" || allowMultipleStr === "on";

  const options = optionsRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (!question || options.length < 2) {
    throw new Error("Question and at least two options are required");
  }

  const slug = generateSlug(question);

  // Insert poll
  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert({ owner_id: user.id, question, slug, allow_multiple: allowMultiple })
    .select("id")
    .single();

  if (pollError || !poll) {
    throw new Error(pollError?.message || "Failed to create poll");
  }

  // Insert options
  const optionRows = options.map((text, idx) => ({ poll_id: poll.id, text, idx }));
  const { error: optError } = await supabase.from("poll_options").insert(optionRows);
  if (optError) {
    throw new Error(optError.message || "Failed to add options");
  }

  redirect(`/polls?created=1`);
}


