'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  Filter, 
  X, 
  SortAsc, 
  SortDesc,
  Calendar,
  Star,
  Grid3X3,
  List,
  ChevronDown
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

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

interface ModernSearchFilterProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  filters: FilterOptions;
  onFiltersChange: (filters: FilterOptions) => void;
  sortBy: SortOption;
  onSortChange: (sort: SortOption) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  totalResults?: number;
}

const statusOptions = [
  { value: 'PLAN', label: 'Plan to Watch', color: 'bg-blue-500' },
  { value: 'WATCHING', label: 'Watching', color: 'bg-green-500' },
  { value: 'COMPLETED', label: 'Completed', color: 'bg-purple-500' },
  { value: 'ON_HOLD', label: 'On Hold', color: 'bg-yellow-500' },
  { value: 'DROPPED', label: 'Dropped', color: 'bg-red-500' },
];

const sortOptions = [
  { field: 'title', label: 'Title' },
  { field: 'rating', label: 'Rating' },
  { field: 'updatedAt', label: 'Last Updated' },
  { field: 'episodes', label: 'Episodes' },
  { field: 'createdAt', label: 'Date Added' },
];

export function ModernSearchFilter({
  searchQuery,
  onSearchChange,
  filters,
  onFiltersChange,
  sortBy,
  onSortChange,
  viewMode,
  onViewModeChange,
  totalResults = 0
}: ModernSearchFilterProps) {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [suggestions] = useState([
    'Attack on Titan',
    'Demon Slayer',
    'One Piece',
    'Naruto',
    'My Hero Academia'
  ]);

  const activeFiltersCount = 
    filters.status.length + 
    (filters.rating ? 1 : 0) + 
    (filters.year ? 1 : 0) + 
    (filters.favorite !== null ? 1 : 0);

  const handleStatusFilter = (status: string) => {
    const newStatus = filters.status.includes(status)
      ? filters.status.filter(s => s !== status)
      : [...filters.status, status];
    
    onFiltersChange({ ...filters, status: newStatus });
  };

  const clearFilters = () => {
    onFiltersChange({
      status: [],
      rating: null,
      year: null,
      favorite: null
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Search Bar */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative"
      >
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] group-focus-within:text-[var(--accent-primary)] transition-colors duration-200" />
          
          <Input
            placeholder="Search your anime collection..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-12 pr-12 h-14 text-lg bg-[var(--bg-secondary)] border-[var(--border-color)] focus:border-[var(--accent-primary)] focus:ring-2 focus:ring-[var(--accent-primary)]/20 transition-all duration-200"
          />
          
          {searchQuery && (
            <motion.button
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={() => onSearchChange('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors duration-200"
            >
              <X className="w-5 h-5" />
            </motion.button>
          )}
        </div>

        {/* Search Suggestions */}
        <AnimatePresence>
          {searchQuery && searchQuery.length > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="absolute top-full left-0 right-0 mt-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-lg z-50 overflow-hidden"
            >
              {suggestions
                .filter(s => s.toLowerCase().includes(searchQuery.toLowerCase()))
                .slice(0, 5)
                .map((suggestion, index) => (
                  <motion.button
                    key={suggestion}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => onSearchChange(suggestion)}
                    className="w-full text-left px-4 py-3 hover:bg-[var(--bg-hover)] transition-colors duration-150 text-[var(--text-primary)]"
                  >
                    <Search className="w-4 h-4 inline mr-3 text-[var(--text-tertiary)]" />
                    {suggestion}
                  </motion.button>
                ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Filter and Sort Controls */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex flex-wrap items-center justify-between gap-4"
      >
        <div className="flex items-center space-x-4">
          {/* Filter Button */}
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className={`relative ${
              activeFiltersCount > 0 
                ? 'border-[var(--accent-primary)] text-[var(--accent-primary)]' 
                : 'border-[var(--border-color)]'
            }`}
          >
            <Filter className="w-4 h-4 mr-2" />
            Filters
            {activeFiltersCount > 0 && (
              <Badge className="ml-2 bg-[var(--accent-primary)] text-white text-xs px-1.5 py-0.5">
                {activeFiltersCount}
              </Badge>
            )}
          </Button>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="border-[var(--border-color)]">
                {sortBy.direction === 'asc' ? (
                  <SortAsc className="w-4 h-4 mr-2" />
                ) : (
                  <SortDesc className="w-4 h-4 mr-2" />
                )}
                Sort by {sortOptions.find(opt => opt.field === sortBy.field)?.label}
                <ChevronDown className="w-4 h-4 ml-2" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuItem
                  key={option.field}
                  onClick={() => onSortChange({ 
                    field: option.field as any, 
                    direction: sortBy.field === option.field && sortBy.direction === 'asc' ? 'desc' : 'asc'
                  })}
                  className="flex items-center justify-between"
                >
                  <span>{option.label}</span>
                  {sortBy.field === option.field && (
                    sortBy.direction === 'asc' ? 
                      <SortAsc className="w-4 h-4" /> : 
                      <SortDesc className="w-4 h-4" />
                  )}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Results Count */}
          <span className="text-sm text-[var(--text-secondary)]">
            {totalResults} {totalResults === 1 ? 'anime' : 'anime'}
          </span>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center space-x-2 p-1 bg-[var(--bg-secondary)] rounded-lg">
          <Button
            variant={viewMode === 'grid' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('grid')}
            className={viewMode === 'grid' ? 'btn-gradient' : ''}
          >
            <Grid3X3 className="w-4 h-4" />
          </Button>
          <Button
            variant={viewMode === 'list' ? 'default' : 'ghost'}
            size="sm"
            onClick={() => onViewModeChange('list')}
            className={viewMode === 'list' ? 'btn-gradient' : ''}
          >
            <List className="w-4 h-4" />
          </Button>
        </div>
      </motion.div>

      {/* Active Filters */}
      <AnimatePresence>
        {activeFiltersCount > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex flex-wrap items-center gap-2"
          >
            <span className="text-sm text-[var(--text-secondary)]">Active filters:</span>
            
            {filters.status.map((status) => {
              const statusOption = statusOptions.find(opt => opt.value === status);
              return (
                <Badge
                  key={status}
                  variant="secondary"
                  className="flex items-center space-x-1 bg-[var(--bg-tertiary)] text-[var(--text-primary)]"
                >
                  <div className={`w-2 h-2 rounded-full ${statusOption?.color}`} />
                  <span>{statusOption?.label}</span>
                  <X 
                    className="w-3 h-3 cursor-pointer hover:text-red-400" 
                    onClick={() => handleStatusFilter(status)}
                  />
                </Badge>
              );
            })}

            {filters.favorite !== null && (
              <Badge variant="secondary" className="flex items-center space-x-1">
                <Star className="w-3 h-3" />
                <span>{filters.favorite ? 'Favorites' : 'Non-favorites'}</span>
                <X 
                  className="w-3 h-3 cursor-pointer hover:text-red-400" 
                  onClick={() => onFiltersChange({ ...filters, favorite: null })}
                />
              </Badge>
            )}

            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-xs text-[var(--text-tertiary)] hover:text-red-400"
            >
              Clear all
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Expanded Filters Panel */}
      <AnimatePresence>
        {isFilterOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="bg-[var(--bg-secondary)] rounded-lg p-6 border border-[var(--border-color)]"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Status Filter */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Status</h3>
                <div className="space-y-2">
                  {statusOptions.map((option) => (
                    <label
                      key={option.value}
                      className="flex items-center space-x-3 cursor-pointer hover:bg-[var(--bg-hover)] p-2 rounded-md transition-colors"
                    >
                      <input
                        type="checkbox"
                        checked={filters.status.includes(option.value)}
                        onChange={() => handleStatusFilter(option.value)}
                        className="rounded border-[var(--border-color)] text-[var(--accent-primary)] focus:ring-[var(--accent-primary)]"
                      />
                      <div className={`w-3 h-3 rounded-full ${option.color}`} />
                      <span className="text-sm text-[var(--text-secondary)]">{option.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Rating Filter */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Rating</h3>
                <Select
                  value={filters.rating ? `${filters.rating.min}-${filters.rating.max}` : ''}
                  onValueChange={(value) => {
                    if (value === '') {
                      onFiltersChange({ ...filters, rating: null });
                    } else {
                      const [min, max] = value.split('-').map(Number);
                      onFiltersChange({ ...filters, rating: { min, max } });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select rating range" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All ratings</SelectItem>
                    <SelectItem value="9-10">9-10 (Excellent)</SelectItem>
                    <SelectItem value="7-8">7-8 (Good)</SelectItem>
                    <SelectItem value="5-6">5-6 (Average)</SelectItem>
                    <SelectItem value="1-4">1-4 (Poor)</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Favorites Filter */}
              <div>
                <h3 className="text-sm font-medium text-[var(--text-primary)] mb-3">Favorites</h3>
                <Select
                  value={filters.favorite === null ? '' : filters.favorite.toString()}
                  onValueChange={(value) => {
                    if (value === '') {
                      onFiltersChange({ ...filters, favorite: null });
                    } else {
                      onFiltersChange({ ...filters, favorite: value === 'true' });
                    }
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Filter by favorites" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">All anime</SelectItem>
                    <SelectItem value="true">Favorites only</SelectItem>
                    <SelectItem value="false">Non-favorites only</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
