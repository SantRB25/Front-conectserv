import { auth } from "@/auth";

export async function getSessionData() {
  const session = await auth();
  return session?.user || null;
}
