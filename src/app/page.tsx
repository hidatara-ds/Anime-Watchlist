'use client';

import React, { useState, useEffect } from 'react';
import { MainLayout } from '@/components/main-layout';
import { WelcomeSection, ModernStatsCards } from '@/components/modern-stats-cards';
import { ModernSearchFilter } from '@/components/modern-search-filter';
import { ModernAnimeCards } from '@/components/modern-anime-cards';
import { motion } from 'framer-motion';
import { useToast } from '@/hooks/use-toast';

interface FilterOptions {
  status: string[];
  rating: { min: number; max: number } | null;
  year: { min: number; max: number } | null;
  favorite: boolean | null;
}

interface SortOption {
  field: 'title' | 'rating' | 'updatedAt' | 'episodes' | 'createdAt';
  direction: 'asc' | 'desc';
}

interface Anime {
  id: string;
  title: string;
  coverUrl?: string;
  episodes: number;
  status: 'PLAN' | 'WATCHING' | 'COMPLETED' | 'ON_HOLD' | 'DROPPED';
  rating: number;
  notes?: string;
  favorite: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export default function Home() {
  const { toast } = useToast();
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [animeList, setAnimeList] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filters, setFilters] = useState<FilterOptions>({
    status: [],
    rating: null,
    year: null,
    favorite: null
  });
  const [sortBy, setSortBy] = useState<SortOption>({
    field: 'updatedAt',
    direction: 'desc'
  });

