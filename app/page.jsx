import Image from "next/image";
import { logout } from "./logout/actions";

export default function Home() {
  return (
    <main>
    <form action={logout}>
      <button type="submit">
        logout
      </button>
    </form>    
    <div className="flex w-full h-full justify-center">
      <h1 className="text-xl text-red-500">
        Welcome to Optimanifacture
      </h1>
    </div>
    </main>
  );
}
