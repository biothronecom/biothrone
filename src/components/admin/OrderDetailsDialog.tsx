
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { Order } from "@/types/order";
import { Separator } from "../ui/separator";

interface OrderDetailsDialogProps {
  order: Order | null;
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

export function OrderDetailsDialog({ order, isOpen, onOpenChange }: OrderDetailsDialogProps) {
  if (!order) {
    return null;
  }

  const shipping = order.shippingAddress;
  const fullAddress = `${shipping.address1}${shipping.address2 ? `, ${shipping.address2}` : ''}, ${shipping.city}, ${shipping.state} ${shipping.zip}, ${shipping.country}`;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Order Details: {order.id}</DialogTitle>
          <DialogDescription>
            A detailed summary of the order placed by {order.customer}.
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="max-h-[70vh]">
            <div className="space-y-6 pr-4 py-2">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                    <div>
                        <h3 className="font-semibold text-muted-foreground">Customer</h3>
                        <p>{order.customer}</p>
                        <p className="text-muted-foreground">{order.email}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-muted-foreground">Shipping Address</h3>
                        <p>{shipping.fullName}</p>
                        <p className="text-muted-foreground">{fullAddress}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-muted-foreground">Order Info</h3>
                        <p>Date: {new Date(order.date).toLocaleString()}</p>
                        <p>Status: {order.status}</p>
                    </div>
                     <div>
                        <h3 className="font-semibold text-muted-foreground">Payment</h3>
                        <p>Total: ${order.total.toFixed(2)}</p>
                        <p className="text-muted-foreground">PayPal ID: {order.paypalId || 'N/A'}</p>
                    </div>
                </div>

                <Separator />
                
                <div>
                    <h3 className="font-semibold text-muted-foreground mb-2">Items Ordered</h3>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Product</TableHead>
                                <TableHead className="text-center">Quantity</TableHead>
                                <TableHead className="text-right">Price</TableHead>
                                <TableHead className="text-right">Total</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {order.items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell>{item.name}</TableCell>
                                    <TableCell className="text-center">{item.quantity}</TableCell>
                                    <TableCell className="text-right">${item.price.toFixed(2)}</TableCell>
                                    <TableCell className="text-right">${(item.quantity * item.price).toFixed(2)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
