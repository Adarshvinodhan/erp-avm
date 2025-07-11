import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import api from "../../api";
import { Item, Subcategory } from "@/types";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export default function ItemDetail() {
  const { id } = useParams();
  const [item, setItem] = useState<Item | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItem = async () => {
      try {
        const res = await api.get(`/api/item/${id}`);
        setItem(res.data);
        await console.log(item)
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
      _id: Date.now().toString(), // temporary unique ID
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
    itemId: string,
    subcategoryId: string
  ) => {
    try {


      if (item) {
        const updatedSubcategories = item.subcategories.filter(
          (sub) => sub._id !== subcategoryId
        );
        setItem({ ...item, subcategories: updatedSubcategories });
        await api.delete(`/api/item/${itemId}/sub/${subcategoryId}`);
        toast.success("Subcategory deleted successfully!");
      }
    } catch (error) {
      console.error("Error deleting subcategory:", error);
      toast.error("Failed to delete subcategory.");
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!item) return <p>Item not found.</p>;

  return (
<div className="space-y-8">
  <div className="border-b pb-4">
    <h1 className="text-2xl font-bold">Edit Item</h1>
    <p className="text-sm text-muted-foreground">Update item and its subcategory details below.</p>
  </div>

  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Name</label>
      <Input name="name" value={item.name} onChange={handleInputChange} placeholder="Name" />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Brand</label>
      <Input name="brand" value={item.brand} onChange={handleInputChange} placeholder="Brand" />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">Price</label>
      <Input
        name="price"
        type="number"
        value={item.price}
        onChange={handleInputChange}
        placeholder="Price"
      />
    </div>

    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">GST</label>
      <Input
        name="gst"
        value={item.gst}
        onChange={handleInputChange}
        placeholder="GST"
      />
    </div>
  </div>

  <div className="flex items-center justify-between pt-6">
    <h2 className="text-xl font-semibold">Subcategories</h2>
    <Button onClick={handleAddSubcategory}>+ Add Subcategory</Button>
  </div>

  <div className="rounded-lg border border-gray-200 divide-y overflow-auto">
    <div className="grid grid-cols-2 md:grid-cols-6 bg-gray-100 text-sm font-semibold px-3 py-2">
      <div>Model</div>
      <div>Color</div>
      <div>Size</div>
      <div>Quantity</div>
      <div>Price</div>
      <div className="text-center">Action</div>
    </div>

    {item?.subcategories?.length > 0 ? (
      item.subcategories.map((sub, index) => (
        <div
          key={sub._id}
          className="grid grid-cols-2 md:grid-cols-6 gap-2 px-3 py-2 items-center"
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
          <div className="text-center">
            <Button
              onClick={() => handleDeleteSubcategory(item._id, sub._id)}
              className="text-red-500"
              variant="ghost"
            >
              Delete
            </Button>
          </div>
        </div>
      ))
    ) : (
      <div className="px-4 py-6 text-center text-muted-foreground text-sm">
        No subcategories found.
      </div>
    )}
  </div>

  <div className="pt-4">
    <Button onClick={handleSave} className="w-full md:w-auto">
      Save
    </Button>
  </div>
</div>

  );
}
