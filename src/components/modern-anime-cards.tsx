'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Heart, 
  Edit, 
  Trash2, 
  Play, 
  Star, 
  Calendar,
  Clock,
  MoreHorizontal,
  Grid3X3,
  List
} from 'lucide-react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import Image from 'next/image';

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

interface AnimeCardProps {
  anime: Anime;
  viewMode: 'grid' | 'list';
  onEdit?: (anime: Anime) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

const statusColors = {
  PLAN: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  WATCHING: 'bg-green-500/20 text-green-400 border-green-500/30',
  COMPLETED: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  ON_HOLD: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  DROPPED: 'bg-red-500/20 text-red-400 border-red-500/30',
};

const statusLabels = {
  PLAN: 'Plan to Watch',
  WATCHING: 'Watching',
  COMPLETED: 'Completed',
  ON_HOLD: 'On Hold',
  DROPPED: 'Dropped',
};

function AnimeCard({ anime, viewMode, onEdit, onDelete, onToggleFavorite }: AnimeCardProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  
  const progress = anime.status === 'COMPLETED' ? 100 : 
                  anime.status === 'WATCHING' ? Math.random() * 80 + 10 : 0; // Mock progress
  
  const getProgressColor = () => {
    if (progress === 100) return 'bg-green-500';
    if (progress > 60) return 'bg-blue-500';
    if (progress > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (viewMode === 'list') {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.3 }}
        whileHover={{ backgroundColor: 'var(--bg-hover)' }}
        className="p-4 border-b border-[var(--border-color)] transition-colors duration-200"
      >
        <div className="flex items-center space-x-4">
          {/* Thumbnail */}
          <div className="relative w-16 h-20 rounded-lg overflow-hidden bg-[var(--bg-tertiary)] flex-shrink-0">
            {anime.coverUrl && !imageError ? (
              <Image
                src={anime.coverUrl}
                alt={anime.title}
                fill
                className={`object-cover transition-opacity duration-300 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                onLoad={() => setImageLoaded(true)}
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <Play className="w-6 h-6 text-[var(--text-tertiary)]" />
              </div>
            )}
          </div>

          {/* Title and Info */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between">
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-[var(--text-primary)] truncate mb-1">
                  {anime.title}
                </h3>
                <div className="flex items-center space-x-4 text-sm text-[var(--text-secondary)]">
                  <span>Episodes: {anime.episodes}</span>
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                    <span>{anime.rating}/10</span>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2 ml-4">
                {anime.favorite && (
                  <Heart className="w-5 h-5 fill-red-500 text-red-500" />
                )}
                <Badge className={statusColors[anime.status]}>
                  {statusLabels[anime.status]}
                </Badge>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="mt-3 flex items-center space-x-3">
              <div className="flex-1">
                <Progress value={progress} className="h-2" />
              </div>
              <span className="text-sm text-[var(--text-secondary)] min-w-0">
                {Math.round(progress)}%
              </span>
            </div>
          </div>

          {/* Actions */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreHorizontal className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit?.(anime)}>
                <Edit className="w-4 h-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleFavorite?.(anime.id)}>
                <Heart className="w-4 h-4 mr-2" />
                {anime.favorite ? 'Remove from Favorites' : 'Add to Favorites'}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete?.(anime.id)}
                className="text-red-400"
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </motion.div>
    );
  }

  // Grid View
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.8 }}
      transition={{ duration: 0.4, type: 'spring', stiffness: 100 }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group"
    >
      <Card className="glass overflow-hidden card-hover relative">
        {/* Favorite Heart */}
        {anime.favorite && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute top-3 right-3 z-20"
          >
            <Heart className="w-6 h-6 fill-red-500 text-red-500 drop-shadow-lg" />
          </motion.div>
        )}

        {/* Cover Image */}
        <div className="relative aspect-[3/4] bg-[var(--bg-tertiary)] overflow-hidden">
          {anime.coverUrl && !imageError ? (
            <Image
              src={anime.coverUrl}
              alt={anime.title}
              fill
              className={`object-cover transition-all duration-500 group-hover:scale-110 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              <Play className="w-12 h-12 text-[var(--text-tertiary)]" />
            </div>
          )}
          
          {/* Overlay Gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
          
          {/* Quick Actions */}
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileHover={{ opacity: 1, y: 0 }}
              className="absolute bottom-3 left-3 right-3 flex space-x-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
            >
              <Button 
                size="sm" 
                variant="secondary"
                onClick={() => onEdit?.(anime)}
                className="flex-1 bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
              >
                <Edit className="w-4 h-4 mr-1" />
                Edit
              </Button>
              <Button 
                size="sm" 
                variant="destructive"
                onClick={() => onDelete?.(anime.id)}
                className="bg-red-500/80 hover:bg-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <Badge className={`${statusColors[anime.status]} text-xs`}>
              {statusLabels[anime.status]}
            </Badge>
            <div className="flex items-center space-x-1 text-xs text-[var(--text-secondary)]">
              <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
              <span>{anime.rating}/10</span>
            </div>
          </div>

          <h3 className="font-semibold text-[var(--text-primary)] mb-2 line-clamp-2 min-h-[2.5rem]">
            {anime.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-[var(--text-secondary)] mb-3">
            <span className="flex items-center">
              <Calendar className="w-4 h-4 mr-1" />
              {anime.episodes} episodes
            </span>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[var(--text-secondary)]">Progress</span>
              <span className="text-[var(--text-primary)] font-medium">{Math.round(progress)}%</span>
            </div>
            <div className="w-full bg-[var(--bg-tertiary)] rounded-full h-2 overflow-hidden">
              <motion.div
                className={`h-full ${getProgressColor()} rounded-full`}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1, delay: 0.2 }}
              />
            </div>
          </div>

          {anime.notes && (
            <p className="text-xs text-[var(--text-tertiary)] mt-3 line-clamp-2">
              {anime.notes}
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  );
}

interface ModernAnimeCardsProps {
  animeList: Anime[];
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onEdit?: (anime: Anime) => void;
  onDelete?: (id: string) => void;
  onToggleFavorite?: (id: string) => void;
}

export function ModernAnimeCards({ 
  animeList, 
  viewMode = 'grid',
  onViewModeChange,
  onEdit,
  onDelete,
  onToggleFavorite 
}: ModernAnimeCardsProps) {
  return (
    <div className="space-y-6">
      {/* View Toggle */}
      <div className="flex justify-end">
        <div className="flex items-center space-x-2 p-1 bg-[var(--bg-secondary)] rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange?.('grid')}
            className={viewMode === 'grid' ? 'btn-gradient' : ''}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange?.('list')}
            className={viewMode === 'list' ? 'btn-gradient' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Anime List */}
      <AnimatePresence mode="wait">
        {viewMode === 'grid' ? (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6"
          >
            {animeList.map((anime, index) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <AnimeCard
                  anime={anime}
                  viewMode="grid"
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            key="list"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="bg-[var(--bg-secondary)] rounded-lg overflow-hidden"
          >
            {animeList.map((anime, index) => (
              <motion.div
                key={anime.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <AnimeCard
                  anime={anime}
                  viewMode="list"
                  onEdit={onEdit}
                  onDelete={onDelete}
                  onToggleFavorite={onToggleFavorite}
                />
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {animeList.length === 0 && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-16"
        >
          <div className="w-24 h-24 mx-auto mb-6 bg-[var(--bg-secondary)] rounded-full flex items-center justify-center">
            <Play className="w-12 h-12 text-[var(--text-tertiary)]" />
          </div>
          <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
            No anime in your list yet
          </h3>
          <p className="text-[var(--text-secondary)] mb-6">
            Start building your anime collection by adding your first anime!
          </p>
          <Button className="btn-gradient">
            <Play className="w-4 h-4 mr-2" />
            Add Your First Anime
          </Button>
        </motion.div>
      )}
    </div>
  );
}
