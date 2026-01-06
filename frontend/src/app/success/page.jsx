import Link from "next/link";

export default function SuccessPage({ searchParams }) {
  const orderId = searchParams?.orderId;

  return (
    <main style={{ padding: 24 }}>
      <h1>✅ Order placed!</h1>
      <p>Order ID: <b>{orderId}</b></p>
      <Link href="/">Back to shop</Link>
    </main>
  );
}
