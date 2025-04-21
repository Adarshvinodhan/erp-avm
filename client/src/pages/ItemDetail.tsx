import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../api";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Subcategory {
  _id: number;
  color: string;
  quantity: number;
  model: string;
  size: string;
  price: number;
}

interface Item {
  _id: number;
  name: string;
  brand: string;
  price: number;
  gst: string;
  subcategories: Subcategory[];
}

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/api/item/${id}`);
        setItem(res.data);
      } catch (err) {
        console.error("Failed to fetch item:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItem();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!item) return;
    const { name, value } = e.target;
    setItem({ ...item, [name]: name === "price" ? Number(value) : value });
  };

  const handleSubcategoryChange = (
    index: number,
    field: keyof Subcategory,
    value: string
  ) => {
    if (!item) return;
    const updatedSubcategories = [...item.subcategories];
    (updatedSubcategories[index] as any)[field] =
      field === "price" || field === "quantity" ? Number(value) : value;
    setItem({ ...item, subcategories: updatedSubcategories });
  };

  const handleAddSubcategory = () => {
    if (!item) return;
    const newSub: Subcategory = {
      _id: Date.now(), // temporary unique ID
      model: "",
      color: "",
      size: "",
      quantity: 0,
      price: 0,
    };
    setItem({ ...item, subcategories: [...item.subcategories, newSub] });
  };

  const handleSave = async () => {
    try {
      const sanitizedSubcategories = item?.subcategories.map(
        ({ _id, ...rest }) => rest
      );
      const payload = { ...item, subcategories: sanitizedSubcategories };

      await api.put(`/api/item/${item?._id}`, payload);
      toast.success("Item updated successfully!");
    } catch (error) {
      console.error("Error updating item:", error);
      toast.error("Failed to update item.");
    }
  };

  const handleDeleteSubcategory = async (
    itemId: number,
    subcategoryId: number
  ) => {
    try {
      await api.delete(`/api/item/${itemId}/sub/${subcategoryId}`);
      toast.success("Subcategory deleted successfully!");

      if (item) {
        const updatedSubcategories = item.subcategories.filter(
          (sub) => sub._id !== subcategoryId
        );
        setItem({ ...item, subcategories: updatedSubcategories });
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Failed to delete subcategory.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!item) return <p>Item not found.</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold mb-4">Edit Item</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="font-medium">Name</label>
          <Input
            name="name"
            value={item.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
        </div>
        <div>
          <label className="font-medium">Brand</label>
          <Input
            name="brand"
            value={item.brand}
            onChange={handleInputChange}
            placeholder="Brand"
          />
        </div>
        <div>
          <label className="font-medium">Price</label>
          <Input
            name="price"
            type="number"
            value={item.price}
            onChange={handleInputChange}
            placeholder="Price"
          />
        </div>
        <div>
          <label className="font-medium">GST</label>
          <Input
            name="gst"
            value={item.gst}
            onChange={handleInputChange}
            placeholder="GST"
          />
        </div>
      </div>

      <div className="flex items-center justify-between mt-8">
        <h2 className="text-xl font-semibold">Subcategories</h2>
        <Button onClick={handleAddSubcategory}>+ Add Subcategory</Button>
      </div>

      <div className="overflow-auto rounded border border-gray-200">
        <div className="grid grid-cols-2 md:grid-cols-6 font-medium bg-gray-100 p-2">
          <div>Model</div>
          <div>Color</div>
          <div>Size</div>
          <div>Quantity</div>
          <div>Price</div>
          <div></div>
        </div>

        {item?.subcategories?.length > 0 ? (
          item.subcategories.map((sub, index) => (
            <div
              key={sub._id}
              className="grid grid-cols-2 md:grid-cols-6 gap-2 p-2 border-t"
            >
              <Input
                value={sub.model}
                onChange={(e) =>
                  handleSubcategoryChange(index, "model", e.target.value)
                }
                placeholder="Model"
              />
              <Input
                value={sub.color}
                onChange={(e) =>
                  handleSubcategoryChange(index, "color", e.target.value)
                }
                placeholder="Color"
              />
              <Input
                value={sub.size}
                onChange={(e) =>
                  handleSubcategoryChange(index, "size", e.target.value)
                }
                placeholder="Size"
              />
              <Input
                type="number"
                value={String(sub.quantity)}
                onChange={(e) =>
                  handleSubcategoryChange(index, "quantity", e.target.value)
                }
                placeholder="Quantity"
              />
              <Input
                type="number"
                value={String(sub.price)}
                onChange={(e) =>
                  handleSubcategoryChange(index, "price", e.target.value)
                }
                placeholder="Price"
              />
              <Button
                onClick={() => handleDeleteSubcategory(item._id, sub._id)}
                className="text-red-500"
                variant={"ghost"}
              >
                Delete
              </Button>
            </div>
          ))
        ) : (
          <div className="p-4 text-gray-500">No subcategories found.</div>
        )}
      </div>

      <Button onClick={handleSave} className="mt-6">
        Save
      </Button>
    </div>
  );
}
