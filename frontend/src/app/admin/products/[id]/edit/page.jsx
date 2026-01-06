"use client";

import { useParams } from "next/navigation";
import AdminProductForm from "../../../../../components/AdminProductForm";

export default function EditProductPage() {
  const params = useParams();
  const id = params?.id;

  if (!id) return null;

  return <AdminProductForm mode="edit" productId={String(id)} />;
}
