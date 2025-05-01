import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import api from "../../api";
import { Button } from "@/components/ui/button";
import Spinner from "@/components/ui/spinner";

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
    return <Spinner/>
  }

  return (
<div className="p-4 space-y-4">
  {/* Hide Download button in print */}
  <div className="flex justify-end print:hidden">
    <Button onClick={handlePrint}>Download as PDF</Button>
  </div>

  {/* A4-sized Printable Container */}
  <div
    ref={printRef}
    className="invoice-a4 bg-white shadow text-black mx-auto border border-gray-300"
  >
    <div className="flex flex-col justify-between h-full p-8">
      {/* Top Content */}
      <div>
        {/* Company details */}
        <div className="text-center mb-6 border-b pb-4">
          <h2 className="text-2xl font-bold">Sri AVM Distributors</h2>
          <p className="text-sm">New Siddhapudur, Coimbatore, Tamil Nadu</p>
          <p className="text-sm">9943779718</p>
          <p className="text-sm">GST: 67647890-897657</p>
        </div>

        {/* Invoice Title & Date */}
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold">Invoice #{invoice._id.slice(-6)}</h3>
          <p className="text-sm">{new Date(invoice.date).toLocaleDateString()}</p>
        </div>

        {/* Bill To */}
        <div className="mb-6">
          <h4 className="text-md font-semibold mb-1">Bill To:</h4>
          <p className="text-sm">{invoice.company.name}</p>
          <p className="text-sm">{invoice.company.address}</p>
          <p className="text-sm">{invoice.company.phone}</p>
        </div>

        {/* Product Table */}
        <table className="w-full text-sm mb-6 border border-gray-300">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="border px-4 py-2 font-semibold">Product</th>
              <th className="border px-4 py-2 font-semibold">Quantity</th>
              <th className="border px-4 py-2 font-semibold text-right">Price</th>
            </tr>
          </thead>
          <tbody>
            {invoice.products.map((product: string, index: number) => (
              <tr key={index} className="border-t">
                <td className="border px-4 py-2">{product}</td>
                <td className="border px-4 py-2">{invoice.subItems[index]?.quantity}</td>
                <td className="border px-4 py-2 text-right">₹{invoice.subItems[index]?.price}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Total */}
        <div className="flex justify-end mb-4">
          <p className="text-lg font-semibold">Total: ₹{invoice.total}</p>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="text-center text-sm border-t pt-4">
        <p>Thank you for your business!</p>
      </div>
    </div>
  </div>
</div>


  );
}
