import { handleAuth } from "@/app/actions/handle-auth";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <div className="text-4xl font-bold mb-10 ">Login</div>
      <form action={handleAuth}>
        <button type="submit" className="border rounded-md px-2 cursor-pointer">Signin with Google</button>
      </form>
    </div>
  );
}