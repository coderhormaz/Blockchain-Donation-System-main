import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { WalletButton } from '@/components/ui/wallet-button';
import { useToast } from '@/hooks/use-toast';
import { Heart, Send } from 'lucide-react';

interface DonationFormProps {
  account: string | null;
  onDonate: (amount: string, cause: string) => void;
  isLoading: boolean;
}

export function DonationForm({ account, onDonate, isLoading }: DonationFormProps) {
  const [amount, setAmount] = useState('');
  const [cause, setCause] = useState('');
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a donation.",
        variant: "destructive",
      });
      return;
    }

    if (!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a positive donation amount.",
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

    onDonate(amount, cause.trim());
    setAmount('');
    setCause('');
  };

  return (
    <Card className="bg-gradient-card shadow-warm border-border/50">
      <CardHeader>
        <CardTitle className="text-xl">
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
              placeholder="0.00001"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              disabled={!account || isLoading}
              className="bg-background border-border/50 focus:border-primary"
            />
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
            {isLoading ? 'Processing...' : 'Donate Now'}
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