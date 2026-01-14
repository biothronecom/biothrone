
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { CheckCircle2, Package, Send, Truck, Eye, Cog, User, Mail, DollarSign, ListOrdered, KeyRound, Calendar, XCircle, PlusCircle, MinusCircle, Volume2, Search, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ClientOnly } from "@/components/shared/ClientOnly";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import { useToast } from "@/hooks/use-toast";
import { updateOrderStatusInSheet } from "@/lib/order-actions";
import type { Order } from "@/types/order";
import { TextToSpeech } from "@/components/shared/TextToSpeech";
import { Badge } from "@/components/ui/badge";
import { OrderDetailsDialog } from "@/components/admin/OrderDetailsDialog";

const initialOrders: Order[] = [
    { id: 'ORD001', customer: 'Liam Johnson', email: 'liam.j@example.com', status: 'Pending', total: 44.97, date: '2024-08-05', paypalId: '5M510344G9277831L', trackingNumber: '', items: [{ id: '1', name: '50 ml To Go Pouch', quantity: 1, price: 4.99 }, { id: '4', name: 'Bio-Throne™ Bundle', quantity: 1, price: 39.98 }], shippingAddress: { fullName: 'Liam Johnson', address1: '123 Oak Ave', city: 'Springfield', state: 'IL', zip: '62704', country: 'US' } },
    { id: 'ORD002', customer: 'Olivia Smith', email: 'olivia.s@example.com', status: 'Shipped', total: 8.95, date: '2024-08-04', paypalId: '8T219071N5108522F', trackingNumber: '1Z999AA10123456784', items: [{ id: '2', name: '16 oz Spray Pouch', quantity: 1, price: 14.99 }], shippingAddress: { fullName: 'Olivia Smith', address1: '456 Maple St', city: 'Shelbyville', state: 'IL', zip: '62565', country: 'US' } },
    { id: 'ORD003', customer: 'Noah Williams', email: 'noah.w@example.com', status: 'Processing', total: 14.99, date: '2024-08-04', paypalId: '1BC95834H0127845K', trackingNumber: '', items: [{ id: '2', name: '16 oz Spray Pouch', quantity: 1, price: 14.99 }], shippingAddress: { fullName: 'Noah Williams', address1: '789 Pine Rd', city: 'Capital City', state: 'IL', zip: '62701', country: 'US' } },
    { id: 'ORD004', customer: 'Emma Brown', email: 'emma.b@example.com', status: 'Processing', total: 44.97, date: '2024-08-03', paypalId: '9KN34872N4583451P', trackingNumber: '', items: [{ id: '4', name: 'Bio-Throne™ Bundle', quantity: 1, price: 39.98 }], shippingAddress: { fullName: 'Emma Brown', address1: '101 Elm Ct', city: 'Ogdenville', state: 'IL', zip: '61859', country: 'US' } },
    { id: 'ORD005', customer: 'James Jones', email: 'james.j@example.com', status: 'Shipped', total: 24.99, date: '2024-08-02', paypalId: '7DE09345P1239871H', trackingNumber: '1Z999AA10198765432', items: [{ id: '3', name: '32 oz Refill Large Pouch', quantity: 1, price: 24.99 }], shippingAddress: { fullName: 'James Jones', address1: '212 Birch Ln', city: 'North Haverbrook', state: 'IL', zip: '60540', country: 'US' } },
    { id: 'ORD006', customer: 'Ava Garcia', email: 'ava.g@example.com', status: 'Pending', total: 12.50, date: '2024-08-05', paypalId: '', trackingNumber: '', items: [{ id: '1', name: '50 ml To Go Pouch', quantity: 1, price: 4.99 }, { id: 'donation-ds', name: 'Donation', quantity: 1, price: 3.00 }], shippingAddress: { fullName: 'Ava Garcia', address1: '333 Cedar Blvd', city: 'Springfield', state: 'IL', zip: '62704', country: 'US' } },
    { id: 'ORD007', customer: 'Sophia Martinez', email: 'sophia.m@example.com', status: 'Canceled', total: 33.00, date: '2024-08-01', paypalId: '', trackingNumber: '', items: [{ id: '2', name: '16 oz Spray Pouch', quantity: 2, price: 14.99 }], shippingAddress: { fullName: 'Sophia Martinez', address1: '444 Spruce Dr', city: 'Shelbyville', state: 'IL', zip: '62565', country: 'US' } },
];


