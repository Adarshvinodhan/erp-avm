import { useState, useEffect } from "react";
import api from "../../api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";

export default function InventoryPage() {
  interface Item {
    _id: number;
    name: string;
    brand: string;
    price: number;
    gst: string;
    subcategories: {
      _id: number;
      color: string;
      quantity: number;
      model: string;
      size: string;
      price: number;
    }[];
  }

  const [items, setItems] = useState<Item[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("api/items");
        setItems(res.data);
      } catch (err) {
        console.log(err);
      }
    };
    fetchItems();
  }, []);

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`api/item/${id}`);
      setItems(items.filter((item) => item._id !== id));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Inventory</h1>

      <div className="flex items-center gap-4 mb-4">
        <Input
          placeholder="Search items..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <Button
          className="flex items-center gap-2 font-bold"
          onClick={() => navigate("add-item")}
        >
          <Plus className="w-4 h-4" /> Add Item
        </Button>
      </div>

      <div className="border border-gray-200 rounded overflow-hidden">
        <div className="sm:max-h-[400px] max-h-[70vh] overflow-y-auto">
          <Table>
            <TableHeader className="bg-gray-100 sticky top-0 z-10">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Brand</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center text-gray-500">
                    No items found.
                  </TableCell>
                </TableRow>
              ) : (
                items.map((item) => (
                  <TableRow
                    key={item._id}
                    className="hover:bg-gray-50 cursor-pointer">
                    <TableCell  onClick={() => navigate(`/inventory/${item._id}`)}>{item.name}</TableCell>
                    <TableCell  onClick={() => navigate(`/inventory/${item._id}`)}>{item.brand}</TableCell>
                    <TableCell  onClick={() => navigate(`/inventory/${item._id}`)}>{item.price}</TableCell>
                    <TableCell  onClick={() => navigate(`/inventory/${item._id}`)}>{item.gst}</TableCell>
                    <TableCell><Pencil  onClick={() => navigate(`/inventory/${item._id}`)} className="h-4 w-4"/></TableCell>
                    <TableCell><Trash onClick={() => handleDelete(item._id)} className="h-4 w-4"/></TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
