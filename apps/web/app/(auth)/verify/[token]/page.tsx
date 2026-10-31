import type { Metadata } from "next";
import { VerifyEmail } from "./VerifyEmail";

export const metadata: Metadata = {
  title: "Verify email · Vynq",
};

// The sign-up email links here: ${CLIENT_URL}/verify/<token>
export default async function VerifyPage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  return <VerifyEmail token={decodeURIComponent(token)} />;
}
