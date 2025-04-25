import { useState, useEffect, FormEvent } from "react";
import api from "../api";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Pencil, Trash } from "lucide-react";

interface Company {
  _id: string;
  name: string;
  email: string;
  gst: string;
  phone: string;
  address: string;
}

export default function Companies() {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [formData, setFormData] = useState<Omit<Company, "_id">>({
    name: "",
    email: "",
    gst: "",
    phone: "",
    address: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      const res = await api.get("/api/companies");
      setCompanies(res.data.companies);
    } catch (error) {
      toast.error("Failed to fetch companies");
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        await api.put(`/api/companies/${editingId}`, formData);
        toast.success("Company updated");
      } else {
        await api.post("/api/companies", formData);
        toast.success("Company added");
      }
      setFormData({
        name: "",
        email: "",
        gst: "",
        phone: "",
        address: "",
      });
      setEditingId(null);
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to submit company");
    }
  };

  const handleEdit = (company: Company) => {
    setFormData({
      name: company.name,
      email: company.email,
      gst: company.gst,
      phone: company.phone,
      address: company.address,
    });
    setEditingId(company._id);
  };

  const handleDelete = async (id: string) => {
    try {
      await api.delete(`/api/companies/${id}`);
      toast.success("Company deleted");
      fetchCompanies();
    } catch (error) {
      toast.error("Failed to delete company");
    }
  };

  const filteredCompanies = companies.filter((comp) =>
    comp.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Companies</h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <Input
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
          <Input
            placeholder="GST"
            value={formData.gst}
            onChange={(e) => setFormData({ ...formData, gst: e.target.value })}
          />
          <Input
            placeholder="Phone"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
          <Input
            placeholder="Address"
            value={formData.address}
            onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          />
        </div>
        <Button type="submit">{editingId ? "Update Company" : "Add Company"}</Button>
      </form>

      {/* Search */}
      <div className="mb-4">
        <Input
          placeholder="Search companies..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="border border-gray-200 rounded overflow-hidden">
        <div className="sm:max-h-[400px] max-h-[70vh] overflow-y-auto">
          <Table>
            <TableHeader className="bg-gray-100 sticky top-0 z-10">
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>GST</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Edit</TableHead>
                <TableHead>Delete</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCompanies.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center text-gray-500">
                    No companies found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCompanies.map((comp) => (
                  <TableRow key={comp._id} className="hover:bg-gray-50">
                    <TableCell>{comp.name}</TableCell>
                    <TableCell>{comp.email}</TableCell>
                    <TableCell>{comp.gst}</TableCell>
                    <TableCell>{comp.phone}</TableCell>
                    <TableCell>{comp.address}</TableCell>
                    <TableCell>
                      <Pencil
                        onClick={() => handleEdit(comp)}
                        className="h-4 w-4 cursor-pointer"
                      />
                    </TableCell>
                    <TableCell>
                      <Trash
                        onClick={() => handleDelete(comp._id)}
                        className="h-4 w-4 text-red-500 cursor-pointer"
                      />
                    </TableCell>
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
