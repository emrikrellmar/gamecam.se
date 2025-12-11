"use client";

import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Search, Plus, Filter, MoreHorizontal, Edit, Save, X } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type InventoryItem = {
  id: string;
  name: string;
  stock: number;
  supplier: string;
  last_updated: string;
  category: string;
};

interface InventoryTableProps {
  initialInventory: InventoryItem[];
}

export function InventoryTable({ initialInventory }: InventoryTableProps) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<InventoryItem>>({});
  const supabase = createClient();

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const handleAdd = () => {
    const newItem: InventoryItem = {
      id: "new",
      name: "",
      stock: 0,
      supplier: "",
      last_updated: new Date().toISOString(),
      category: "Uncategorized"
    };
    setInventory([newItem, ...inventory]);
    setEditingId("new");
    setEditForm(newItem);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    // Optimistic update
    setInventory(inventory.filter(item => item.id !== id));

    const { error } = await supabase
      .from('inventory')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Error deleting item:', error);
      // Revert would go here
    }
  };

  const handleSave = async () => {
    if (!editingId) return;
    
    const updatedItem = { 
      ...editForm, 
      last_updated: new Date().toISOString()
    };

    if (editingId === 'new') {
      // Remove the temporary item from state first to avoid duplicates/flicker
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          name: updatedItem.name,
          stock: updatedItem.stock,
          supplier: updatedItem.supplier,
          category: updatedItem.category,
          last_updated: updatedItem.last_updated
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding item:', error);
        return;
      }

      // Replace the "new" item with the real one from DB
      setInventory(prev => [data as InventoryItem, ...prev.filter(i => i.id !== 'new')]);
    } else {
      // Optimistic update for existing items
      setInventory(inventory.map(item => 
        item.id === editingId 
          ? { ...item, ...updatedItem } as InventoryItem
          : item
      ));

      // Save to Supabase
      const { error } = await supabase
        .from('inventory')
        .update({
          name: updatedItem.name,
          stock: updatedItem.stock,
          supplier: updatedItem.supplier,
          category: updatedItem.category,
          last_updated: updatedItem.last_updated
        })
        .eq('id', editingId);

      if (error) {
        console.error('Error updating inventory:', error);
      }
    }

    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
    if (editingId === 'new') {
      setInventory(inventory.filter(item => item.id !== 'new'));
    }
    setEditingId(null);
    setEditForm({});
  };

  const handleChange = (field: keyof InventoryItem, value: string | number) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Inventory</h1>
          <p className="text-muted-foreground">Manage your stock, suppliers, and components.</p>
        </div>
        <Button onClick={handleAdd}>
          <Plus className="mr-2 h-4 w-4" /> Add Item
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle>Current Stock</CardTitle>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search items..."
                  className="w-[200px] pl-8 lg:w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
          <CardDescription>
            You have {inventory.length} items in your inventory.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Last Updated</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inventory.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">
                    {editingId === item.id ? (
                      <Input 
                        value={editForm.name} 
                        onChange={(e) => handleChange('name', e.target.value)}
                        className="h-8 w-[180px]" 
                      />
                    ) : (
                      item.name
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="font-normal">
                      {item.category}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input 
                        type="number"
                        value={editForm.stock} 
                        onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                        className="h-8 w-[80px]" 
                      />
                    ) : (
                      <span className={item.stock < 5 ? "text-red-500 font-bold" : ""}>
                        {item.stock}
                      </span>
                    )}
                  </TableCell>
                  <TableCell>
                    {editingId === item.id ? (
                      <Input 
                        value={editForm.supplier} 
                        onChange={(e) => handleChange('supplier', e.target.value)}
                        className="h-8 w-[150px]" 
                      />
                    ) : (
                      item.supplier
                    )}
                  </TableCell>
                  <TableCell>{new Date(item.last_updated).toLocaleDateString()}</TableCell>
                  <TableCell className="text-right">
                    {editingId === item.id ? (
                      <div className="flex justify-end gap-2">
                        <Button size="icon" variant="ghost" onClick={handleSave} className="h-8 w-8 text-green-600">
                          <Save className="h-4 w-4" />
                        </Button>
                        <Button size="icon" variant="ghost" onClick={handleCancel} className="h-8 w-8 text-red-600">
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ) : (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem onClick={() => handleEdit(item)}>
                            <Edit className="mr-2 h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-red-600" onClick={() => handleDelete(item.id)}>
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
