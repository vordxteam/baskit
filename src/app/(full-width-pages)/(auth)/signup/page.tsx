import SignUpForm from "@/components/auth/SignUpForm";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "SignUp",
  description: "This is SignUp Page",
};

export default function SignUp() {
  return <SignUpForm />;
}
