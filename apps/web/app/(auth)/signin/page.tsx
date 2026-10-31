import type { Metadata } from "next";
import { RedirectIfSignedIn } from "@/components/RedirectIfSignedIn";
import { SignInForm } from "./SignInForm";

export const metadata: Metadata = {
  title: "Sign in · Vynq",
};

export default function SignInPage() {
  return (
    <>
      <RedirectIfSignedIn />
      <SignInForm />
    </>
  );
}
