import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WalletButton } from '@/components/ui/wallet-button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Loader2 } from 'lucide-react';

interface DonationFormProps {
  account: string | null;
  onDonate: (amount: string, cause: string) => Promise<void>;
  isLoading: boolean;
}

const PRESET_AMOUNTS = ['0.001', '0.005', '0.01', '0.05', '0.1'];

export function DonationForm({ account, onDonate, isLoading }: DonationFormProps) {
  const [amount, setAmount] = useState('');
  const [cause, setCause] = useState('');
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a donation.",
        variant: "destructive",
      });
      return;
    }

    const parsedAmount = parseFloat(amount);

    if (!amount || isNaN(parsedAmount) || parsedAmount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive donation amount.",
        variant: "destructive",
      });
      return;
    }

    if (parsedAmount > 100) {
      toast({
        title: "Amount Too Large",
        description: "Maximum donation is 100 ETH per transaction for safety.",
        variant: "destructive",
      });
      return;
    }

    if (!cause.trim()) {
      toast({
        title: "Missing Cause",
        description: "Please describe the cause you're donating to.",
        variant: "destructive",
      });
      return;
    }

    if (cause.length > 200) {
      toast({
        title: "Cause Too Long",
        description: "Please keep the cause description under 200 characters.",
        variant: "destructive",
      });
      return;
    }

    await onDonate(amount, cause.trim());
    setAmount('');
    setCause('');
  };

  return (
    <Card className="bg-gradient-card shadow-warm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          <Heart className="w-5 h-5 text-primary" />
          Make a Donation
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Amount (ETH)</Label>
            <Input
              id="amount"
              type="number"
              step="any"
              min="0"
              max="100"
              placeholder="0.001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!account || isLoading}
              className="bg-background border-border/50 focus:border-primary"
            />
            <div className="flex flex-wrap gap-2">
              {PRESET_AMOUNTS.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  onClick={() => setAmount(preset)}
                  disabled={!account || isLoading}
                  className="px-3 py-1 text-xs rounded-full border border-border/50 bg-background hover:bg-secondary hover:border-primary/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {preset} ETH
                </button>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="cause">Cause Description</Label>
            <Textarea
              id="cause"
              placeholder="Describe the cause you're supporting..."
              value={cause}
              onChange={(e) => setCause(e.target.value)}
              disabled={!account || isLoading}
              maxLength={200}
              className="bg-background border-border/50 focus:border-primary min-h-[100px]"
            />
            <div className="text-sm text-muted-foreground text-right">
              {cause.length}/200 characters
            </div>
          </div>

          <WalletButton
            type="submit"
            variant="default"
            disabled={!account || isLoading || !amount || !cause.trim()}
            className="w-full"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processing Transaction...
              </>
            ) : (
              <>
                <Heart className="w-4 h-4 mr-2" />
                Donate Now
              </>
            )}
          </WalletButton>

          {!account && (
            <p className="text-sm text-muted-foreground text-center">
              Connect your wallet to start making donations
            </p>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
