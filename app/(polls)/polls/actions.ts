"use server";

import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function deletePoll(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/sign-in");

  const id = String(formData.get("poll_id") ?? "");
  if (!id) throw new Error("Missing poll id");

  const { error } = await supabase
    .from("polls")
    .delete()
    .eq("id", id)
    .eq("owner_id", user.id);

  if (error) throw new Error(error.message);

  redirect("/polls?deleted=1");
}


