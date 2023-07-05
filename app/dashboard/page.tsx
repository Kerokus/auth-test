import { HomeButton, LogoutButton } from "../auth";

export default function Dashboard() {
  return (
    <div>
      <HomeButton />
      <LogoutButton />
      <h1>IDSG Super Secret Dashboard Page</h1>
    </div>
  );
}
