import AdminClient from "./AdminClient";

// Dashboard content is rendered on the client after the session is checked.
export const instant = false;

export default function Page() {
  return <AdminClient />;
}