const getStatusBadge = (status: Order['status']) => {
    switch (status) {
        case 'Pending':
            return <Badge variant="secondary" className="bg-yellow-200 text-yellow-800 hover:bg-yellow-200/80">Pending</Badge>;
        case 'Processing':
            return <Badge variant="secondary" className="bg-blue-200 text-blue-800 hover:bg-blue-200/80">Processing</Badge>;
        case 'Shipped':
            return <Badge variant="secondary" className="bg-green-200 text-green-800 hover:bg-green-200/80">Shipped</Badge>;
        case 'Canceled':
            return <Badge variant="destructive">Canceled</Badge>;
        default:
            return <Badge variant="outline">{status}</Badge>;
    }
};

export default function AdminDashboardPage() {
    const [orders, setOrders] = useState(initialOrders);
    const [openCollapsibles, setOpenCollapsibles] = useState<string[]>([]);
    const [filter, setFilter] = useState("");
    const { toast } = useToast();
    const [loadingAction, setLoadingAction] = useState<{ orderId: string; action: 'confirm' | 'ship' | 'cancel' } | null>(null);
    const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

    const OrderActions = ({
        order,
        onConfirm,
        onShip,
        onCancel,
        onViewDetails,
    }: {
        order: Order;
        onConfirm: (id: string) => void;
        onShip: (id: string) => void;
        onCancel: (id: string) => void;
        onViewDetails: (id: string) => void;
    }) => {
        const getActionText = () => {
            if (order.status === 'Canceled' || order.status === 'Shipped') {
                return `View details for order ${order.id}`;
            }
            if (order.status === 'Pending' && order.paypalId) {
                return `Actions for pending order ${order.id}: Confirm or View Details`;
            }
            if (order.status === 'Pending' && !order.paypalId) {
                return `Actions for pending order ${order.id}: Cancel or View Details`;
            }
            if (order.status === 'Processing') {
                return `Actions for processing order ${order.id}: Ship or View Details`;
            }
            return `View details for order ${order.id}`;
        }

        return (
            <div className="flex justify-center items-center gap-2">
                {order.status === 'Canceled' || order.status === 'Shipped' ? (
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => onViewDetails(order.id)}
                        aria-label={`View details for order ${order.id}`}
                    >
                        <Eye className="h-5 w-5 text-muted-foreground" />
                    </Button>
                ) : (
                    <>
                        {order.status === 'Pending' && order.paypalId && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white disabled:bg-gray-400"
                                onClick={() => onConfirm(order.id)}
                                aria-label={`Confirm order ${order.id}`}
                                disabled={!order.paypalId || loadingAction?.orderId === order.id}
                            >
                                {loadingAction?.orderId === order.id && loadingAction.action === 'confirm' ? (
                                    <Send className="h-4 w-4 md:mr-2 animate-pulse" />
                                ) : (
                                    <CheckCircle2 className="h-4 w-4 md:mr-2" />
                                )}
                                <span className="hidden md:inline">Confirm</span>
                            </Button>
                        )}
                        {order.status === 'Pending' && !order.paypalId && (
                            <Button
                                variant="destructive"
                                size="sm"
                                onClick={() => onCancel(order.id)}
                                aria-label={`Cancel order ${order.id}`}
                                disabled={loadingAction?.orderId === order.id}
                            >
                                {loadingAction?.orderId === order.id && loadingAction.action === 'cancel' ? (
                                    <Trash2 className="h-4 w-4 md:mr-2 animate-shake" />
                                ) : (
                                    <XCircle className="h-4 w-4 md:mr-2" />
                                )}
                                <span className="hidden md:inline">Cancel</span>
                            </Button>
                        )}
                        {order.status === 'Processing' && (
                            <Button
                                variant="outline"
                                size="sm"
                                className="bg-green-500 hover:bg-green-600 text-white disabled:bg-gray-400"
                                onClick={() => onShip(order.id)}
                                aria-label={`Ship order ${order.id}`}
                                disabled={!order.trackingNumber || loadingAction?.orderId === order.id}
                            >
                                {loadingAction?.orderId === order.id && loadingAction.action === 'ship' ? (
                                    <Truck className="h-4 w-4 md:mr-2 animate-fly-out" />
                                ) : (
                                    <Truck className="h-4 w-4 md:mr-2" />
                                )}
                                <span className="hidden md:inline">Ship</span>
                            </Button>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onViewDetails(order.id)}
                            aria-label={`View details for order ${order.id}`}
                        >
                            <Eye className="h-5 w-5 text-muted-foreground" />
                        </Button>
                    </>
                )}
                <TextToSpeech textToSpeak={getActionText()} ariaLabel={`Read actions for order ${order.id}`} />
            </div>
        );
    };

    const toggleCollapsible = (orderId: string) => {
        setOpenCollapsibles(prev =>
            prev.includes(orderId) ? prev.filter(id => id !== orderId) : [...prev, orderId]
        );
    };

    const handleTrackingChange = (orderId: string, trackingNumber: string) => {
        setOrders(prevOrders =>
            prevOrders.map(order =>
                order.id === orderId ? { ...order, trackingNumber } : order
            )
        );
    };

    const updateOrderState = async (orderId: string, newStatus: Order['status'], action: 'confirm' | 'ship' | 'cancel', trackingNumber?: string) => {
        setLoadingAction({ orderId, action });
        let updatedOrder: Order | undefined;

        setOrders(prevOrders => {
            const newOrders = prevOrders.map(order => {
                if (order.id === orderId) {
                    updatedOrder = { ...order, status: newStatus, trackingNumber: trackingNumber ?? order.trackingNumber };
                    return updatedOrder;
                }
                return order;
            });
            return newOrders;
        });

        if (updatedOrder) {
            const result = await updateOrderStatusInSheet(updatedOrder);
            if (result.success) {
                toast({ title: "Order Updated", description: `Order ${orderId} has been updated to ${newStatus}.` });
            } else {
                toast({ variant: "destructive", title: "Update Failed", description: result.error });
                // Revert on failure by finding the original order from initialOrders
                const originalOrder = initialOrders.find(o => o.id === orderId);
                if (originalOrder) {
                    setOrders(prev => prev.map(o => o.id === orderId ? originalOrder : o));
                }
            }
        }
        setLoadingAction(null);
    };


    const handleCancelOrder = (orderId: string) => {
        updateOrderState(orderId, 'Canceled', 'cancel');
    };

    const handleConfirmOrder = (orderId: string) => {
        updateOrderState(orderId, 'Processing', 'confirm');
    };

    const handleShipOrder = (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            updateOrderState(orderId, 'Shipped', 'ship', order.trackingNumber);
        }
    };

    const handleViewDetails = (orderId: string) => {
        const order = orders.find(o => o.id === orderId);
        if (order) {
            setSelectedOrder(order);
        }
    };

    const filteredOrders = orders.filter(order => {
        const searchTerm = filter.toLowerCase();
        return (
            order.id.toLowerCase().includes(searchTerm) ||
            order.customer.toLowerCase().includes(searchTerm) ||
            order.paypalId?.toLowerCase().includes(searchTerm)
        );
    });

    return (
        <div className="space-y-8">
            <OrderDetailsDialog order={selectedOrder} isOpen={!!selectedOrder} onOpenChange={(isOpen) => !isOpen && setSelectedOrder(null)} />
            <div className="text-center">
                <h1 className="text-4xl md:text-5xl font-headline font-bold">Orders Dashboard</h1>
                <p className="text-lg text-muted-foreground mt-2">
                    A central place to manage all customer orders.
                </p>
            </div>

            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Orders</CardTitle>
                        <ListOrdered className="h-5 w-5 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold flex items-center gap-2">
                            {orders.length}
                            <TextToSpeech textToSpeak={`Total Orders: ${orders.length}`} ariaLabel="Read total orders" />
                        </div>
                        <p className="text-xs text-muted-foreground">All-time order count</p>
                    </CardContent>
                </Card>
                <Card className="bg-yellow-100 dark:bg-yellow-900/40 border-yellow-200 dark:border-yellow-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-yellow-900 dark:text-yellow-100">
                        <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
                        <Package className="h-5 w-5 text-yellow-800 dark:text-yellow-200" />
                    </CardHeader>
                    <CardContent className="text-yellow-900 dark:text-yellow-100">
                        <div className="text-3xl font-bold flex items-center gap-2">
                            {orders.filter(o => o.status === 'Pending').length}
                            <TextToSpeech textToSpeak={`Pending Orders: ${orders.filter(o => o.status === 'Pending').length}`} ariaLabel="Read pending orders" />
                        </div>
                        <p className="text-xs text-yellow-700 dark:text-yellow-300">Orders awaiting confirmation</p>
                    </CardContent>
                </Card>
                <Card className="bg-blue-100 dark:bg-blue-900/40 border-blue-200 dark:border-blue-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-blue-900 dark:text-blue-100">
                        <CardTitle className="text-sm font-medium">Processing Orders</CardTitle>
                        <Cog className="h-5 w-5 text-blue-800 dark:text-blue-200" />
                    </CardHeader>
                    <CardContent className="text-blue-900 dark:text-blue-100">
                        <div className="text-3xl font-bold flex items-center gap-2">
                            {orders.filter(o => o.status === 'Processing').length}
                            <TextToSpeech textToSpeak={`Processing Orders: ${orders.filter(o => o.status === 'Processing').length}`} ariaLabel="Read processing orders" />
                        </div>
                        <p className="text-xs text-blue-700 dark:text-blue-300">Orders being prepared</p>
                    </CardContent>
                </Card>
                <Card className="bg-green-100 dark:bg-green-900/40 border-green-200 dark:border-green-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-green-900 dark:text-green-100">
                        <CardTitle className="text-sm font-medium">Shipped Orders</CardTitle>
                        <Send className="h-5 w-5 text-green-800 dark:text-green-200" />
                    </CardHeader>
                    <CardContent className="text-green-900 dark:text-green-100">
                        <div className="text-3xl font-bold flex items-center gap-2">
                            {orders.filter(o => o.status === 'Shipped').length}
                            <TextToSpeech textToSpeak={`Shipped Orders: ${orders.filter(o => o.status === 'Shipped').length}`} ariaLabel="Read shipped orders" />
                        </div>
                        <p className="text-xs text-green-700 dark:text-green-300">Orders on their way</p>
                    </CardContent>
                </Card>
                <Card className="bg-red-100 dark:bg-red-900/40 border-red-200 dark:border-red-800">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 text-red-900 dark:text-red-100">
                        <CardTitle className="text-sm font-medium">Canceled Orders</CardTitle>
                        <XCircle className="h-5 w-5 text-red-800 dark:text-red-200" />
                    </CardHeader>
                    <CardContent className="text-red-900 dark:text-red-100">
                        <div className="text-3xl font-bold flex items-center gap-2">
                            {orders.filter(o => o.status === 'Canceled').length}
                            <TextToSpeech textToSpeak={`Canceled Orders: ${orders.filter(o => o.status === 'Canceled').length}`} ariaLabel="Read canceled orders" />
                        </div>
                        <p className="text-xs text-red-700 dark:text-red-300">Canceled or failed orders</p>
                    </CardContent>
                </Card>
            </div>

            <div className="md:hidden space-y-4">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                    <Input
                        placeholder="Filter by Order ID, Customer, PayPal ID..."
                        value={filter}
                        onChange={e => setFilter(e.target.value)}
                        className="w-full pl-10"
                    />
                </div>
                {filteredOrders.map((order) => (
                    <Card key={order.id} className="w-full">
                        <CardHeader>
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    {order.id}
                                    <TextToSpeech textToSpeak={`Order ID: ${order.id}`} ariaLabel={`Read order ID ${order.id}`} />
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    {getStatusBadge(order.status)}
                                    <TextToSpeech textToSpeak={`Status: ${order.status}`} ariaLabel={`Read order status ${order.status}`} />
                                </div>
                            </div>
                            <CardDescription as="div" className="text-xs text-muted-foreground flex items-center gap-2 pt-1">
                                <Calendar className="h-4 w-4" />
                                <ClientOnly fallback={<Skeleton className="h-4 w-20" />}>
                                    <span className="flex items-center gap-2">
                                        {new Date(order.date).toLocaleDateString()}
                                        <TextToSpeech textToSpeak={`Date: ${new Date(order.date).toLocaleDateString()}`} ariaLabel={`Read order date ${new Date(order.date).toLocaleDateString()}`} />
                                    </span>
                                </ClientOnly>
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex items-center gap-2">
                                <User className="h-4 w-4 text-muted-foreground" /> <span>{order.customer}</span>
                                <TextToSpeech textToSpeak={`Customer: ${order.customer}`} ariaLabel={`Read customer name ${order.customer}`} />
                            </div>
                            <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-muted-foreground" /> <span>{order.email}</span>
                                <TextToSpeech textToSpeak={`Email: ${order.email}`} ariaLabel={`Read customer email ${order.email}`} />
                            </div>
                            <div className="flex items-center gap-2">
                                <KeyRound className="h-4 w-4 text-muted-foreground" />
                                <span className="font-mono text-xs">{order.paypalId || 'N/A'}</span>
                                <TextToSpeech textToSpeak={`PayPal I D: ${order.paypalId || 'Not Available'}`} ariaLabel={`Read PayPal ID ${order.paypalId || 'Not Available'}`} />
                            </div>
                            <div className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4 text-muted-foreground" />
                                <span>${order.total.toFixed(2)}</span>
                                <TextToSpeech textToSpeak={`Total: $${order.total.toFixed(2)}`} ariaLabel={`Read order total $${order.total.toFixed(2)}`} />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-2">
                                    <Truck className="h-4 w-4" />
                                    Tracking Number
                                    <TextToSpeech textToSpeak={`Tracking Number: ${order.trackingNumber || 'Not available'}`} ariaLabel={`Read tracking number ${order.trackingNumber || 'Not available'}`} />
                                </label>
                                <Input
                                    type="text"
                                    placeholder="Enter tracking #"
                                    value={order.trackingNumber}
                                    onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                                    className="w-full text-sm"
                                    aria-label={`Tracking number for order ${order.id}`}
                                    disabled={order.status === 'Shipped' || order.status === 'Canceled'}
                                />
                            </div>
                            <div className="flex justify-end gap-2 pt-2">
                                <OrderActions
                                    order={order}
                                    onConfirm={handleConfirmOrder}
                                    onShip={handleShipOrder}
                                    onCancel={handleCancelOrder}
                                    onViewDetails={handleViewDetails}
                                />
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {filteredOrders.length === 0 && (
                    <p className="text-center text-muted-foreground py-4">No orders found.</p>
                )}
            </div>

            <Card className="hidden md:block">
                <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle>Recent Orders</CardTitle>
                    <div className="relative w-1/3">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                        <Input
                            placeholder="Filter by Order ID, Customer, PayPal ID..."
                            value={filter}
                            onChange={e => setFilter(e.target.value)}
                            className="w-full pl-10"
                        />
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]"></TableHead>
                                <TableHead>Order ID</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Customer</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-center">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order) => (
                                    <Collapsible asChild key={order.id} open={openCollapsibles.includes(order.id)} onOpenChange={() => toggleCollapsible(order.id)}>
                                        <>
                                            <TableRow>
                                                <TableCell>
                                                    <CollapsibleTrigger asChild>
                                                        <Button variant="ghost" size="icon" aria-label={`Toggle details for order ${order.id}`}>
                                                            {openCollapsibles.includes(order.id) ? <MinusCircle className="h-4 w-4" /> : <PlusCircle className="h-4 w-4" />}
                                                            <span className="sr-only">Toggle details for order {order.id}</span>
                                                        </Button>
                                                    </CollapsibleTrigger>
                                                </TableCell>
                                                <TableCell className="font-mono flex items-center gap-2">
                                                    {order.id}
                                                    <TextToSpeech textToSpeak={`Order I D: ${order.id}`} ariaLabel={`Read order ID ${order.id}`} />
                                                </TableCell>
                                                <TableCell>
                                                    <ClientOnly fallback={<Skeleton className="h-4 w-20" />}>
                                                        <div className="flex items-center gap-2">
                                                            {new Date(order.date).toLocaleDateString()}
                                                            <TextToSpeech textToSpeak={`Date: ${new Date(order.date).toLocaleDateString()}`} ariaLabel={`Read order date ${new Date(order.date).toLocaleDateString()}`} />
                                                        </div>
                                                    </ClientOnly>
                                                </TableCell>
                                                <TableCell className="font-medium flex items-center gap-2">
                                                    {order.customer}
                                                    <TextToSpeech textToSpeak={`Customer: ${order.customer}`} ariaLabel={`Read customer name ${order.customer}`} />
                                                </TableCell>
                                                <TableCell>
                                                    <div className="flex items-center gap-2">
                                                        {getStatusBadge(order.status)}
                                                        <TextToSpeech textToSpeak={`Status: ${order.status}`} ariaLabel={`Read order status ${order.status}`} />
                                                    </div>
                                                </TableCell>
                                                <TableCell>
                                                    <OrderActions
                                                        order={order}
                                                        onConfirm={handleConfirmOrder}
                                                        onShip={handleShipOrder}
                                                        onCancel={handleCancelOrder}
                                                        onViewDetails={handleViewDetails}
                                                    />
                                                </TableCell>
                                            </TableRow>
                                            <CollapsibleContent asChild>
                                                <TableRow className="bg-muted/50">
                                                    <TableCell colSpan={6} className="p-0">
                                                        <div className="p-4 grid grid-cols-4 gap-4">
                                                            <div>
                                                                <h4 className="font-semibold text-xs text-muted-foreground mb-1">EMAIL</h4>
                                                                <div className="flex items-center gap-2">
                                                                    <p>{order.email}</p>
                                                                    <TextToSpeech textToSpeak={`Email: ${order.email}`} ariaLabel={`Read email ${order.email}`} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-xs text-muted-foreground mb-1">PAYPAL ID</h4>
                                                                <div className="flex items-center gap-2">
                                                                    <p className="font-mono text-xs">{order.paypalId || 'N/A'}</p>
                                                                    <TextToSpeech textToSpeak={`PayPal I D: ${order.paypalId || 'Not Available'}`} ariaLabel={`Read PayPal ID ${order.paypalId || 'Not Available'}`} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-xs text-muted-foreground mb-1">TOTAL</h4>
                                                                <div className="flex items-center gap-2">
                                                                    <p>${order.total.toFixed(2)}</p>
                                                                    <TextToSpeech textToSpeak={`Total: $${order.total.toFixed(2)}`} ariaLabel={`Read total $${order.total.toFixed(2)}`} />
                                                                </div>
                                                            </div>
                                                            <div>
                                                                <h4 className="font-semibold text-xs text-muted-foreground mb-1">TRACKING NUMBER</h4>
                                                                <div className="flex items-center gap-2">
                                                                    <Input
                                                                        type="text"
                                                                        placeholder="Enter tracking #"
                                                                        value={order.trackingNumber}
                                                                        onChange={(e) => handleTrackingChange(order.id, e.target.value)}
                                                                        className="w-40 text-sm"
                                                                        aria-label={`Tracking number for order ${order.id}`}
                                                                        disabled={order.status === 'Shipped' || order.status === 'Canceled'}
                                                                    />
                                                                    <TextToSpeech textToSpeak={`Tracking Number: ${order.trackingNumber || 'Not set'}`} ariaLabel={`Read tracking number ${order.trackingNumber || 'Not set'}`} />
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            </CollapsibleContent>
                                        </>
                                    </Collapsible>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center text-muted-foreground py-4">
                                        No orders found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
}
