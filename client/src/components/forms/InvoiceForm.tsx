import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import api from "../../api"; 

interface SubItem {
  subId: string;
  quantity: number;
}

interface InvoiceFormProps {
  defaultType?: "Sales" | "Purchase";
  onSuccess?: () => void;
}

export default function InvoiceForm({ defaultType = "Sales", onSuccess }: InvoiceFormProps) {
  const [company, setCompany] = useState<string>("");
  const [item, setItem] = useState<string>("");
  const [type, setType] = useState<"Sales" | "Purchase" | "">(defaultType);
  const [date, setDate] = useState<string>("");
  const [total, setTotal] = useState<string>("");
  const [subItems, setSubItems] = useState<SubItem[]>([{ subId: "", quantity: 1 }]);

  const handleSubItemChange = (index: number, field: keyof SubItem, value: string) => {
    const updated = [...subItems];
    if (field === "quantity") {
      updated[index][field] = Number(value) as any;
    } else {
      updated[index][field] = value as any;
    }
    setSubItems(updated);
  };

  const addSubItem = () => {
    setSubItems([...subItems, { subId: "", quantity: 1 }]);
  };

  const submitInvoice = async () => {
    try {
      const payload = { company, item, type, date, total, subItems };
      await api.post("/api/invoice", payload);
      toast("Invoice Created Successfully");

      // Reset form
      setCompany("");
      setItem("");
      setType(defaultType);
      setDate("");
      setTotal("");
      setSubItems([{ subId: "", quantity: 1 }]);

      onSuccess?.();
    } catch (err: any) {
      toast("Error Creating Invoice");
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Create Invoice</h2>

      <div className="space-y-2">
        <Label>Company</Label>
        <Input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company ObjectId" />
      </div>

      <div className="space-y-2">
        <Label>Item ID</Label>
        <Input value={item} onChange={(e) => setItem(e.target.value)} placeholder="Main Item ObjectId" />
      </div>

      <div className="space-y-2">
        <Label>Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
      </div>

      <div className="space-y-2">
        <Label>Type</Label>
        <Select value={type} onValueChange={(value) => setType(value as "Sales" | "Purchase")}>
          <SelectTrigger>
            <SelectValue placeholder="Select Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Purchase">Purchase</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label>Total</Label>
        <Input value={total} onChange={(e) => setTotal(e.target.value)} placeholder="Total Amount" />
      </div>

      <div className="space-y-4">
        <Label>Sub Items</Label>
        {subItems.map((subItem, idx) => (
          <div key={idx} className="flex space-x-2 items-center">
            <Input
              value={subItem.subId}
              onChange={(e) => handleSubItemChange(idx, "subId", e.target.value)}
              placeholder="SubItem ObjectId"
            />
            <Input
              type="number"
              value={subItem.quantity}
              onChange={(e) => handleSubItemChange(idx, "quantity", e.target.value)}
              placeholder="Quantity"
            />
          </div>
        ))}
        <Button variant="outline" onClick={addSubItem}>
          Add Sub Item
        </Button>
      </div>

      <Button className="w-full" onClick={submitInvoice}>
        Create Invoice
      </Button>
    </div>
  );
}
