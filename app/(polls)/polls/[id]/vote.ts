"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function submitVote(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pollId = String(formData.get("poll_id") ?? "");
  const optionId = String(formData.get("option_id") ?? "");

  if (!pollId || !optionId) {
    throw new Error("Missing poll or option");
  }

  // For anonymous users, create a token cookie in a real app. For now, insert with voter_id (if authed) or voter_token placeholder.
  const payload: any = {
    poll_id: pollId,
    option_id: optionId,
  };
  if (user) {
    payload.voter_id = user.id;
  } else {
    payload.voter_token = "guest"; // placeholder; replace with cookie-based token later
  }

  const { error } = await supabase.from("votes").insert(payload);
  if (error) {
    // Ignore duplicate errors from unique constraints/trigger; still redirect to thank you
    // eslint-disable-next-line no-console
    console.error("vote error", error.message);
  }

  redirect(`/polls/${pollId}?voted=1`);
}
