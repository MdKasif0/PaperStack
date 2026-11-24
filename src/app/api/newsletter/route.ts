import { z } from "zod";

const bodySchema = z.object({ email: z.email().max(254) });

/**
 * Newsletter sign-up. No provider is integrated yet, so a valid request is
 * answered with 503 and nothing is stored or logged. Connect a provider here,
 * and return 200 only once it has accepted the address.
 */
export async function POST(request: Request) {
  const body: unknown = await request.json().catch(() => null);
  if (!bodySchema.safeParse(body).success) {
    return Response.json({ error: "invalid_email" }, { status: 400 });
  }
  return Response.json({ error: "not_configured" }, { status: 503 });
}
