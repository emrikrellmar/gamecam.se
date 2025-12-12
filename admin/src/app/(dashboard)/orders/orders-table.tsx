
"use client";

import { useState } from "react";
import { SupabaseOrder } from "./orders-board";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Edit, Trash2, Search } from "lucide-react";
import { format } from "date-fns";

interface OrdersTableProps {
  orders: SupabaseOrder[];
  onEdit: (order: SupabaseOrder) => void;
  onDelete: (orderId: string) => void;
  onStatusChange: (orderId: string, newStatus: string) => void;
}

const STATUSES = [
  'Order placed',
  'Invoice payed',
  'Preparing order',
  'Shipped',
  'Onboarding done'
];

export function OrdersTable({ orders, onEdit, onDelete, onStatusChange }: OrdersTableProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredOrders = orders.filter((order) =>
    order.order_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    order.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Order placed': return 'bg-blue-100 text-blue-800 hover:bg-blue-100';
      case 'Invoice payed': return 'bg-purple-100 text-purple-800 hover:bg-purple-100';
      case 'Preparing order': return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100';
      case 'Shipped': return 'bg-orange-100 text-orange-800 hover:bg-orange-100';
      case 'Onboarding done': return 'bg-green-100 text-green-800 hover:bg-green-100';
      default: return 'bg-gray-100 text-gray-800 hover:bg-gray-100';
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by Order ID, Name or Email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Product</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center h-24 text-muted-foreground">
                  No orders found.
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.order_id}</TableCell>
                  <TableCell>
                    {order.created_at ? format(new Date(order.created_at), 'MMM d, yyyy') : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{order.customer_name}</span>
                      <span className="text-xs text-muted-foreground">{order.email}</span>
                    </div>
                  </TableCell>
                  <TableCell>{order.product}</TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Badge className={`cursor-pointer ${getStatusColor(order.status)} border-0`}>
                          {order.status}
                        </Badge>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="start">
                        <DropdownMenuLabel>Change Status</DropdownMenuLabel>
                        {STATUSES.map((status) => (
                          <DropdownMenuItem 
                            key={status}
                            onClick={() => onStatusChange(order.id, status)}
                            disabled={status === order.status}
                          >
                            {status}
                          </DropdownMenuItem>
                        ))}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem onClick={() => onEdit(order)}>
                          <Edit className="mr-2 h-4 w-4" /> Edit Order
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-red-600" onClick={() => onDelete(order.id)}>
                          <Trash2 className="mr-2 h-4 w-4" /> Delete Order
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
