import type { Metadata } from "next";
import { RedirectIfSignedIn } from "@/components/RedirectIfSignedIn";
import { SignUpForm } from "./SignUpForm";

export const metadata: Metadata = {
  title: "Create account · Vynq",
};

export default function SignUpPage() {
  return (
    <>
      <RedirectIfSignedIn />
      <SignUpForm />
    </>
  );
}
