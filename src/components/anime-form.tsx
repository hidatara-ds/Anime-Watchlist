"use client";

import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import type { Anime, AnimeStatus } from '@/lib/types';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  episodes: z.coerce.number().int().min(1, 'Episodes must be at least 1'),
  status: z.enum(['Watching', 'Completed', 'Plan to Watch', 'Dropped']),
  rating: z.coerce.number().int().min(0).max(10).nullable(),
  notes: z.string().optional(),
  coverImage: z.string().optional(),
});

type AnimeFormValues = z.infer<typeof formSchema>;
type FormSubmitData = Omit<AnimeFormValues, 'id'>;

interface AnimeFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: FormSubmitData, id?: string) => void;
  anime?: Anime;
}

const statusOptions: AnimeStatus[] = ['Watching', 'Completed', 'Plan to Watch', 'Dropped'];
const ratingOptions = Array.from({ length: 11 }, (_, i) => i); // 0-10

export const AnimeForm: FC<AnimeFormProps> = ({ isOpen, onOpenChange, onSubmit, anime }) => {
  const form = useForm<AnimeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: anime?.title || '',
      episodes: anime?.episodes || 1,
      status: anime?.status || 'Plan to Watch',
      rating: anime?.rating ?? 0,
      notes: anime?.notes || '',
      coverImage: anime?.coverImage || '',
    },
  });
  
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        form.setValue('coverImage', reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFormSubmit = (data: AnimeFormValues) => {
    onSubmit(data, anime?.id);
    onOpenChange(false);
    form.reset();
  };
  
  // Reset form when dialog closes or anime data changes
  if (isOpen && form.getValues('title') !== (anime?.title || '')) {
     form.reset({
      title: anime?.title || '',
      episodes: anime?.episodes || 1,
      status: anime?.status || 'Plan to Watch',
      rating: anime?.rating ?? 0,
      notes: anime?.notes || '',
      coverImage: anime?.coverImage || '',
    });
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{anime ? 'Edit Anime' : 'Add Anime'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleFormSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g., Attack on Titan" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
             <FormField
              control={form.control}
              name="coverImage"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Cover Image</FormLabel>
                  <FormControl>
                    <Input type="file" accept="image/*" onChange={handleFileChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="episodes"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Episodes</FormLabel>
                    <FormControl>
                      <Input type="number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
               <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {statusOptions.map((status) => (
                          <SelectItem key={status} value={status}>
                            {status}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
             <FormField
                control={form.control}
                name="rating"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Rating</FormLabel>
                    <Select onValueChange={(value) => field.onChange(value === null ? null : Number(value))} defaultValue={String(field.value)}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select rating" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {ratingOptions.map((rating) => (
                          <SelectItem key={rating} value={String(rating)}>
                            {rating === 0 ? 'Not Rated' : `${rating}/10`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Your thoughts on the anime..." {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
               <DialogClose asChild>
                <Button type="button" variant="secondary">Cancel</Button>
              </DialogClose>
              <Button type="submit">{anime ? 'Save Changes' : 'Add Anime'}</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
