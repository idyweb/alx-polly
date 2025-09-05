"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

// Types
export type CreatePollInput = {
  question: string;
  options: string[];
  allowMultiple: boolean;
};

export type ActionResult<T = unknown> = {
  ok: boolean;
  data?: T;
  error?: string;
};

// Utilities
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

function parseCreatePollInput(formData: FormData): ActionResult<CreatePollInput> {
  const question = String(formData.get("question") ?? "").trim();
  const optionsRaw = String(formData.get("options") ?? "");
  const allowMultipleStr = String(formData.get("allow_multiple") ?? "false");
  const allowMultiple = allowMultipleStr === "true" || allowMultipleStr === "on";

  const options = optionsRaw
    .split(/\r?\n/)
    .map((s) => s.trim())
    .filter((s) => s.length > 0);

  if (!question) return { ok: false, error: "Question is required" };
  if (options.length < 2) return { ok: false, error: "Provide at least two options" };

  return { ok: true, data: { question, options, allowMultiple } };
}

async function requireUser() {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.auth.getUser();
  if (error) return { ok: false, error: error.message } as ActionResult;
  if (!data.user) return { ok: false, error: "UNAUTHENTICATED" } as ActionResult;
  return { ok: true, data: { supabase, user: data.user } } as ActionResult<{ supabase: any; user: { id: string } }>;
}

// Actions
export async function createPoll(formData: FormData) {
  const auth = await requireUser();
  if (!auth.ok) {
    if (auth.error === "UNAUTHENTICATED") redirect("/sign-in");
    throw new Error(auth.error || "Authentication error");
  }
  const { supabase, user } = auth.data!;

  const parsed = parseCreatePollInput(formData);
  if (!parsed.ok) throw new Error(parsed.error);
  const { question, options, allowMultiple } = parsed.data!;

  const slug = generateSlug(question);

  const { data: poll, error: pollError } = await supabase
    .from("polls")
    .insert({ owner_id: user.id, question, slug, allow_multiple: allowMultiple })
    .select("id")
    .single();
  if (pollError || !poll) throw new Error(pollError?.message || "Failed to create poll");

  const optionRows = options.map((text, idx) => ({ poll_id: poll.id, text, idx }));
  const { error: optError } = await supabase.from("poll_options").insert(optionRows);
  if (optError) throw new Error(optError.message || "Failed to add options");

  redirect(`/polls?created=1`);
}

export async function deletePoll(formData: FormData) {
  const auth = await requireUser();
  if (!auth.ok) {
    if (auth.error === "UNAUTHENTICATED") redirect("/sign-in");
    throw new Error(auth.error || "Authentication error");
  }
  const { supabase, user } = auth.data!;

  const id = String(formData.get("poll_id") ?? "");
  if (!id) throw new Error("Missing poll id");

  const { error } = await supabase
    .from("polls")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);
  if (error) throw new Error(error.message || "Failed to delete poll");

  redirect("/polls?deleted=1");
}


