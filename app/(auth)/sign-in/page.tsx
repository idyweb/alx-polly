import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignInForm } from "@/components/forms/SignInForm";

export default async function SignInPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/polls");
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Sign in</CardTitle>
          <CardDescription>Access your account to vote and create polls.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignInForm />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">New here?</span>
          <Button asChild variant="link" size="sm">
            <Link href="/sign-up">Create an account</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


