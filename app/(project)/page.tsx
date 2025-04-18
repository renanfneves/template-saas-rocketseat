import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-4xl font-bold">Landing Page</div>
      <Link href="/login">
        <button>Login</button>
      </Link>
    </div>
  );
}
