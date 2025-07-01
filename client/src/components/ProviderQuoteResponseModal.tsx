
import React, { useState } from 'react';
import { X, DollarSign, Clock, FileText, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QuoteRequest {
  id: number;
  serviceTitle: string;
  customerName: string;
  description: string;
}

interface PriceItem {
  id: string;
  item: string;
  price: number;
}

interface ProviderQuoteResponseModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteRequest: QuoteRequest;
  onSubmit: (response: any) => void;
}

const ProviderQuoteResponseModal = ({ 
  isOpen, 
  onClose, 
  quoteRequest, 
  onSubmit 
}: ProviderQuoteResponseModalProps) => {
  const [description, setDescription] = useState('');
  const [estimatedDuration, setEstimatedDuration] = useState('');
  const [validUntil, setValidUntil] = useState('');
  const [notes, setNotes] = useState('');
  const [priceItems, setPriceItems] = useState<PriceItem[]>([
    { id: '1', item: '', price: 0 }
  ]);

  if (!isOpen) return null;

  const addPriceItem = () => {
    setPriceItems([...priceItems, { 
      id: Date.now().toString(), 
      item: '', 
      price: 0 
    }]);
  };

  const removePriceItem = (id: string) => {
    setPriceItems(priceItems.filter(item => item.id !== id));
  };

  const updatePriceItem = (id: string, field: 'item' | 'price', value: string | number) => {
    setPriceItems(priceItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const totalPrice = priceItems.reduce((sum, item) => sum + item.price, 0);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const response = {
      description,
      estimatedDuration,
      validUntil,
      notes,
      breakdown: priceItems.filter(item => item.item && item.price > 0),
      totalPrice
    };
    
    onSubmit(response);
    
    // Reset form
    setDescription('');
    setEstimatedDuration('');
    setValidUntil('');
    setNotes('');
    setPriceItems([{ id: '1', item: '', price: 0 }]);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <Card className="glass-card text-white border-white/20">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
            <CardTitle className="text-xl">Send Quote Response</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={onClose}
              className="text-white hover:bg-white/20"
            >
              <X className="w-4 h-4" />
            </Button>
          </CardHeader>
          
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Info */}
              <div className="bg-white/10 rounded-lg p-4">
                <h3 className="font-semibold text-lg mb-1">{quoteRequest.serviceTitle}</h3>
                <p className="text-gray-300 text-sm">For: {quoteRequest.customerName}</p>
              </div>

              {/* Service Description */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <FileText className="w-4 h-4 inline mr-1" />
                  Service Description
                </label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Describe what you'll do and how you'll approach this job..."
                  className="w-full h-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              {/* Price Breakdown */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  <DollarSign className="w-4 h-4 inline mr-1" />
                  Price Breakdown
                </label>
                <div className="space-y-2">
                  {priceItems.map((item, index) => (
                    <div key={item.id} className="flex space-x-2">
                      <input
                        type="text"
                        placeholder="Service item..."
                        value={item.item}
                        onChange={(e) => updatePriceItem(item.id, 'item', e.target.value)}
                        className="flex-1 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <input
                        type="number"
                        placeholder="Price"
                        value={item.price || ''}
                        onChange={(e) => updatePriceItem(item.id, 'price', Number(e.target.value))}
                        className="w-24 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      {priceItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removePriceItem(item.id)}
                          className="text-red-400 hover:bg-red-500/20"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={addPriceItem}
                    className="text-blue-400 hover:bg-blue-500/20"
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Item
                  </Button>
                </div>
                <div className="mt-3 p-3 bg-white/10 rounded-lg">
                  <div className="flex justify-between items-center font-semibold">
                    <span>Total:</span>
                    <span className="text-green-400">${totalPrice}</span>
                  </div>
                </div>
              </div>

              {/* Duration and Validity */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Estimated Duration
                  </label>
                  <input
                    type="text"
                    value={estimatedDuration}
                    onChange={(e) => setEstimatedDuration(e.target.value)}
                    placeholder="e.g., 2-3 hours"
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Valid Until</label>
                  <input
                    type="date"
                    value={validUntil}
                    onChange={(e) => setValidUntil(e.target.value)}
                    className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <label className="block text-sm font-medium mb-2">Additional Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Any additional information or terms..."
                  className="w-full h-20 px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={onClose}
                  className="flex-1 text-white hover:bg-white/20"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  className="flex-1 bg-blue-500 hover:bg-blue-600 text-white"
                >
                  Send Quote
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProviderQuoteResponseModal;
