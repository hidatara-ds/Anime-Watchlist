"use client";

import type { FC } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
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
import { Switch } from '@/components/ui/switch';

const formSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  episodes: z.coerce.number().int().min(0, 'Episodes must be at least 0'),
  status: z.enum(['Plan to Watch', 'Watching', 'Completed', 'Dropped']),
  rating: z.coerce.number().int().min(0).max(10),
  notes: z.string().optional(),
  coverImage: z.string().optional(),
});

type AnimeFormValues = z.infer<typeof formSchema>;
type FormSubmitData = Omit<AnimeFormValues, 'id'>;

interface AnimeFormProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onSubmit: (data: Omit<Anime, 'id'>, id?: string) => void;
  anime?: Anime;
}

const statusOptions: AnimeStatus[] = ['Plan to Watch', 'Watching', 'Completed', 'Dropped'];
const ratingOptions = Array.from({ length: 11 }, (_, i) => i);

export const AnimeForm: FC<AnimeFormProps> = ({ isOpen, onOpenChange, onSubmit, anime }) => {
  const form = useForm<AnimeFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      episodes: 0,
      status: 'Plan to Watch',
      rating: 0,
      notes: '',
      coverImage: '',
    },
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        form.reset({
          title: anime?.title || '',
          episodes: anime?.episodes || 0,
          status: (anime?.status as AnimeStatus) || 'Plan to Watch',
          rating: anime?.rating ?? 0,
          notes: anime?.notes || '',
          coverImage: anime?.coverImage || '',
        });
      }, 0);
    }
  }, [isOpen, anime, form]);

  const handleFormSubmit = (data: AnimeFormValues) => {
    const mapped: Omit<Anime, 'id'> = {
      title: data.title,
      episodes: data.episodes,
      status: data.status,
      rating: data.rating === 0 ? null : data.rating,
      notes: data.notes || '',
      coverImage: data.coverImage || undefined,
    };
    onSubmit(mapped, anime?.id);
    onOpenChange(false);
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
                    <Input 
                      placeholder="e.g., Attack on Titan" 
                      autoFocus
                      {...field} 
                    />
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
                  <FormLabel>Cover Image URL (optional)</FormLabel>
                  <FormControl>
                    <Input 
                      placeholder="https://..." 
                      {...field} 
                    />
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
                    <Select onValueChange={field.onChange} value={field.value}>
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
                  <Select 
                    onValueChange={(value) => field.onChange(Number(value))} 
                    value={String(field.value)}
                  >
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
            {/* Removed Favorite toggle to match current Anime type */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes (optional)</FormLabel>
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
