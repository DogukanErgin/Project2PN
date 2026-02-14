import type { Metadata } from "next";
import { Container } from "@/src/components/ui/Container";
import { WifiAdminPanel } from "@/src/components/wifi/WifiAdminPanel";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Wi-Fi Admin | Peanuts",
  description: "Restricted panel for updating Wi-Fi credentials.",
  robots: {
    index: false,
    follow: false
  }
};

export default function WifiAdminPage() {
  return (
    <main className="min-h-screen py-6 sm:py-10">
      <Container className="max-w-3xl">
        <WifiAdminPanel />
      </Container>
    </main>
  );
}
