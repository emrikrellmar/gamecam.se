"use client";

import { useState, useMemo } from "react";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";

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

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  phone: string;
  address: string;
  totalOrders: number;
  lastOrderDate: string;
}

interface CustomersTableProps {
  orders: any[]; // Using any[] temporarily to match the Supabase return type flexibility, but ideally should be typed
}

export function CustomersTable({ orders }: CustomersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const customers = useMemo(() => {
    const customerMap = new Map<string, Customer>();

    orders.forEach((order) => {
      // Use email as unique identifier, fallback to name if email is missing
      const key = order.email || order.customer_name;
      if (!key) return;

      if (!customerMap.has(key)) {
        customerMap.set(key, {
          id: key,
          name: order.customer_name || "Unknown",
          email: order.email || "",
          company: order.company || "",
          phone: order.phone_number || "",
          address: order.delivery_address || "",
          totalOrders: 0,
          lastOrderDate: order.created_at,
        });
      }

      const customer = customerMap.get(key)!;
      customer.totalOrders += 1;
      if (new Date(order.created_at) > new Date(customer.lastOrderDate)) {
        customer.lastOrderDate = order.created_at;
      }
    });

    return Array.from(customerMap.values());
  }, [orders]);

  const filteredCustomers = customers.filter((customer) =>
    customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    customer.company.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customers</CardTitle>
          <CardDescription>
            A list of all customers derived from orders.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Company</TableHead>
                <TableHead>Phone</TableHead>
                <TableHead>Total Orders</TableHead>
                <TableHead>Last Order</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCustomers.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                    No customers found.
                  </TableCell>
                </TableRow>
              ) : (
                filteredCustomers.map((customer) => (
                  <TableRow key={customer.id}>
                    <TableCell className="font-medium">{customer.name}</TableCell>
                    <TableCell>{customer.email}</TableCell>
                    <TableCell>{customer.company || "-"}</TableCell>
                    <TableCell>{customer.phone || "-"}</TableCell>
                    <TableCell>{customer.totalOrders}</TableCell>
                    <TableCell>
                      {new Date(customer.lastOrderDate).toLocaleDateString()}
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
