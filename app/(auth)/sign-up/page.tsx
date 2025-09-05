import Link from "next/link";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignUpForm } from "@/components/forms/SignUpForm";

export default async function SignUpPage() {
  const supabase = await createSupabaseServerClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/polls");
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center p-4">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle>Create account</CardTitle>
          <CardDescription>Join to start creating and voting on polls.</CardDescription>
        </CardHeader>
        <CardContent>
          <SignUpForm />
        </CardContent>
        <CardFooter className="flex items-center justify-between">
          <span className="text-sm text-gray-600 dark:text-gray-400">Already have an account?</span>
          <Button asChild variant="link" size="sm">
            <Link href="/sign-in">Sign in</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}


