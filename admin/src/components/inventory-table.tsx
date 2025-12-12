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
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
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
  const [itemToDelete, setItemToDelete] = useState<string | null>(null);
  
  // Add Dialog state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItem, setNewItem] = useState({ name: "", stock: "0", supplier: "", category: "GAMETRAQ" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const supabase = createClient();

  const categories = ["GAMETRAQ", "SHOTGUN", "Packaging", "Other"];

  const handleEdit = (item: InventoryItem) => {
    setEditingId(item.id);
    setEditForm(item);
  };

  const openAddDialog = (category: string) => {
    setNewItem({ name: "", stock: "0", supplier: "", category });
    setIsAddOpen(true);
  };

  const handleCreate = async () => {
    setIsSubmitting(true);
    try {
      const { data, error } = await supabase
        .from('inventory')
        .insert([{
          name: newItem.name,
          stock: parseInt(newItem.stock) || 0,
          supplier: newItem.supplier,
          category: newItem.category,
          last_updated: new Date().toISOString()
        }])
        .select()
        .single();

      if (error) throw error;

      setInventory([data as InventoryItem, ...inventory]);
      setIsAddOpen(false);
      setNewItem({ name: "", stock: "0", supplier: "", category: "GAMETRAQ" });
    } catch (error) {
      console.error('Error adding item:', error);
      alert('Failed to add item');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setItemToDelete(id);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;
    
    const id = itemToDelete;
    setItemToDelete(null); // Close dialog immediately

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

    setEditingId(null);
    setEditForm({});
  };

  const handleCancel = () => {
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
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {categories.map((category) => {
          const categoryItems = inventory.filter(item => item.category === category);
          return (
            <Card key={category} className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle>{category}</CardTitle>
                  <Button size="sm" onClick={() => openAddDialog(category)}>
                    <Plus className="mr-2 h-4 w-4" /> Add Item
                  </Button>
                </div>
                <CardDescription>
                  {categoryItems.length} items in {category}.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Supplier</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {categoryItems.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={4} className="text-center h-24 text-muted-foreground">
                          No items in this category.
                        </TableCell>
                      </TableRow>
                    ) : (
                      categoryItems.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">
                            {editingId === item.id ? (
                              <Input 
                                value={editForm.name} 
                                onChange={(e) => handleChange('name', e.target.value)}
                                className="h-8 w-[140px]" 
                              />
                            ) : (
                              item.name
                            )}
                          </TableCell>
                          <TableCell>
                            {editingId === item.id ? (
                              <Input 
                                type="number"
                                value={editForm.stock} 
                                onChange={(e) => handleChange('stock', parseInt(e.target.value) || 0)}
                                className="h-8 w-[60px]" 
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
                                className="h-8 w-[100px]" 
                              />
                            ) : (
                              item.supplier
                            )}
                          </TableCell>
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
                                  <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteClick(item.id)}>
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <AlertDialog open={!!itemToDelete} onOpenChange={(open) => !open && setItemToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the item from your inventory.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Item</DialogTitle>
            <DialogDescription>
              Add a new item to your inventory.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Item Name</Label>
              <Input value={newItem.name} onChange={e => setNewItem({...newItem, name: e.target.value})} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label>Stock</Label>
                <Input type="number" value={newItem.stock} onChange={e => setNewItem({...newItem, stock: e.target.value})} />
              </div>
              <div className="grid gap-2">
                <Label>Category</Label>
                <Input value={newItem.category} onChange={e => setNewItem({...newItem, category: e.target.value})} />
              </div>
            </div>
            <div className="grid gap-2">
              <Label>Supplier</Label>
              <Input value={newItem.supplier} onChange={e => setNewItem({...newItem, supplier: e.target.value})} />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddOpen(false)}>Cancel</Button>
            <Button onClick={handleCreate} disabled={isSubmitting}>
              {isSubmitting ? "Adding..." : "Add Item"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
