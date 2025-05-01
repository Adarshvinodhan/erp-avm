import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import api from "../../api";
import { Button } from "@/components/ui/button";

export default function InvoiceDetailPage() {
  const { id } = useParams();
  const [invoice, setInvoice] = useState<any>(null);
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: printRef, // Pass the ref of the content to print
    documentTitle: "Invoice",

    onAfterPrint: () => console.log("Print finished!"),

    suppressErrors: true, // Optional: suppress print errors
    pageStyle: "body { font-family: Arial, sans-serif; }", // Optional: custom page styles
  });

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const res = await api.get(`/api/invoice/${id}`);
        setInvoice(res.data);
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
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Invoice</h1>
        <Button onClick={handlePrint}>Download as PDF</Button>
      </div>

      {/* Printable Invoice content */}
      <div
        ref={printRef}
        className="invoice-container bg-white shadow-md text-gray-800"
      >
        {/* Company details */}
        <div className="invoice-header mb-6">
          <h2 className="text-2xl font-bold">Sri AVM Distributors</h2>
          <p className="text-sm text-gray-500">New Siddhapudur, Coimbatore, Tamil Nadu</p>
          <p className="text-sm text-gray-500">9943779718</p>
          <p className="text-sm text-gray-500">GST: 67647890-897657</p>
        </div>

        {/* Invoice Title */}
        <div className="invoice-title">
          <h3>Invoice #{invoice._id.slice(-6)}</h3>
          <p className="text-sm text-gray-500">
            {new Date(invoice.date).toLocaleDateString()}
          </p>
        </div>

        {/* Invoice Body */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-xl font-bold">Bill To:</h4>
            <p>{invoice.company.name}</p>
            <p className="text-sm text-gray-600">{invoice.company.address}</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold">Invoice Type: {invoice.type}</p>
          </div>
        </div>

        {/* Product Table */}
        <table className="w-full text-sm mb-4">
          <thead>
            <tr className="text-left border-b">
              <th className="py-2">Product</th>
              <th className="py-2">Qty</th>
              <th className="py-2 text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((product: string, index: number) => (
              <tr key={index} className="border-b">
                <td className="py-2">{product}</td>
                <td className="py-2">{invoice.subItems[index]?.quantity}</td>
                <td className="py-2 text-right">₹{invoice.subItems[index]?.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total Calculation */}
        <div className="total">
          <p>Total: ₹{invoice.total}</p>
        </div>

        {/* Footer */}
        <div className="footer">
          <p>Thank you for your business!</p>
        </div>
      </div>
    </div>
  );
}
