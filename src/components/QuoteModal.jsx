
import React, { useState } from 'react';
import { X, DollarSign, Clock, FileText, Calculator } from 'lucide-react';
import { Button } from '@/components/ui/button';

const QuoteModal = ({ isOpen, onClose, request, onSubmit }) => {
  const [quoteData, setQuoteData] = useState({
    totalPrice: '',
    timeEstimate: '',
    validityPeriod: '7',
    description: '',
    itemizedPricing: [
      { item: '', quantity: 1, unitPrice: '', total: 0 }
    ],
    terms: '',
    includeItemized: false
  });

  if (!isOpen || !request) return null;

  const handleInputChange = (field, value) => {
    setQuoteData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleItemizedChange = (index, field, value) => {
    setQuoteData(prev => {
      const newItems = [...prev.itemizedPricing];
      newItems[index] = {
        ...newItems[index],
        [field]: value,
        total: field === 'quantity' || field === 'unitPrice' 
          ? (field === 'quantity' ? value : newItems[index].quantity) * 
            (field === 'unitPrice' ? value : newItems[index].unitPrice)
          : newItems[index].total
      };
      return {
        ...prev,
        itemizedPricing: newItems
      };
    });
  };

  const addItemizedRow = () => {
    setQuoteData(prev => ({
      ...prev,
      itemizedPricing: [
        ...prev.itemizedPricing,
        { item: '', quantity: 1, unitPrice: '', total: 0 }
      ]
    }));
  };

  const removeItemizedRow = (index) => {
    setQuoteData(prev => ({
      ...prev,
      itemizedPricing: prev.itemizedPricing.filter((_, i) => i !== index)
    }));
  };

  const calculateItemizedTotal = () => {
    return quoteData.itemizedPricing.reduce((sum, item) => sum + (item.total || 0), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const finalQuote = {
      ...quoteData,
      requestId: request.id,
      clientName: request.client,
      requestTitle: request.title,
      submittedAt: new Date().toISOString(),
      status: 'pending'
    };

    onSubmit(finalQuote);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl border border-white/20 w-full max-w-4xl max-h-[90vh] overflow-hidden mx-4">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/20">
          <div>
            <h2 className="text-2xl font-semibold text-white">Submit Quote</h2>
            <p className="text-gray-300 mt-1">For: {request?.title}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Request Summary */}
            <div className="backdrop-blur-md bg-white/5 rounded-lg p-4 border border-white/10">
              <h3 className="text-lg font-medium text-white mb-3">Request Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-400">Client:</span>
                  <p className="text-white">{request.client}</p>
                </div>
                <div>
                  <span className="text-gray-400">Location:</span>
                  <p className="text-white">{request.location}</p>
                </div>
                <div>
                  <span className="text-gray-400">Budget Range:</span>
                  <p className="text-white">${request.budget.min} - ${request.budget.max}</p>
                </div>
                <div>
                  <span className="text-gray-400">Preferred Date:</span>
                  <p className="text-white">{new Date(request.preferredDate).toLocaleDateString()}</p>
                </div>
              </div>
              <div className="mt-3">
                <span className="text-gray-400">Description:</span>
                <p className="text-white">{request.description}</p>
              </div>
            </div>

            {/* Quote Type Selection */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-white">Quote Type</h3>
              <div className="flex gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="quoteType"
                    checked={!quoteData.includeItemized}
                    onChange={() => handleInputChange('includeItemized', false)}
                    className="text-blue-500"
                  />
                  <span className="text-white">Simple Quote</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="quoteType"
                    checked={quoteData.includeItemized}
                    onChange={() => handleInputChange('includeItemized', true)}
                    className="text-blue-500"
                  />
                  <span className="text-white">Itemized Quote</span>
                </label>
              </div>
            </div>

            {/* Simple Quote */}
            {!quoteData.includeItemized && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <DollarSign className="w-4 h-4 inline mr-1" />
                      Total Price ($)
                    </label>
                    <input
                      type="number"
                      value={quoteData.totalPrice}
                      onChange={(e) => handleInputChange('totalPrice', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="Enter total price"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-gray-300 mb-2">
                      <Clock className="w-4 h-4 inline mr-1" />
                      Time Estimate
                    </label>
                    <input
                      type="text"
                      value={quoteData.timeEstimate}
                      onChange={(e) => handleInputChange('timeEstimate', e.target.value)}
                      className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      placeholder="e.g., 2-3 hours, 1 day"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Itemized Quote */}
            {quoteData.includeItemized && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-lg font-medium text-white">
                    <Calculator className="w-5 h-5 inline mr-2" />
                    Itemized Pricing
                  </h4>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={addItemizedRow}
                    className="bg-white/10 text-white border-white/30 hover:bg-white/20"
                  >
                    Add Item
                  </Button>
                </div>

                <div className="space-y-3">
                  {quoteData.itemizedPricing.map((item, index) => (
                    <div key={index} className="grid grid-cols-12 gap-2 items-end">
                      <div className="col-span-5">
                        <label className="block text-gray-400 text-sm mb-1">Item/Service</label>
                        <input
                          type="text"
                          value={item.item}
                          onChange={(e) => handleItemizedChange(index, 'item', e.target.value)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white placeholder-gray-400 text-sm"
                          placeholder="Description"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-gray-400 text-sm mb-1">Qty</label>
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) => handleItemizedChange(index, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-gray-400 text-sm mb-1">Unit Price</label>
                        <input
                          type="number"
                          value={item.unitPrice}
                          onChange={(e) => handleItemizedChange(index, 'unitPrice', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded text-white text-sm"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-gray-400 text-sm mb-1">Total</label>
                        <div className="px-3 py-2 bg-white/5 border border-white/10 rounded text-white text-sm">
                          ${item.total.toFixed(2)}
                        </div>
                      </div>
                      <div className="col-span-1">
                        {quoteData.itemizedPricing.length > 1 && (
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => removeItemizedRow(index)}
                            className="bg-red-500/20 text-red-300 border-red-500/30 hover:bg-red-500/30 w-full h-9"
                          >
                            ×
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex justify-between items-center pt-4 border-t border-white/20">
                  <span className="text-lg font-medium text-white">Total Amount:</span>
                  <span className="text-2xl font-bold text-blue-400">${calculateItemizedTotal().toFixed(2)}</span>
                </div>

                <div>
                  <label className="block text-gray-300 mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Time Estimate
                  </label>
                  <input
                    type="text"
                    value={quoteData.timeEstimate}
                    onChange={(e) => handleInputChange('timeEstimate', e.target.value)}
                    className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 2-3 hours, 1 day"
                    required
                  />
                </div>
              </div>
            )}

            {/* Quote Description */}
            <div>
              <label className="block text-gray-300 mb-2">
                <FileText className="w-4 h-4 inline mr-1" />
                Quote Description
              </label>
              <textarea
                value={quoteData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Provide details about your quote, what's included, materials, etc."
                required
              />
            </div>

            {/* Quote Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-2">Quote Valid For (days)</label>
                <select
                  value={quoteData.validityPeriod}
                  onChange={(e) => handleInputChange('validityPeriod', e.target.value)}
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="3">3 days</option>
                  <option value="7">7 days</option>
                  <option value="14">14 days</option>
                  <option value="30">30 days</option>
                </select>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <label className="block text-gray-300 mb-2">Terms & Conditions (Optional)</label>
              <textarea
                value={quoteData.terms}
                onChange={(e) => handleInputChange('terms', e.target.value)}
                rows={3}
                className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                placeholder="Any special terms, payment conditions, or additional notes..."
              />
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-white/20">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                className="flex-1 bg-white/10 text-white border-white/30 hover:bg-white/20"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white"
              >
                Submit Quote
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default QuoteModal;
