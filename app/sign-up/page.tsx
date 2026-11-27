import { Suspense } from "react";
import SignUpForm from "@/components/auth/SignUpForm";
export const metadata = { title: "Sign Up – MentorLagbe" };
export default function SignUpPage() { return <Suspense><SignUpForm /></Suspense>; }
