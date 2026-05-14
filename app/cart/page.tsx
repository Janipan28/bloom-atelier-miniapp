import { Header } from "@/components/layout/Header";
import { CartClient } from "./CartClient";

export default function CartPage() {
  return (
    <>
      <Header title="Корзина" />
      <CartClient />
    </>
  );
}
