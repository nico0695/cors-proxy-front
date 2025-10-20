"use client";

import { useState } from "react";
import { ProtectedRoute } from "@/components/auth/protected";
import { Header } from "@/components/shared/header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useUsers, useUpdateUser, useDeleteUser } from "@/hooks/use-users";
import { CreateUserDialog } from "@/components/users/create-user-dialog";
import { EditUserDialog } from "@/components/users/edit-user-dialog";
import { DeleteUserDialog } from "@/components/users/delete-user-dialog";
import type { PublicUser } from "@/lib/types";
import { format } from "date-fns";

export default function UsersPage() {
  const { data: users, isLoading } = useUsers();
  const updateUser = useUpdateUser();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<PublicUser | null>(null);
  const [deletingUser, setDeletingUser] = useState<PublicUser | null>(null);

  const handleStatusToggle = async (user: PublicUser) => {
    const newStatus = user.status === "enabled" ? "blocked" : "enabled";
    await updateUser.mutateAsync({
      id: user.id,
      data: { status: newStatus },
    });
  };

  return (
    <ProtectedRoute>
      <main className="min-h-screen bg-background">
        <Header />

        <div className="border-b">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
                <p className="text-muted-foreground mt-1">Manage system users and their access</p>
              </div>
              <Button size="sm" onClick={() => setCreateDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                New User
              </Button>
            </div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-6">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
              <CardDescription>
                {users?.length || 0} user(s) registered in the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                </div>
              ) : !users || users.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No users found. Create your first user to get started.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Username</th>
                        <th className="text-left py-3 px-4 font-medium">Email</th>
                        <th className="text-left py-3 px-4 font-medium">Status</th>
                        <th className="text-left py-3 px-4 font-medium">Created</th>
                        <th className="text-right py-3 px-4 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4 font-medium">{user.name}</td>
                          <td className="py-3 px-4 text-muted-foreground">
                            {user.email || "—"}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={user.status === "enabled"}
                                onCheckedChange={() => handleStatusToggle(user)}
                                disabled={updateUser.isPending}
                              />
                              <span
                                className={`text-sm ${
                                  user.status === "enabled"
                                    ? "text-green-600 dark:text-green-400"
                                    : "text-orange-600 dark:text-orange-400"
                                }`}
                              >
                                {user.status === "enabled" ? "Enabled" : "Blocked"}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-sm text-muted-foreground">
                            {format(new Date(user.createdAt), "MMM d, yyyy")}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setEditingUser(user)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => setDeletingUser(user)}
                              >
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <CreateUserDialog open={createDialogOpen} onOpenChange={setCreateDialogOpen} />
        <EditUserDialog
          user={editingUser}
          open={!!editingUser}
          onOpenChange={(open) => !open && setEditingUser(null)}
        />
        <DeleteUserDialog
          user={deletingUser}
          open={!!deletingUser}
          onOpenChange={(open) => !open && setDeletingUser(null)}
        />
      </main>
    </ProtectedRoute>
  );
}
