
import React, { useState } from 'react';
import { CreditCard, Landmark, Settings, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';

interface PayoutMethod {
  id: string;
  type: 'bank' | 'card';
  last4: string;
  isDefault: boolean;
  bankName?: string;
  cardBrand?: string;
}

interface PayoutSettingsProps {
  payoutMethods: PayoutMethod[];
  currentSchedule: 'weekly' | 'monthly';
  onAddPayoutMethod: () => void;
  onSetDefault: (methodId: string) => void;
  onChangeSchedule: (schedule: 'weekly' | 'monthly') => void;
  onRemoveMethod: (methodId: string) => void;
}

const PayoutSettings = ({
  payoutMethods,
  currentSchedule,
  onAddPayoutMethod,
  onSetDefault,
  onChangeSchedule,
  onRemoveMethod
}: PayoutSettingsProps) => {
  const [isEditingSchedule, setIsEditingSchedule] = useState(false);

  return (
    <Card className="glass-card">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <Settings className="w-5 h-5 mr-2" />
          Payout Settings
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Payout Schedule */}
        <div>
          <h3 className="text-white font-medium mb-3">Payout Schedule</h3>
          <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
            <div>
              <p className="text-white">{currentSchedule === 'weekly' ? 'Weekly' : 'Monthly'} Payouts</p>
              <p className="text-gray-400 text-sm">
                {currentSchedule === 'weekly' 
                  ? 'Receive payments every Friday' 
                  : 'Receive payments on the 1st of each month'
                }
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsEditingSchedule(!isEditingSchedule)}
              className="border-white/30 text-gray-300 hover:bg-white/10"
            >
              Change
            </Button>
          </div>
          
          {isEditingSchedule && (
            <div className="mt-3 space-y-2">
              <Button
                variant={currentSchedule === 'weekly' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  onChangeSchedule('weekly');
                  setIsEditingSchedule(false);
                }}
              >
                Weekly - Every Friday
              </Button>
              <Button
                variant={currentSchedule === 'monthly' ? 'default' : 'ghost'}
                className="w-full justify-start"
                onClick={() => {
                  onChangeSchedule('monthly');
                  setIsEditingSchedule(false);
                }}
              >
                Monthly - 1st of each month
              </Button>
            </div>
          )}
        </div>

        <Separator className="bg-white/20" />

        {/* Payout Methods */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">Payout Methods</h3>
            <Button
              onClick={onAddPayoutMethod}
              className="bg-blue-500 hover:bg-blue-600 text-white"
              size="sm"
            >
              Add Method
            </Button>
          </div>
          
          <div className="space-y-3">
            {payoutMethods.map((method) => (
              <div key={method.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                <div className="flex items-center space-x-3">
                  {method.type === 'bank' ? (
                    <Landmark className="w-5 h-5 text-blue-400" />
                  ) : (
                    <CreditCard className="w-5 h-5 text-green-400" />
                  )}
                  <div>
                    <p className="text-white">
                      {method.type === 'bank' 
                        ? `${method.bankName} ••••${method.last4}`
                        : `${method.cardBrand} ••••${method.last4}`
                      }
                    </p>
                    {method.isDefault && (
                      <Badge className="bg-green-500 text-white text-xs mt-1">
                        Default
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  {!method.isDefault && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onSetDefault(method.id)}
                      className="text-blue-400 hover:text-blue-300"
                    >
                      Set Default
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onRemoveMethod(method.id)}
                    className="text-red-400 hover:text-red-300"
                  >
                    Remove
                  </Button>
                </div>
              </div>
            ))}
          </div>
          
          {payoutMethods.length === 0 && (
            <div className="text-center py-8 text-gray-400">
              <CreditCard className="w-12 h-12 mx-auto mb-4 text-gray-500" />
              <p>No payout methods configured</p>
              <p className="text-sm">Add a bank account or card to receive payments</p>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="flex items-start space-x-3 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
          <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />
          <div className="text-sm">
            <p className="text-blue-300 font-medium">Payout Information</p>
            <p className="text-blue-200 mt-1">
              Payouts are processed automatically based on your schedule. 
              Bank transfers typically take 1-3 business days to complete.
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PayoutSettings;
