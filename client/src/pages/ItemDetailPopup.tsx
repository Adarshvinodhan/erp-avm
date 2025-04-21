import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Trash2, Save, X } from "lucide-react";
import { useState } from "react";

export default function ItemDetailPopup({
  open,
  itemId,
  onClose,
  onSave,
  itemName,
  subcategories,
  deleteSubcategory,
}: {
  open: boolean;
  onClose: () => void;
  itemName: string;
  subcategories: {
    id: number;
    model: string;
    color: string;
    size: string;
    price: number;
    quantity: number;
  }[];
  itemId: number;
  onEdit?: (subcategoryId: number, updatedData: any) => void;
  deleteSubcategory?: (itemId: number, subId: number) => void;
  onSave?: () => void;
}) {
  const [editId, setEditId] = useState<number | null>(null);
  const [editedSub, setEditedSub] = useState<any>({});

  const handleEditClick = (sub: any) => {
    setEditId(sub.id);
    setEditedSub({ ...sub });
  };



  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-full sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{itemName}</DialogTitle>
        </DialogHeader>

        {(!subcategories || subcategories.length === 0) ? (
          <p className="text-gray-500 text-sm">No subcategories available.</p>
        ) : (
          <div className="w-full overflow-x-auto">
            <div className="min-w-[750px]">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Model</TableHead>
                    <TableHead>Color</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Price (₹)</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Total (₹)</TableHead>
                    <TableHead className="text-center">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {subcategories.map((sub) => {
                    const isEditing = editId === sub.id;
                    const total = isEditing
                      ? (editedSub.price || 0) * (editedSub.quantity || 0)
                      : sub.price * sub.quantity;

                    return (
                      <TableRow key={sub.id}>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={editedSub.model}
                              onChange={(e) =>
                                setEditedSub({ ...editedSub, model: e.target.value })
                              }
                            />
                          ) : (
                            sub.model
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={editedSub.color}
                              onChange={(e) =>
                                setEditedSub({ ...editedSub, color: e.target.value })
                              }
                            />
                          ) : (
                            sub.color
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              value={editedSub.size}
                              onChange={(e) =>
                                setEditedSub({ ...editedSub, size: e.target.value })
                              }
                            />
                          ) : (
                            sub.size
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editedSub.price}
                              onChange={(e) =>
                                setEditedSub({
                                  ...editedSub,
                                  price: Number(e.target.value),
                                })
                              }
                            />
                          ) : (
                            `₹${sub.price}`
                          )}
                        </TableCell>
                        <TableCell>
                          {isEditing ? (
                            <Input
                              type="number"
                              value={editedSub.quantity}
                              onChange={(e) =>
                                setEditedSub({
                                  ...editedSub,
                                  quantity: Number(e.target.value),
                                })
                              }
                            />
                          ) : (
                            sub.quantity
                          )}
                        </TableCell>
                        <TableCell>₹{total}</TableCell>
                        <TableCell className="text-center">
                          <div className="flex justify-center gap-2">
                            {isEditing ? (
                              <>
                                <Button
                                  size="icon"
                                  onClick={onSave}
                                >
                                  <Save className="w-4 h-4 text-green-600" />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => setEditId(null)}
                                >
                                  <X className="w-4 h-4 text-gray-500" />
                                </Button>
                              </>
                            ) : (
                              <>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditClick(sub)}
                                >
                                  <Pencil className="w-4 h-4 text-blue-600" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => deleteSubcategory?.(itemId, sub.id)}
                                >
                                  <Trash2 className="w-4 h-4 text-red-600" />
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
