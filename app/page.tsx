import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "./api/auth/[...nextauth]/route";
import { User } from "./user";
import { DashButton, LoginButton, LogoutButton } from "./auth";

// Why am I showing both here? If you log in and go to the homepage you'll see both the server-side and client side calls. Hit page refresh and pay close
// attention to the latency between when the server call loads and when the client call loads. The reason for this is because the client needs to query the
// server, decode the JWT hash, and send the information back. Whereas on the server-side call this is done on page load. Wherever possible, server-side calls
// are the preferred means of grabbing this information.

export default async function Home() {
  const session = await getServerSession(authOptions);

  return (
    <main>
      <LoginButton />
      <LogoutButton />
      <DashButton />
      <h2>Server-side Call:</h2>
      <pre>{JSON.stringify(session)}</pre>
      <h2>Client-side Call:</h2>
      <User />
    </main>
  );
}
