import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExternalLink, Calendar, User, Heart } from 'lucide-react';

export interface Donation {
  id: number;
  amount: string;
  donor: string;
  cause: string;
  timestamp: number;
  txHash?: string;
}

interface DonationListProps {
  donations: Donation[];
}

export function DonationList({ donations }: DonationListProps) {
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const totalDonations = donations.reduce((sum, donation) => sum + parseFloat(donation.amount), 0);

  // Use Base Mainnet explorer for transaction links
  const explorerUrl = 'https://basescan.org/tx/';

  const lastDonation = donations.length > 0 ? donations[0] : null;

  return (
    <Card className="bg-gradient-card shadow-warm border-border/50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">
            Donation Ledger
          </CardTitle>
          <div className="text-right">
            <div className="text-2xl font-bold text-primary">
              {totalDonations.toFixed(4)} ETH
            </div>
            <div className="text-sm text-muted-foreground">
              Total Raised
            </div>
          </div>
        </div>
        {donations.length > 0 && (
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <span>{donations.length} donations</span>
            <Badge variant="secondary">
              Transparent & Immutable
            </Badge>
          </div>
        )}
        {/* Show last donor info */}
        {lastDonation && (
          <div className="mt-4 p-3 rounded-lg bg-background/60 border border-border/30 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
            <div className="flex items-center gap-2 text-sm">
              <span className="font-mono">{formatAddress(lastDonation.donor)}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <span className="font-semibold text-primary">{lastDonation.amount} ETH</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span>{formatDate(lastDonation.timestamp)}</span>
            </div>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {donations.length === 0 ? (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold mb-2">No donations yet</h3>
            <p className="text-muted-foreground">
              Be the first to make a donation and help make a difference!
            </p>
          </div>
        ) : (
          <ScrollArea className="h-[400px]">
            <div className="space-y-4">
              {donations.map((donation) => (
                <div
                  key={donation.id}
                  className="bg-background/80 p-4 rounded-lg border border-border/30 hover:border-primary/30 transition-colors"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="font-mono">
                        #{donation.id}
                      </Badge>
                      <span className="text-lg font-semibold text-primary">
                        {donation.amount} ETH
                      </span>
                    </div>
                    {donation.txHash && (
                      <button
                        onClick={() => window.open(`${explorerUrl}${donation.txHash}`, '_blank')}
                        className="text-muted-foreground hover:text-accent transition-colors"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono">{formatAddress(donation.donor)}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <span>{formatDate(donation.timestamp)}</span>
                    </div>
                    
                    <div className="mt-2">
                      <p className="text-sm leading-relaxed">{donation.cause}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
      </CardContent>
    </Card>
  );