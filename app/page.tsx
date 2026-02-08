import { redirect } from "next/navigation";
import { defaultLocale } from "@/src/content/site";

export default function RootPage() {
  redirect(`/${defaultLocale}`);
}
