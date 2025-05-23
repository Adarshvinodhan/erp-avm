import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Link } from "react-router-dom";
import api from "../api";

interface Invoice {
  _id: string;
  companyId: {
    _id: string;
    name: string;
  };
  total: number;
  date: string;
  type: string;
}

export default function SalePage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [search, setSearch] = useState("");

  useEffect(()=>{
    console.log(invoices)
  },[invoices])

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const res = await api.get("/api/invoices/sales");
        setInvoices(res.data.invoices);
        console.log(res.data.invoices)
      } catch (err) {
        console.error("Failed to fetch invoices", err);
      }
    };

    fetchInvoices();
  }, []);

  const filteredSales = invoices.filter((inv) =>
    inv.companyId.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
<div className="p-4 max-w-5xl mx-auto space-y-6"> 
  <div className="flex justify-around items-center">
    <h1 className="text-2xl font-bold">Sales Dashboard</h1>
    <Link to="/new-invoice" className="flex items-center rounded-full bg-black text-white">
      <Plus className="w-6 h-6" />
    </Link>
  </div>
  <div className="flex justify-between items-center">
    <h2 className="text-lg font-semibold">Recent Sales</h2>
    <Input
      placeholder="Search by company name"
      value={search}
      onChange={(e) => setSearch(e.target.value)}
      className="w-full max-w-md" // wider search bar
    />
  </div>

  <div className="border rounded overflow-hidden">
    <Table>
      <TableHeader className="bg-gray-100 sticky top-0 z-10">
        <TableRow>
          <TableHead>Date</TableHead>
          <TableHead>Company</TableHead>
          <TableHead>Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {filteredSales.length === 0 ? (
          <TableRow>
            <TableCell colSpan={3} className="text-center text-gray-500">
              No sales found.
            </TableCell>
          </TableRow>
        ) : (
          filteredSales.map((sale) => (
            <Link to={`/invoices/${sale._id}`} key={sale._id} className="contents">
              <TableRow className="cursor-pointer hover:bg-gray-50">
                <TableCell>{new Date(sale.date).toLocaleDateString()}</TableCell>
                <TableCell>{sale.companyId.name}</TableCell>
                <TableCell>₹{sale.total.toLocaleString()}</TableCell>
              </TableRow>
            </Link>
          ))
        )}
      </TableBody>
    </Table>
  </div>
</div>

  );
}
