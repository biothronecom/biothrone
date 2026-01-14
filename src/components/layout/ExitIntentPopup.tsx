
"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { X, Gift, CheckCircle } from "lucide-react";
import { FocusScope } from "@radix-ui/react-focus-scope";
import { useIsAdminRoute } from "@/hooks/useIsAdminRoute";

const subscriptionSchema = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email." }),
  whatsapp: z.string().optional(),
  terms: z.boolean().refine((val) => val === true, {
    message: "You must accept the terms and conditions.",
  }),
});

type SubscriptionFormData = z.infer<typeof subscriptionSchema>;

export function ExitIntentPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const isAdminRoute = useIsAdminRoute();

  const form = useForm<SubscriptionFormData>({
    resolver: zodResolver(subscriptionSchema),
    defaultValues: {
      name: "",
      email: "",
      whatsapp: "",
      terms: true,
    },
  });

  useEffect(() => {
    if (isAdminRoute) return;

    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem("exitIntentPopupShown")) {
        setIsOpen(true);
        sessionStorage.setItem("exitIntentPopupShown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, [isAdminRoute]);

  const onSubmit = (data: SubscriptionFormData) => {
    console.log("Subscription Data:", data);
    setIsSubmitted(true);
  };
  
  if (isAdminRoute) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent 
        className="bg-white text-black p-0 max-w-md border-orange-accent border-4"
        onEscapeKeyDown={(e) => e.preventDefault()}
        onPointerDownOutside={(e) => e.preventDefault()}
      >
        <FocusScope trapped={isOpen}>
            <div className="p-8">
                <DialogHeader className="text-center mb-6">
                    <div className="mx-auto bg-orange-accent text-white rounded-full h-16 w-16 flex items-center justify-center mb-4">
                        <Gift className="h-8 w-8" />
                    </div>
                    <DialogTitle className="text-3xl font-bold text-black">Wait! Before You Go...</DialogTitle>
                    <DialogDescription className="text-lg text-black/80">
                        Get exclusive offers and updates delivered to your inbox.
                    </DialogDescription>
                </DialogHeader>

                {isSubmitted ? (
                    <div className="text-center space-y-4 py-8">
                        <CheckCircle className="h-16 w-16 text-green-500 mx-auto" />
                        <h3 className="text-2xl font-bold text-black">Thank You!</h3>
                        <p className="text-black/80">You've been subscribed successfully. Keep an eye out for amazing deals!</p>
                        <Button onClick={() => setIsOpen(false)} className="bg-green-500 hover:bg-green-600 text-white w-full">
                            Continue Shopping
                        </Button>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black">Name</FormLabel>
                                <FormControl>
                                <Input placeholder="Your Name" {...field} className="bg-gray-100 border-gray-300 text-black focus:border-orange-accent focus:ring-orange-accent" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black">Email</FormLabel>
                                <FormControl>
                                <Input type="email" placeholder="you@example.com" {...field} className="bg-gray-100 border-gray-300 text-black focus:border-orange-accent focus:ring-orange-accent" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="whatsapp"
                            render={({ field }) => (
                            <FormItem>
                                <FormLabel className="text-black">WhatsApp (Optional)</FormLabel>
                                <FormControl>
                                <Input placeholder="+1234567890" {...field} className="bg-gray-100 border-gray-300 text-black focus:border-orange-accent focus:ring-orange-accent" />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="terms"
                            render={({ field }) => (
                            <FormItem className="flex items-center space-x-2">
                                <FormControl>
                                <Checkbox
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                    className="data-[state=checked]:bg-orange-accent data-[state=checked]:border-orange-accent"
                                />
                                </FormControl>
                                <FormLabel className="text-sm text-black/70 !mt-0">
                                    I accept the terms and conditions
                                </FormLabel>
                            </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full bg-orange-accent hover:bg-orange-accent/90 text-orange-accent-foreground text-lg py-6">
                            Subscribe & Get Offers
                        </Button>
                        </form>
                    </Form>
                )}
            </div>
            <DialogClose className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none text-black">
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
            </DialogClose>
        </FocusScope>
      </DialogContent>
    </Dialog>
  );
}
