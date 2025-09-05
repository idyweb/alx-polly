import Link from "next/link";

export default function EditPollPage() {
  return (
    <main className="container mx-auto max-w-2xl p-4">
      <h1 className="text-xl font-semibold mb-2">Edit poll</h1>
      <p className="text-sm text-gray-600 dark:text-gray-400">Coming soon.</p>
      <div className="mt-4">
        <Link href="/polls" className="underline">Back to polls</Link>
      </div>
    </main>
  );
}


