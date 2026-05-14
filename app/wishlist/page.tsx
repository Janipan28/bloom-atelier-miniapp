import { Header } from "@/components/layout/Header";
import { WishlistClient } from "./WishlistClient";

export default function WishlistPage() {
  return (
    <>
      <Header title="Избранное" />
      <WishlistClient />
    </>
  );
}
