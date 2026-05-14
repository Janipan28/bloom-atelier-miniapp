import { Header } from "@/components/layout/Header";
import { ConsultationClient } from "./ConsultationClient";

export default function ConsultationPage() {
  return (
    <>
      <Header title="Спросить флориста" showBack />
      <ConsultationClient />
    </>
  );
}
