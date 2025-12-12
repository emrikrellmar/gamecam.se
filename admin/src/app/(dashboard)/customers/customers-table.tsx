"use client";

import { useState, useMemo } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useRouter } from "next/navigation";

interface Order {
  id: string;
  customer_name: string;
  email: string;
  company: string;
  phone_number: string;
  created_at: string;
  status: string;
  delivery_address: string;
}

interface ManualCustomer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  lastOrderDate: string | null;
  source: 'order' | 'manual';
}

interface CustomersTableProps {
  orders: any[];
  manualCustomers: any[];
}

export function CustomersTable({ orders, manualCustomers }: CustomersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newCustomer, setNewCustomer] = useState({
    name: "",
    email: "",
    phone: "",
    address: ""
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    // Process orders first
    orders.forEach((order) => {
      const key = order.email || order.customer_name;
      if (!key) return;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name: order.customer_name || "Unknown",
          email: order.email || "",
          phone: order.phone_number || "",
          address: order.delivery_address || "",
          lastOrderDate: order.created_at,
          source: 'order'
        });
      } else {
        // Update last order date if newer
        const customer = customerMap.get(key)!;
        if (new Date(order.created_at) > new Date(customer.lastOrderDate!)) {
          customer.lastOrderDate = order.created_at;
        }
      }
    });

    // Process manual customers (they override or add to the list)
    manualCustomers.forEach((mc) => {
      const key = mc.email || mc.name;
      // If exists from orders, we might want to keep the order data but maybe update contact info?
      // For simplicity, let's treat them as separate entries if the ID is different, 
      // but here we are mapping by email.
      
      if (customerMap.has(key)) {
        // If we have a manual entry for someone who also has orders, 
        // we can update their details from the manual entry as it might be more current.
        const existing = customerMap.get(key)!;
        customerMap.set(key, {
          ...existing,
          name: mc.name,
          phone: mc.phone || existing.phone,
          address: mc.address || existing.address,
          source: 'manual' // Mark as manually managed
        });
      } else {
        customerMap.set(key, {
          id: mc.id,
          name: mc.name,
          email: mc.email || "",
          phone: mc.phone || "",
          address: mc.address || "",
          lastOrderDate: null,
          source: 'manual'
        });
      }
    });

    return Array.from(customerMap.values());
  }, [orders, manualCustomers]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddCustomer = async () => {
    if (!newCustomer.name) return;
    
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('customers')
        .insert([newCustomer]);

      if (error) throw error;

      setIsAddOpen(false);
      setNewCustomer({ name: "", email: "", phone: "", address: "" });
      router.refresh();
    } catch (error) {
      console.error('Error adding customer:', error);
      alert('Failed to add customer');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="relative w-72">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search customers..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
        <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Add Customer
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Customer</DialogTitle>
              <DialogDescription>
                Manually add a customer to your database.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newCustomer.name}
                  onChange={(e) => setNewCustomer({ ...newCustomer, name: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  value={newCustomer.email}
                  onChange={(e) => setNewCustomer({ ...newCustomer, email: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="phone" className="text-right">
                  Phone
                </Label>
                <Input
                  id="phone"
                  value={newCustomer.phone}
                  onChange={(e) => setNewCustomer({ ...newCustomer, phone: e.target.value })}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="address" className="text-right">
                  Address
                </Label>
                <Input
                  id="address"
                  value={newCustomer.address}
                  onChange={(e) => setNewCustomer({ ...newCustomer, address: e.target.value })}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
              <Button onClick={handleAddCustomer} disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : "Save Customer"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            A list of all customers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Address</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.phone || "-"}</TableCell>
                    <TableCell className="max-w-[200px] truncate" title={customer.address}>{customer.address || "-"}</TableCell>
                    <TableCell>
                      {customer.lastOrderDate 
                        ? new Date(customer.lastOrderDate).toLocaleDateString() 
                        : <span className="text-muted-foreground text-xs">Never</span>}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
