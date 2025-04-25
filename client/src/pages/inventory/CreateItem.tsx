import { useForm, useFieldArray } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import api from "../../api.ts";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

// Schema
const subCategorySchema = z.object({
  color: z.string().optional(),
  quantity: z.coerce.number().optional(),
  model: z.string().optional(),
  size: z.string().optional(),
  price: z.coerce.number().optional(),
});

const itemSchema = z.object({
  name: z.string().min(1, "Name is required"),
  brand: z.string().optional(),
  price: z.coerce.number().optional(),
  gst: z.string().optional(),
  subcategories: z.array(subCategorySchema),
});

type ItemFormType = z.infer<typeof itemSchema>;

export default function ItemForm() {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ItemFormType>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      name: "",
      brand: "",
      price: undefined,
      gst: "",
      subcategories: [{ color: "", quantity: 0, model: "", size: "", price: 0 }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "subcategories",
  });

  const navigate = useNavigate();   
  const onSubmit = async (data: ItemFormType) => {
    try {
      await api.post("/api/item", data); 
      toast("Item created successfully!");
      navigate("/inventory");  
    } catch (error) {
      console.error(error);
      toast.error("Failed to create item.");
    }
  };

  return (
    <Card className="max-w-auto mx-auto p-4">
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input {...register("name")} />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div>
            <Label>Brand</Label>
            <Input {...register("brand")} />
          </div>

          <div>
            <Label>Price</Label>
            <Input type="number" {...register("price")} />
          </div>

          <div>
            <Label>GST</Label>
            <Input {...register("gst")} />
          </div>

          <h2 className="text-lg font-semibold mt-4">Subcategories</h2>
          {fields.map((field, index) => (
            <div key={field.id} className="grid grid-cols-2 gap-4 border p-4 rounded-md shadow-sm relative">
              <div>
                <Label>Color</Label>
                <Input {...register(`subcategories.${index}.color`)} />
              </div>
              <div>
                <Label>Quantity</Label>
                <Input type="number" {...register(`subcategories.${index}.quantity`)} />
              </div>
              <div>
                <Label>Model</Label>
                <Input {...register(`subcategories.${index}.model`)} />
              </div>
              <div>
                <Label>Size</Label>
                <Input {...register(`subcategories.${index}.size`)} />
              </div>
              <div>
                <Label>Price</Label>
                <Input type="number" {...register(`subcategories.${index}.price`)} />
              </div>
              <Button
                type="button"
                variant="destructive"
                className="absolute top-2 right-2"
                onClick={() => remove(index)}
              >
                Remove
              </Button>
            </div>
          ))}

          <Button type="button" onClick={() => append({ color: "", quantity: 0, model: "", size: "", price: 0 })}>
            Add Subcategory
          </Button>

          <div className="pt-4">
            <Button type="submit">Submit</Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
