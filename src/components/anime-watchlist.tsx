"use client";

import { useState } from 'react';
import type { Anime } from '@/lib/types';
import { useLocalStorage } from '@/hooks/use-local-storage';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { Plus, MoreHorizontal } from 'lucide-react';

import { AnimeForm } from './anime-form';
import { DeleteAnimeDialog } from './delete-anime-dialog';
import { useToast } from '@/hooks/use-toast';

const initialData: Anime[] = [
    {
        id: '1',
        title: 'Frieren: Beyond Journey\'s End',
        episodes: 28,
        status: 'Completed',
        rating: 10,
        notes: 'A masterpiece of fantasy storytelling. Emotional and beautiful.',
    },
    {
        id: '2',
        title: 'Jujutsu Kaisen',
        episodes: 47,
        status: 'Watching',
        rating: 9,
        notes: 'Incredible animation and hype moments.',
    },
    {
        id: '3',
        title: 'Vinland Saga',
        episodes: 48,
        status: 'Completed',
        rating: 9,
        notes: 'Season 2 is a profound character study.',
    },
    {
        id: '4',
        title: 'Oshi no Ko',
        episodes: 11,
        status: 'Plan to Watch',
        rating: null,
        notes: 'Heard great things about this one.',
    }
];

export default function AnimeWatchlist() {
  const [animeList, setAnimeList] = useLocalStorage<Anime[]>('animeList', initialData);
  const [filter, setFilter] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAnime, setSelectedAnime] = useState<Anime | undefined>(undefined);
  const { toast } = useToast();

  const handleAddClick = () => {
    setSelectedAnime(undefined);
    setIsFormOpen(true);
  };

  const handleEditClick = (anime: Anime) => {
    setSelectedAnime(anime);
    setIsFormOpen(true);
  };

  const handleDeleteClick = (anime: Anime) => {
    setSelectedAnime(anime);
    setIsDeleteDialogOpen(true);
  };

  const handleFormSubmit = (data: Omit<Anime, 'id'>, id?: string) => {
    if (id) {
      // Edit
      setAnimeList(animeList.map((anime) => (anime.id === id ? { ...anime, ...data } : anime)));
      toast({ title: "Success", description: "Anime updated successfully." });
    } else {
      // Add
      const newAnime: Anime = { ...data, id: new Date().toISOString() };
      setAnimeList([newAnime, ...animeList]);
      toast({ title: "Success", description: "Anime added to your list." });
    }
  };

  const confirmDelete = () => {
    if (selectedAnime) {
      setAnimeList(animeList.filter((anime) => anime.id !== selectedAnime.id));
      toast({ title: "Success", description: `"${selectedAnime.title}" was removed from your list.` });
    }
    setIsDeleteDialogOpen(false);
    setSelectedAnime(undefined);
  };

  const getStatusVariant = (status: Anime['status']) => {
    switch (status) {
      case 'Watching':
        return 'default';
      case 'Completed':
        return 'secondary';
      case 'Plan to Watch':
        return 'outline';
      case 'Dropped':
        return 'destructive';
      default:
        return 'default';
    }
  };

  const filteredAnimeList = animeList.filter((anime) =>
    anime.title.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <header className="text-center space-y-2">
        <h1 className="text-4xl font-bold font-headline tracking-tight">AnimeLogger</h1>
        <p className="text-muted-foreground">Your personal anime tracking companion.</p>
      </header>
      
      <div className="flex justify-between items-center gap-4">
        <Input
          placeholder="Filter by title..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="max-w-sm"
        />
        <Button onClick={handleAddClick}>
          <Plus className="mr-2 h-4 w-4" /> Add Anime
        </Button>
      </div>

      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[40%]">Title</TableHead>
              <TableHead>Episodes</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAnimeList.length > 0 ? (
              filteredAnimeList.map((anime) => (
                <TableRow key={anime.id}>
                  <TableCell className="font-medium">{anime.title}</TableCell>
                  <TableCell>{anime.episodes}</TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(anime.status)}>{anime.status}</Badge>
                  </TableCell>
                  <TableCell>
                    {anime.rating ? `${anime.rating}/10` : 'N/A'}
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
                        <DropdownMenuItem onClick={() => handleEditClick(anime)}>
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDeleteClick(anime)} className="text-red-500">
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  No anime found. Try adding one!
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      
      <AnimeForm 
        isOpen={isFormOpen} 
        onOpenChange={setIsFormOpen} 
        onSubmit={handleFormSubmit}
        anime={selectedAnime}
      />
      
      <DeleteAnimeDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        onConfirm={confirmDelete}
        animeTitle={selectedAnime?.title}
      />

    </div>
  );
}
