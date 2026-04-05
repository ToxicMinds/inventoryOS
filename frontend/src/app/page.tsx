import { redirect } from "next/navigation";

export default function Home() {
  // InventoryOS defaults to dashboard. If unauthenticated, middleware will catch this.
  redirect("/dashboard");
}
