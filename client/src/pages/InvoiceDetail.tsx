import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/api/invoice/${id}`);
        setInvoice(res.data);
        await console.log(invoice)
      } catch (err) {
        console.error("Failed to fetch invoice", err);
      }
    };

    fetchInvoice();
  }, [id]);

  if (!invoice) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <div className="p-4 space-y-4">
      <h1 className="text-2xl font-bold">Invoice Details</h1>

      <Card>
        <CardHeader>
          <CardTitle>{invoice.company.name}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</p>
          <p><strong>Total:</strong> ₹{invoice.total.toLocaleString()}</p>
          <p><strong>Type:</strong> {invoice.type}</p>

          <div>
            <h2 className="font-semibold">Products</h2>
            <ul className="list-disc ml-5">
              {invoice.products?.map((product: string, index: number) => (
                <li key={index}>{product}</li>
              ))}
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
