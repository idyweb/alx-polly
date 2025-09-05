import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SignInForm } from "@/components/forms/SignInForm";

export default function SignInPage() {
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


