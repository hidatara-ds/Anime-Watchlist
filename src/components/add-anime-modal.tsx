'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Search, 
  Star, 
  Save, 
  Loader2,
  Film,
  Calendar,
  Hash,
  FileText,
  Heart
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface AddAnimeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (anime: AnimeFormData) => Promise<void>;
}

interface AnimeFormData {
  title: string;
  episodes: number;
  status: 'PLAN' | 'WATCHING' | 'COMPLETED' | 'ON_HOLD' | 'DROPPED';
  rating: number;
  notes?: string;
  favorite: boolean;
  coverFile?: File | null;
}

const statusOptions = [
  { value: 'PLAN', label: 'Plan to Watch', color: 'from-blue-500 to-blue-600' },
  { value: 'WATCHING', label: 'Currently Watching', color: 'from-green-500 to-green-600' },
  { value: 'COMPLETED', label: 'Completed', color: 'from-purple-500 to-purple-600' },
  { value: 'ON_HOLD', label: 'On Hold', color: 'from-yellow-500 to-yellow-600' },
  { value: 'DROPPED', label: 'Dropped', color: 'from-red-500 to-red-600' },
];

export function AddAnimeModal({ isOpen, onClose, onAdd }: AddAnimeModalProps) {
  const [formData, setFormData] = useState<AnimeFormData>({
    title: '',
    episodes: 0,
    status: 'PLAN',
    rating: 0,
    notes: '',
    favorite: false,
    coverUrl: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [imagePreview, setImagePreview] = useState<string>('');

  const handleImageSelect = async (file: File | null) => {
    if (!file) return;
    // Guard: limit ~1.5MB to keep JSON body small
    const MAX_BYTES = 1.5 * 1024 * 1024;
    if (file.size > MAX_BYTES) {
      alert('Image too large. Please choose an image under 1.5 MB.');
      return;
    }
    try {
      const objectUrl = URL.createObjectURL(file);
      setFormData(prev => ({ ...prev, coverFile: file }));
      setImagePreview(objectUrl);
    } catch (err) {
      console.error('Failed to load image:', err);
      alert('Failed to load image. Please try a different file.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.title.trim()) {
      alert('Please enter an anime title');
      return;
    }

    setIsLoading(true);
    try {
      await onAdd(formData);
      onClose();
      // Reset form
      setFormData({
        title: '',
        episodes: 0,
        status: 'PLAN',
        rating: 0,
        notes: '',
        favorite: false,
        coverUrl: ''
      });
    } catch (error) {
      console.error('Error adding anime:', error);
      alert('Failed to add anime. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRatingClick = (rating: number) => {
    setFormData(prev => ({ ...prev, rating }));
  };

  const searchAnime = async (query: string) => {
    if (!query.trim()) return;
    
    setIsSearching(true);
    try {
      // In a real app, you would search an anime database API like MyAnimeList or AniList
      // For now, we'll just use the search query as the title
      setFormData(prev => ({ 
        ...prev, 
        title: query,
        // You could set default episodes, cover URL etc. from API here
      }));
      // Do not overwrite selected cover image
    } catch (error) {
      console.error('Error searching anime:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const popularSuggestions = [
    'Attack on Titan',
    'Demon Slayer',
    'One Piece',
    'Naruto',
    'My Hero Academia',
    'Jujutsu Kaisen',
    'Death Note',
    'Fullmetal Alchemist: Brotherhood'
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: 'spring', duration: 0.5 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <Card className="w-full max-w-2xl max-h-[90vh] overflow-auto glass border border-[var(--accent-primary)]/20">
              <CardHeader className="bg-gradient-to-r from-[var(--accent-primary)]/10 to-[var(--accent-secondary)]/10 border-b border-[var(--border-color)]">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-2xl font-[var(--font-heading)] text-[var(--text-primary)] flex items-center">
                    <Film className="w-6 h-6 mr-3 text-[var(--accent-primary)]" />
                    Add New Anime
                  </CardTitle>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={onClose}
                    className="h-8 w-8 p-0 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>

              <CardContent className="p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Search Section */}
                  <div className="space-y-4">
                    <Label className="text-sm font-medium text-[var(--text-primary)] flex items-center">
                      <Search className="w-4 h-4 mr-2" />
                      Search Anime (Optional)
                    </Label>
                    <div className="flex space-x-2">
                      <Input
                        placeholder="Search for anime..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="flex-1 bg-[var(--bg-tertiary)] border-[var(--border-color)]"
                      />
                      <Button
                        type="button"
                        onClick={() => searchAnime(searchQuery)}
                        disabled={isSearching}
                        className="btn-gradient"
                      >
                        {isSearching ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Search className="w-4 h-4" />
                        )}
                      </Button>
                    </div>
                    
                    {/* Quick suggestions */}
                    <div className="flex flex-wrap gap-2">
                      <span className="text-xs text-[var(--text-tertiary)]">Quick add:</span>
                      {popularSuggestions.slice(0, 4).map((suggestion) => (
                        <Button
                          key={suggestion}
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setFormData(prev => ({ ...prev, title: suggestion }))}
                          className="text-xs h-6 px-2 border-[var(--border-color)] hover:border-[var(--accent-primary)]"
                        >
                          {suggestion}
                        </Button>
                      ))}
                    </div>
                  </div>

                  {/* Basic Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="title" className="text-sm font-medium text-[var(--text-primary)] flex items-center">
                        <Film className="w-4 h-4 mr-2" />
                        Anime Title *
                      </Label>
                      <Input
                        id="title"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                        placeholder="Enter anime title"
                        required
                        className="bg-[var(--bg-tertiary)] border-[var(--border-color)] focus:border-[var(--accent-primary)]"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="episodes" className="text-sm font-medium text-[var(--text-primary)] flex items-center">
                        <Hash className="w-4 h-4 mr-2" />
                        Episodes
                      </Label>
                      <Input
                        id="episodes"
                        type="number"
                        min="0"
                        value={formData.episodes}
                        onChange={(e) => setFormData(prev => ({ ...prev, episodes: parseInt(e.target.value) || 0 }))}
                        placeholder="Number of episodes"
                        className="bg-[var(--bg-tertiary)] border-[var(--border-color)] focus:border-[var(--accent-primary)]"
                      />
                    </div>
                  </div>

                  {/* Status and Rating */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[var(--text-primary)] flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        Status
                      </Label>
                      <Select 
                        value={formData.status} 
                        onValueChange={(value: any) => setFormData(prev => ({ ...prev, status: value }))}
                      >
                        <SelectTrigger className="bg-[var(--bg-tertiary)] border-[var(--border-color)]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {statusOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              <div className="flex items-center space-x-2">
                                <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${option.color}`} />
                                <span>{option.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label className="text-sm font-medium text-[var(--text-primary)] flex items-center">
                        <Star className="w-4 h-4 mr-2" />
                        Rating (0-10)
                      </Label>
                      <div className="flex items-center space-x-1">
                        {Array.from({ length: 10 }, (_, i) => i + 1).map((star) => (
                          <button
                            key={star}
                            type="button"
                            onClick={() => handleRatingClick(star)}
                            className="transition-colors duration-200 hover:scale-110"
                          >
                            <Star
                              className={`w-5 h-5 ${
                                star <= formData.rating
                                  ? 'fill-yellow-400 text-yellow-400'
                                  : 'text-[var(--text-tertiary)] hover:text-yellow-400'
                              }`}
                            />
                          </button>
                        ))}
                        <span className="ml-2 text-sm text-[var(--text-secondary)]">
                          {formData.rating}/10
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cover URL */}
                  <div className="space-y-2">
                    <Label htmlFor="coverFile" className="text-sm font-medium text-[var(--text-primary)]">
                      Cover Image (Upload from device)
                    </Label>
                    <Input
                      id="coverFile"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleImageSelect(e.target.files?.[0] || null)}
                      className="bg-[var(--bg-tertiary)] border-[var(--border-color)] focus:border-[var(--accent-primary)] file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:bg-[var(--bg-secondary)] file:text-[var(--text-secondary)] hover:file:bg-[var(--bg-hover)]"
                    />
                    {imagePreview && (
                      <div className="mt-2 flex items-center space-x-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={imagePreview} alt="Cover preview" className="h-20 w-14 object-cover rounded-md border border-[var(--border-color)]" />
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => { setFormData(prev => ({ ...prev, coverFile: null })); setImagePreview(''); }}
                          className="border-[var(--border-color)]"
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  <div className="space-y-2">
                    <Label htmlFor="notes" className="text-sm font-medium text-[var(--text-primary)] flex items-center">
                      <FileText className="w-4 h-4 mr-2" />
                      Notes (Optional)
                    </Label>
                    <Textarea
                      id="notes"
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                      placeholder="Add your thoughts, reviews, or any notes about this anime..."
                      rows={3}
                      className="bg-[var(--bg-tertiary)] border-[var(--border-color)] focus:border-[var(--accent-primary)] resize-none"
                    />
                  </div>

                  {/* Favorite */}
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="favorite"
                      checked={formData.favorite}
                      onCheckedChange={(checked) => setFormData(prev => ({ ...prev, favorite: checked as boolean }))}
                      className="border-[var(--border-color)]"
                    />
                    <Label htmlFor="favorite" className="text-sm text-[var(--text-primary)] flex items-center cursor-pointer">
                      <Heart className="w-4 h-4 mr-2 text-red-500" />
                      Add to favorites
                    </Label>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex justify-end space-x-3 pt-4 border-t border-[var(--border-color)]">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={onClose}
                      className="border-[var(--border-color)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isLoading || !formData.title.trim()}
                      className="btn-gradient min-w-[120px]"
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          Adding...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4 mr-2" />
                          Add Anime
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
