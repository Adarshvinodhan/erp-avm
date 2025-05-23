import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api from '../../api'
import { Item } from "@/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";



const ItemView = () => {
    const { id } = useParams<{ id: string }>();
    const [item, setItem] = useState<Item | null>(null);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const res = await api.get(`/api/item/${id}`);
                setItem(res.data);
            } catch (error: any) {
                toast.error(error.message || "Error loading item");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchItem();
    }, [id]);

    const filteredSubcategories = item?.subcategories.filter((sub) =>
        `${sub.model} ${sub.color} ${sub.size}`.toLowerCase().includes(search.toLowerCase())
    );

    if (loading) {
        return (
            <div className="p-6 space-y-4">
                <Skeleton className="h-8 w-1/3" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="p-6 space-y-4">
            {item && (
                <>
                    <h2 className="text-xl font-semibold mb-1">{item.name}</h2>
                    <p className="text-muted-foreground">
                        Brand: {item.brand} | Base Price: ₹{item.price} | GST: {item.gst}%
                    </p>

                    <Input
                        placeholder="Search subcategories..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full"
                    />
                    <Table className="min-w-full">
                        <TableHeader className="bg-gray-100">
                            <TableRow>
                                <TableHead className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold w-[90px]">Model</TableHead>
                                <TableHead className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold w-[80px]">Color</TableHead>
                                <TableHead className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm font-semibold w-[60px]">Size</TableHead>
                                <TableHead className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm text-right font-semibold w-[80px]">Qty</TableHead>
                                <TableHead className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm text-right font-semibold w-[100px]">Price (₹)</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredSubcategories && filteredSubcategories.length > 0 ? (
                                filteredSubcategories.map((sub) => (
                                    <TableRow key={sub._id} className="hover:bg-gray-50">
                                        <TableCell className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm">{sub.model}</TableCell>
                                        <TableCell className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm">{sub.color}</TableCell>
                                        <TableCell className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm">{sub.size}</TableCell>
                                        <TableCell className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm text-right">{sub.quantity}</TableCell>
                                        <TableCell className="px-2 py-1 text-xs sm:px-4 sm:py-2 sm:text-sm text-right">{sub.price.toLocaleString()}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-4 text-xs sm:text-sm text-muted-foreground">
                                        No matching subcategories found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </>
            )}
        </div>
    );
};

export default ItemView;
