import { useState, useEffect } from "react";
import api from '../api'
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Plus, Pencil, Trash, Save, X } from "lucide-react";
import { toast } from "sonner";
import SubcategoryTablePopup from "./ItemDetailPopup";
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
  const [editItemId, setEditItemId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<Partial<Item>>({});
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [showSubPopup, setShowSubPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();


  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get('api/items');
        setItems(res.data);
      }
      catch (err) {
        console.log(err)
      }
    }
    fetchItems();
  }, [])

  const handleEdit = (item: Item) => {
    setEditItemId(item._id);
    setEditedItem(item);
  };

  const handleSave = async () => {
    try {
      await api.put(`api/item/${editItemId}`, editedItem);
      const updatedItems = items.map((item) =>
        item._id === editItemId ? { ...item, ...editedItem } : item
      );
      setItems(updatedItems);
      setEditItemId(null);
      setEditedItem({});
    } catch (error) {
      console.error("Error saving item:", error);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`api/item/${id}`);
      setItems(items.filter((item) => item._id !== id));
      toast.success("Item deleted successfully");
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  const handleSubDelete = async (itemId: number, subId: number) => {
    try {
      await api.delete(`api/item/${itemId}/sub/${subId}`);
      const updatedItems = items.map((item) =>
        item._id === itemId
          ? {
              ...item,
              subcategories: item.subcategories.filter(
                (sub) => sub._id !== subId
              ),
            }
          : item
      );
      setItems(updatedItems);
      toast.success("Subcategory deleted successfully");
    } catch (error) {
      console.error("Error deleting subcategory:", error);
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
          onClick={()=>navigate('add-item')}
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
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => {
                      if (editItemId !== item._id) {
                        setSelectedItem(item);
                        setShowSubPopup(true);
                      }
                    }}
                  >
                    <TableCell>
                      {editItemId === item._id ? (
                        <Input
                          value={editedItem.name || ""}
                          onChange={(e) =>
                            setEditedItem({ ...editedItem, name: e.target.value })
                          }
                        />
                      ) : (
                        item.name
                      )}
                    </TableCell>
                    <TableCell>
                      {editItemId === item._id ? (
                        <Input
                          value={editedItem.brand || ""}
                          onChange={(e) =>
                            setEditedItem({ ...editedItem, brand: e.target.value })
                          }
                        />
                      ) : (
                        item.brand
                      )}
                    </TableCell>
                    <TableCell>
                      {editItemId === item._id ? (
                        <Input
                          type="number"
                          value={editedItem.price || 0}
                          onChange={(e) =>
                            setEditedItem({ ...editedItem, price: Number(e.target.value) })
                          }
                        />
                      ) : (
                        `₹${item.price}`
                      )}
                    </TableCell>
                    <TableCell>
                      {editItemId === item._id ? (
                        <Input
                          value={editedItem.gst || ""}
                          onChange={(e) =>
                            setEditedItem({ ...editedItem, gst: e.target.value })
                          }
                        />
                      ) : (
                        item.gst
                      )}
                    </TableCell>
                    <TableCell>
                      {editItemId === item._id ? (
                        <div className="flex gap-2">
                          <Button size="icon" onClick={handleSave}>
                            <Save className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="outline" onClick={() => setEditItemId(null)}>
                            <X className="w-4 h-4" />
                          </Button>
                        </div>
                      ) : (
                        <div className="flex gap-2">
                          <Button size="icon" variant="ghost" onClick={(e) => {
                            e.stopPropagation();
                            handleEdit(item);
                          }}>
                            <Pencil className="w-4 h-4" />
                          </Button>
                          <Button size="icon" variant="destructive" onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(item._id);
                          }}>
                            <Trash className="w-4 h-4" />
                          </Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>

          </Table>
        </div>
      </div>

      {/* Subcategory Table as Popup */}
      {selectedItem && (
        <SubcategoryTablePopup
          open={showSubPopup}
          onSave = {handleSave}
          onClose={() => setShowSubPopup(false)}
          deleteSubcategory={handleSubDelete}
          itemName={selectedItem.name}
          itemId={selectedItem._id}
          subcategories={selectedItem.subcategories.map((sub) => ({
            id: sub._id,
            ...sub,
          }))}
        />
      )}
    </div>
  );
}
