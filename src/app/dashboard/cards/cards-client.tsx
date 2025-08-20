'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';
import { CreditCard, Save } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import type { PaymentCard } from '@/lib/types';

const cardSchema = z.object({
  id: z.string(),
  provider: z.string().min(1, 'Provider is required'),
  lastFour: z.string().length(4, 'Must be 4 digits'),
  expiryDate: z.string().regex(/^(0[1-9]|1[0-2])\/\d{2}$/, 'Invalid format (MM/YY)'),
  status: z.enum(['Active', 'Inactive']),
});

const formSchema = z.object({
  cards: z.array(cardSchema),
});

type FormValues = z.infer<typeof formSchema>;

export function CardsClient({ initialCards }: { initialCards: PaymentCard[] }) {
  const { toast } = useToast();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      cards: initialCards,
    },
  });

  const { fields } = useFieldArray({
    control: form.control,
    name: 'cards',
  });

  const onSubmit = (data: FormValues) => {
    // Here you would typically send the data to your server
    console.log('Updated card credentials:', data.cards);
    toast({
      title: 'Success!',
      description: 'Payment credentials have been updated.',
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Credentials</CardTitle>
        <CardDescription>Update the company's payment methods.</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              {fields.map((field, index) => (
                <Card key={field.id} className="p-4">
                  <div className="flex items-center gap-2 mb-4">
                     <CreditCard className="w-6 h-6" />
                     <h3 className="text-lg font-semibold">Card {index + 1}</h3>
                  </div>
                  <div className="space-y-4">
                    <FormField
                      control={form.control}
                      name={`cards.${index}.provider`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Card Provider</FormLabel>
                          <FormControl>
                            <Input placeholder="e.g., Visa" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`cards.${index}.lastFour`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Last Four Digits</FormLabel>
                          <FormControl>
                            <Input placeholder="1234" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`cards.${index}.expiryDate`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Expiry Date (MM/YY)</FormLabel>
                          <FormControl>
                            <Input placeholder="MM/YY" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`cards.${index}.status`}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                           <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select a status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Active">Active</SelectItem>
                              <SelectItem value="Inactive">Inactive</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </Card>
              ))}
            </div>
            <div className="flex justify-end">
              <Button type="submit">
                <Save className="mr-2 h-4 w-4" />
                Save All Changes
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
