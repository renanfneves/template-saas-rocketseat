import { handleAuth } from "@/app/actions/handle-auth";
import { auth } from "@/app/lib/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Dashboard() {
  const session = await auth();

  if(!session) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-10 items-center justify-center h-screen">
      <div className="text-4xl font-bold">Protected Dashboard</div>
      <p>{session?.user?.email || "usuário não está logado"}</p>
      {
        session?.user?.email && (
          <form action={handleAuth}>
            <button type="submit" className="border rounded-md px-2 cursor-pointer">Logout</button>
          </form>
        )
      }
      <Link href="/pagamentos">Pagamentos</Link>
    </div>
  );
}