  // Fetch anime data
  useEffect(() => {
    const fetchAnime = async () => {
      try {
        const response = await fetch('/api/anime');
        if (response.ok) {
          const data = await response.json();
          setAnimeList(data.map((anime: any) => ({
            ...anime,
            // Construct image URL endpoint; image may or may not exist
            coverUrl: `/api/anime/${anime.id}`,
            createdAt: new Date(anime.createdAt),
            updatedAt: new Date(anime.updatedAt)
          })));
        }
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnime();
  }, []);

  // Filter and sort anime
  const filteredAnime = React.useMemo(() => {
    let filtered = animeList.filter(anime => {
      // Search filter
      if (searchQuery && !anime.title.toLowerCase().includes(searchQuery.toLowerCase())) {
        return false;
      }

      // Status filter
      if (filters.status.length > 0 && !filters.status.includes(anime.status)) {
        return false;
      }

      // Rating filter
      if (filters.rating && (anime.rating < filters.rating.min || anime.rating > filters.rating.max)) {
        return false;
      }

      // Favorite filter
      if (filters.favorite !== null && anime.favorite !== filters.favorite) {
        return false;
      }

      return true;
    });

    // Sort
    filtered.sort((a, b) => {
      const aValue = a[sortBy.field];
      const bValue = b[sortBy.field];
      
      if (sortBy.direction === 'asc') {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    return filtered;
  }, [animeList, searchQuery, filters, sortBy]);

  // Calculate stats
  const stats = React.useMemo(() => {
    const total = animeList.length;
    const completed = animeList.filter(anime => anime.status === 'COMPLETED').length;
    const watching = animeList.filter(anime => anime.status === 'WATCHING').length;
    const planToWatch = animeList.filter(anime => anime.status === 'PLAN').length;
    const totalEpisodes = animeList.reduce((sum, anime) => sum + anime.episodes, 0);
    const averageRating = animeList.length > 0 
      ? animeList.filter(anime => anime.rating > 0).reduce((sum, anime) => sum + anime.rating, 0) / animeList.filter(anime => anime.rating > 0).length 
      : 0;
    const hoursWatched = totalEpisodes * 0.4; // Assuming 24 minutes per episode

    return {
      total,
      completed,
      watching,
      planToWatch,
      averageRating,
      totalEpisodes,
      hoursWatched
    };
  }, [animeList]);

  const handleEdit = (anime: Anime) => {
    // TODO: Implement edit functionality
    console.log('Edit anime:', anime);
  };

  const handleDelete = async (id: string) => {
    try {
      const anime = animeList.find(a => a.id === id);
      const response = await fetch(`/api/anime/${id}`, { method: 'DELETE' });
      if (response.ok) {
        setAnimeList(prev => prev.filter(anime => anime.id !== id));
        toast({
          title: "Anime Deleted",
          description: `${anime?.title || 'Anime'} has been removed from your list`,
        });
      }
    } catch (error) {
      console.error('Error deleting anime:', error);
      toast({
        title: "Error",
        description: "Failed to delete anime. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleToggleFavorite = async (id: string) => {
    try {
      const anime = animeList.find(a => a.id === id);
      if (!anime) return;

      const response = await fetch(`/api/anime/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...anime, favorite: !anime.favorite })
      });

      if (response.ok) {
        setAnimeList(prev => prev.map(a => 
          a.id === id ? { ...a, favorite: !a.favorite } : a
        ));
        toast({
          title: !anime.favorite ? "Added to Favorites" : "Removed from Favorites",
          description: `${anime.title} has been ${!anime.favorite ? 'added to' : 'removed from'} your favorites`,
        });
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      toast({
        title: "Error",
        description: "Failed to update favorite status. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleAddAnime = async (animeData: any) => {
    try {
      const form = new FormData();
      form.set('title', animeData.title);
      form.set('episodes', String(animeData.episodes ?? 0));
      form.set('status', animeData.status ?? 'PLAN');
      form.set('rating', String(animeData.rating ?? 0));
      if (animeData.notes) form.set('notes', animeData.notes);
      form.set('favorite', String(animeData.favorite ?? false));
      if (animeData.coverFile) form.set('cover', animeData.coverFile);

      const response = await fetch('/api/anime', {
        method: 'POST',
        body: form,
      });

      if (response.ok) {
        const newAnime = await response.json();
        setAnimeList(prev => [{ ...newAnime, coverUrl: `/api/anime/${newAnime.id}` }, ...prev]);
        toast({
          title: "Anime Added Successfully!",
          description: `${animeData.title} has been added to your watchlist`,
        });
      } else {
        throw new Error('Failed to add anime');
      }
    } catch (error) {
      console.error('Error adding anime:', error);
      toast({
        title: "Error",
        description: "Failed to add anime. Please try again.",
        variant: "destructive",
      });
      throw error; // Re-throw untuk ditangani oleh modal
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <WelcomeSection />
            <ModernStatsCards stats={stats} />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <ModernSearchFilter
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                filters={filters}
                onFiltersChange={setFilters}
                sortBy={sortBy}
                onSortChange={setSortBy}
                viewMode={viewMode}
                onViewModeChange={setViewMode}
                totalResults={filteredAnime.length}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {loading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="bg-[var(--bg-secondary)] rounded-lg h-80" />
                    </div>
                  ))}
                </div>
              ) : (
                <ModernAnimeCards
                  animeList={filteredAnime}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  onToggleFavorite={handleToggleFavorite}
                />
              )}
            </motion.div>
          </motion.div>
        );

      case 'my-anime':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--text-primary)] mb-2">
                My Anime List
              </h1>
              <p className="text-[var(--text-secondary)]">
                Manage your complete anime collection
              </p>
            </div>
            
            <ModernSearchFilter
              searchQuery={searchQuery}
              onSearchChange={setSearchQuery}
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              totalResults={filteredAnime.length}
            />

            <ModernAnimeCards
              animeList={filteredAnime}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onToggleFavorite={handleToggleFavorite}
            />
          </motion.div>
        );

      case 'statistics':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--text-primary)] mb-2">
                Statistics
              </h1>
              <p className="text-[var(--text-secondary)]">
                Insights into your anime watching habits
              </p>
            </div>
            <ModernStatsCards stats={stats} />
            {/* TODO: Add more detailed statistics charts */}
          </motion.div>
        );

      case 'anisensei':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--text-primary)] mb-2">
                AniSensei
              </h1>
              <p className="text-[var(--text-secondary)]">
                Your AI anime assistant
              </p>
            </div>
            {/* Chat interface will be shown in floating mode */}
            <div className="text-center py-16">
              <p className="text-[var(--text-secondary)]">
                Use the chat button to start a conversation with AniSensei
              </p>
            </div>
          </motion.div>
        );

      case 'settings':
        return (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div>
              <h1 className="text-3xl font-bold font-[var(--font-heading)] text-[var(--text-primary)] mb-2">
                Settings
              </h1>
              <p className="text-[var(--text-secondary)]">
                Customize your AnimeLogger experience
              </p>
            </div>
            {/* TODO: Add settings content */}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <MainLayout 
      currentPage={currentPage}
      onPageChange={setCurrentPage}
      onAddAnime={handleAddAnime}
    >
      {renderCurrentPage()}
    </MainLayout>
  );
}
