import PageClient from "./PageClient";

// Dashboard content renders on the client after the session is checked.
export const instant = false;

export default function Page() {
  return <PageClient />;
}
