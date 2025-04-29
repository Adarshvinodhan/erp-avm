import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import InvoiceForm from "../components/forms/InvoiceForm"; 
interface Sale {
  id: string;
  customer: string;
  amount: number;
  date: string;
}

const dummySales: Sale[] = [
  { id: "1", customer: "John Doe", amount: 1200, date: "2025-04-25" },
  { id: "2", customer: "Jane Smith", amount: 850, date: "2025-04-24" },
  { id: "3", customer: "Bob Johnson", amount: 400, date: "2025-04-23" },
];

export default function SalePage() {
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);

  const filteredSales = dummySales.filter((sale) =>
    sale.customer.toLowerCase().includes(search.toLowerCase())
  );

  const total = dummySales.reduce((sum, sale) => sum + sale.amount, 0);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Sales Dashboard</h1>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Sale
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <InvoiceForm defaultType="Sales" onSuccess={() => setOpen(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle>Total Sales</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-blue-600">₹{total.toLocaleString()}</p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Sales</h2>
        <Input
          placeholder="Search by customer"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-64"
        />
      </div>

      <div className="border rounded overflow-hidden">
        <Table>
          <TableHeader className="bg-gray-100 sticky top-0 z-10">
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
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
                <TableRow key={sale.id}>
                  <TableCell>{sale.date}</TableCell>
                  <TableCell>{sale.customer}</TableCell>
                  <TableCell>₹{sale.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
