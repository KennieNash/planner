
import React from 'react';
import { ArrowUpDown, TrendingUp, TrendingDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface SortOptionsProps {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
  onSortChange: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
}

const SortOptions = ({ sortBy, sortOrder, onSortChange }: SortOptionsProps) => {
  const sortOptions = [
    { value: 'rating', label: 'Rating', canReverse: true },
    { value: 'price', label: 'Price', canReverse: true },
    { value: 'distance', label: 'Distance', canReverse: true },
    { value: 'reviews', label: 'Number of reviews', canReverse: true },
    { value: 'response-time', label: 'Response time', canReverse: false },
    { value: 'newest', label: 'Newest first', canReverse: false },
    { value: 'relevance', label: 'Most relevant', canReverse: false }
  ];

  const currentOption = sortOptions.find(option => option.value === sortBy);

  const handleSortChange = (newSortBy: string) => {
    const option = sortOptions.find(opt => opt.value === newSortBy);
    const defaultOrder = newSortBy === 'price' || newSortBy === 'distance' ? 'asc' : 'desc';
    onSortChange(newSortBy, defaultOrder);
  };

  const toggleSortOrder = () => {
    if (currentOption?.canReverse) {
      onSortChange(sortBy, sortOrder === 'asc' ? 'desc' : 'asc');
    }
  };

  const getSortLabel = () => {
    if (!currentOption) return 'Sort by';
    
    if (!currentOption.canReverse) return currentOption.label;
    
    const orderText = sortOrder === 'asc' ? 'Low to High' : 'High to Low';
    
    if (sortBy === 'price') {
      return `Price: ${orderText}`;
    } else if (sortBy === 'distance') {
      return `Distance: ${sortOrder === 'asc' ? 'Nearest' : 'Farthest'}`;
    } else {
      return `${currentOption.label}: ${orderText}`;
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Select value={sortBy} onValueChange={handleSortChange}>
        <SelectTrigger className="w-48 bg-white/10 border-white/20 text-white">
          <SelectValue placeholder="Sort by..." />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {currentOption?.canReverse && (
        <Button
          variant="outline"
          size="sm"
          onClick={toggleSortOrder}
          className="border-white/30 text-white hover:bg-white/10 px-3"
          title={`Sort ${sortOrder === 'asc' ? 'descending' : 'ascending'}`}
        >
          {sortOrder === 'asc' ? (
            <TrendingUp className="w-4 h-4" />
          ) : (
            <TrendingDown className="w-4 h-4" />
          )}
        </Button>
      )}
      
      <span className="text-sm text-gray-300 hidden sm:block">
        {getSortLabel()}
      </span>
    </div>
  );
};

export default SortOptions;
