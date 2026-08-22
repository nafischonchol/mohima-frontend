import { FloatingCart } from "@/components/customer/home/FloatingCart";
import { VisitorInitializer } from "@/components/auth/VisitorInitializer";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <VisitorInitializer />
      {children}
      <FloatingCart />
    </>
  );
}
