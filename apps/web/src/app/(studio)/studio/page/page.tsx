import { redirect } from "next/navigation";

export default function PageEditorPage() {
  // Temporary redirect to profile
  // TODO: Build dedicated "Meine Seite" editor with sections (Phase 3)
  redirect("/studio/profile");
}
