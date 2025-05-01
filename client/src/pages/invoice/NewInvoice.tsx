import { useEffect, useState } from "react";

import { toast } from "sonner";
import api from "../../api";
import {
  Card,
  CardContent,
} from "@/components/ui/card";
import {
  Button
} from "@/components/ui/button";
import {
  Input
} from "@/components/ui/input";
import {
  Label
} from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

interface Company {
  _id: string;
  name: string;
}

interface Item {
  _id: string;
  name: string;
  subcategories: SubItem[];
}

interface SubItem {
  _id: string;
  color?: string;
  size?: string;
  model?: string;
  price: number;
  quantity: number;
}

export default function CreateInvoice() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [items, setItems] = useState<Item[]>([]);
  const [selectedCompany, setSelectedCompany] = useState("");
  const [invoiceItems, setInvoiceItems] = useState<any[]>([]);
  const [type, setType] = useState<"Sales" | "Purchase" | "">("");
  const [total, setTotal] = useState(0);

  useEffect(() => {    //Store company and Item data to state
    api.get("/api/companies").then((res) => setCompanies(res.data));
    api.get("/api/items").then((res) => setItems(res.data));
  }, []);

  useEffect(() => {
    const totalSum = invoiceItems.reduce((acc, item) => {
      return (
        acc +
        item.subItems.reduce(
          (s: number, sub: any) => s + sub.quantity * sub.price,
          0
        )
      );
    }, 0);
    setTotal(totalSum);
  }, [invoiceItems]);

  const handleAddMainItem = () => {    //creating empty inputs for adding new Item
    setInvoiceItems([
      ...invoiceItems,
      {
        itemId: "",
        subItems: [],
        availableSubItems: [],
      },
    ]);
  };

  const handleItemChange = (index: number, itemId: string) => {
    const item = items.find((i) => i._id === itemId);
    const updated = [...invoiceItems];
    updated[index].itemId = itemId;
    updated[index].availableSubItems = item?.subcategories || [];
    updated[index].subItems = [];
    setInvoiceItems(updated);
  };

  const handleAddSubItem = (itemIndex: number) => {    //creating empty inputs for new sub
    const updated = [...invoiceItems];
    updated[itemIndex].subItems.push({
      subId: "",
      quantity: 1,
      price: 0,
    });
    setInvoiceItems(updated);
  };

  const handleSubItemChange = (
    itemIndex: number,
    subIndex: number,
    field: string,
    value: any
  ) => {
    const updated = [...invoiceItems];
    updated[itemIndex].subItems[subIndex][field] =
      field === "quantity" || field === "price" ? Number(value) : value;

    if (field === "subId") {
      const selectedSub = invoiceItems[itemIndex].availableSubItems.find(
        (s: any) => s._id === value
      );
      if (selectedSub) {
        updated[itemIndex].subItems[subIndex].price = selectedSub.price || 0;
      }
    }

    setInvoiceItems(updated);
  };

  const handleSubmit = async () => {
    try {
      const formatted = {
        company: selectedCompany,
        type,
        total,
        date: new Date(),
        products: invoiceItems.map((item) => {
          const mainItem = items.find((i) => i._id === item.itemId);
          const mainItemName = mainItem?.name || "Unknown Item";
  
          return item.subItems.map((sub: any) => {
            const subItem = (mainItem?.subcategories || []).find(
              (s) => s._id === sub.subId
            );
            const subItemcolor = subItem?.color  || "Unknown SubItem";
            const subItemModel = subItem?.model  || "Unknown SubItem";
            const subItemSize = subItem?.size  || "Unknown SubItem";
            const price = sub.price || 0;
            return `${mainItemName} - ${subItemModel} - ${subItemcolor} - ${subItemSize} - ₹${price}`;
          });
        }).flat(),
        subItems: invoiceItems.flatMap((item) => item.subItems),
        item: invoiceItems.map((i) => i.itemId),
      };
      await console.log(formatted)
      
  
      await api.post("/api/invoice", formatted);
      toast.success("Invoice Created Successfully");
    } catch (err) {
      toast.warning("Error creating invoice");
    }
  };
  

  return (
<Card className="w-full mx-auto  space-y-8 shadow-lg rounded-2xl bg-white print:bg-white">
  <CardContent className="space-y-8 text-base">
    {/* Invoice Header */}
    <div className="grid md:grid-cols-3 gap-6 border-b pb-6">
      <div>
        <Label className="text-base font-medium">Company</Label>
        <Select onValueChange={setSelectedCompany}>
          <SelectTrigger className="h-10 text-base mt-1">
            <SelectValue placeholder="Select a company" />
          </SelectTrigger>
          <SelectContent>
            {companies.map((c) => (
              <SelectItem key={c._id} value={c._id}>
                {c.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-medium">Invoice Type</Label>
        <Select onValueChange={(v) => setType(v as "Sales" | "Purchase")}>
          <SelectTrigger className="h-10 text-base mt-1">
            <SelectValue placeholder="Select type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Sales">Sales</SelectItem>
            <SelectItem value="Purchase">Purchase</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label className="text-base font-medium">Date</Label>
        <div className="h-10 flex items-center mt-1">
          {new Date().toLocaleDateString()}
        </div>
      </div>
    </div>

    {/* Invoice Line Items Table */}
    <div className="border-t pt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Invoice Items</h3>
        <Button variant="outline" onClick={handleAddMainItem}>
          + Add Item
        </Button>
      </div>

      {invoiceItems.map((item, itemIndex) => (
        <div key={itemIndex} className="space-y-4 border rounded-lg p-4 bg-gray-50">
          {/* Item Header */}
          <div className="mb-4">
            <Label className="text-base font-semibold">Item #{itemIndex + 1}</Label>
            <Select
              onValueChange={(v) => handleItemChange(itemIndex, v)}
              value={item.itemId}
            >
              <SelectTrigger className="h-10 mt-1 text-base">
                <SelectValue placeholder="Select Item" />
              </SelectTrigger>
              <SelectContent>
                {items.map((i) => (
                  <SelectItem key={i._id} value={i._id}>
                    {i.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Subitems as Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-auto text-sm border">
              <thead className="bg-gray-200 text-left">
                <tr>
                  <th className="p-2">Subcategory</th>
                  <th className="p-2">Quantity</th>
                  <th className="p-2">Price</th>
                  <th className="p-2">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {item.subItems.map((sub: any, subIndex: number) => (
                  <tr key={subIndex} className="border-t">
                    <td className="p-2">
                      <Select
                        onValueChange={(v) =>
                          handleSubItemChange(itemIndex, subIndex, "subId", v)
                        }
                        value={sub.subId}
                      >
                        <SelectTrigger className="h-10 text-sm">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent>
                          {item.availableSubItems.map((s: SubItem) => (
                            <SelectItem key={s._id} value={s._id}>
                              {`${s.color || ""} ${s.size || ""} ${s.model || ""}`.trim()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={sub.quantity}
                        min={1}
                        onChange={(e) =>
                          handleSubItemChange(itemIndex, subIndex, "quantity", e.target.value)
                        }
                        className="h-10"
                      />
                    </td>
                    <td className="p-2">
                      <Input
                        type="number"
                        value={sub.price}
                        onChange={(e) =>
                          handleSubItemChange(itemIndex, subIndex, "price", e.target.value)
                        }
                        className="h-10"
                      />
                    </td>
                    <td className="p-2 font-semibold">
                      ₹{(sub.price * sub.quantity).toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <Button
            variant="ghost"
            className="mt-2 text-sm"
            onClick={() => handleAddSubItem(itemIndex)}
          >
            + Add Sub Item
          </Button>
        </div>
      ))}
    </div>

    {/* Invoice Footer */}
    <div className="flex justify-end items-center mt-6">
      <div className="text-xl font-bold">Total: ₹{total.toFixed(2)}</div>
    </div>

    <Button className="w-full text-lg py-6" onClick={handleSubmit}>
      Create Invoice
    </Button>
  </CardContent>
</Card>

  );
}
