import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus } from "lucide-react";

interface Purchase {
  id: string;
  vendor: string;
  amount: number;
  date: string;
}

const dummyPurchases: Purchase[] = [
  { id: "1", vendor: "ABC Traders", amount: 5000, date: "2025-04-25" },
  { id: "2", vendor: "XYZ Supplies", amount: 3000, date: "2025-04-24" },
  { id: "3", vendor: "Global Parts", amount: 4500, date: "2025-04-23" },
];

export default function PurchasePage() {
  const [search, setSearch] = useState("");
  const filteredPurchases = dummyPurchases.filter((purchase) =>
    purchase.vendor.toLowerCase().includes(search.toLowerCase())
  );

  const total = dummyPurchases.reduce((sum, purchase) => sum + purchase.amount, 0);

  return (
    <div className="p-4 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Purchase Dashboard</h1>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Purchase
        </Button>
      </div>

      <Card className="bg-green-50 border-green-200">
        <CardHeader>
          <CardTitle>Total Purchases</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-3xl font-semibold text-green-600">₹{total.toLocaleString()}</p>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Recent Purchases</h2>
        <Input
          placeholder="Search by vendor"
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
              <TableHead>Vendor</TableHead>
              <TableHead>Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredPurchases.length === 0 ? (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-gray-500">
                  No purchases found.
                </TableCell>
              </TableRow>
            ) : (
              filteredPurchases.map((purchase) => (
                <TableRow key={purchase.id}>
                  <TableCell>{purchase.date}</TableCell>
                  <TableCell>{purchase.vendor}</TableCell>
                  <TableCell>₹{purchase.amount.toLocaleString()}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
