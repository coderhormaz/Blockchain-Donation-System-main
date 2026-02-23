import { useState, useMemo } from 'react';
import { WalletConnection } from '@/components/WalletConnection';
import { DonationForm } from '@/components/DonationForm';
import { DonationList } from '@/components/DonationList';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useDonations } from '@/hooks/useDonations';
import { Shield, Zap, Globe, TrendingUp, Users, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const Index = () => {
  const [account, setAccount] = useState<string | null>(null);
  const { donations, makeDonation, isLoading } = useDonations(account);

  const stats = useMemo(() => {
    const totalDonations = donations.reduce(
      (sum, d) => sum + parseFloat(d.amount),
      0
    );
    const uniqueDonors = new Set(donations.map((d) => d.donor.toLowerCase())).size;
    const avgDonation = donations.length > 0 ? totalDonations / donations.length : 0;

    return { totalDonations, uniqueDonors, avgDonation, count: donations.length };
  }, [donations]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-accent/10 flex flex-col">
      <header className="bg-gradient-card shadow-warm border-b border-border/50 sticky top-0 z-50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4 sm:py-6">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <Shield className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="hidden sm:block">
                <h1 className="text-2xl font-bold text-foreground">DonationTracker</h1>
                <p className="text-sm text-muted-foreground">Transparent Blockchain Philanthropy</p>
              </div>
              <h1 className="sm:hidden text-lg font-bold text-foreground">DonationTracker</h1>
            </div>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <WalletConnection onAccountChange={setAccount} />
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 flex-1">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold bg-gradient-hero bg-clip-text text-transparent mb-4">
            Revolutionizing Charitable Giving
          </h2>
          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto mb-8">
            Track every donation on the blockchain. Experience complete transparency and build trust in philanthropy.
          </p>

          <div className="grid sm:grid-cols-3 gap-4 sm:gap-6 max-w-4xl mx-auto">
            <div className="bg-gradient-card p-6 rounded-lg shadow-warm border border-border/50 hover:scale-[1.02] transition-transform">
              <Shield className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Transparent</h3>
              <p className="text-sm text-muted-foreground">Every donation is recorded immutably on the blockchain</p>
            </div>
            <div className="bg-gradient-card p-6 rounded-lg shadow-warm border border-border/50 hover:scale-[1.02] transition-transform">
              <Zap className="w-8 h-8 text-accent mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Instant</h3>
              <p className="text-sm text-muted-foreground">Donations are processed immediately on the Base network</p>
            </div>
            <div className="bg-gradient-card p-6 rounded-lg shadow-warm border border-border/50 hover:scale-[1.02] transition-transform">
              <Globe className="w-8 h-8 text-success mx-auto mb-3" />
              <h3 className="font-semibold mb-2">Global</h3>
              <p className="text-sm text-muted-foreground">Support causes worldwide with borderless transactions</p>
            </div>
          </div>
        </div>

        {/* Statistics */}
        {donations.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <Card className="bg-gradient-card shadow-warm border-border/50">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-6 h-6 text-primary mx-auto mb-2" />
                <p className="text-2xl font-bold text-primary">{stats.totalDonations.toFixed(4)}</p>
                <p className="text-xs text-muted-foreground">Total ETH Raised</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-warm border-border/50">
              <CardContent className="pt-6 text-center">
                <Heart className="w-6 h-6 text-destructive mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.count}</p>
                <p className="text-xs text-muted-foreground">Total Donations</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-warm border-border/50">
              <CardContent className="pt-6 text-center">
                <Users className="w-6 h-6 text-accent mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.uniqueDonors}</p>
                <p className="text-xs text-muted-foreground">Unique Donors</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-card shadow-warm border-border/50">
              <CardContent className="pt-6 text-center">
                <TrendingUp className="w-6 h-6 text-success mx-auto mb-2" />
                <p className="text-2xl font-bold text-foreground">{stats.avgDonation.toFixed(6)}</p>
                <p className="text-xs text-muted-foreground">Avg ETH / Donation</p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-8">
          <DonationForm
            account={account}
            onDonate={makeDonation}
            isLoading={isLoading}
          />
          <DonationList donations={donations} />
        </div>

        {/* How It Works Section */}
        <div className="mt-12 bg-gradient-card p-8 rounded-lg shadow-warm border border-border/50">
          <h3 className="text-2xl font-bold mb-6 text-center">How It Works</h3>
          <div className="grid sm:grid-cols-3 gap-6 text-center">
            <div>
              <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                1
              </div>
              <h4 className="font-semibold mb-2">Connect Wallet</h4>
              <p className="text-sm text-muted-foreground">Connect your MetaMask wallet to Base Mainnet</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-accent text-accent-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                2
              </div>
              <h4 className="font-semibold mb-2">Make Donation</h4>
              <p className="text-sm text-muted-foreground">Enter amount and cause description to create your donation</p>
            </div>
            <div>
              <div className="w-12 h-12 bg-success text-success-foreground rounded-full flex items-center justify-center mx-auto mb-3 text-xl font-bold">
                3
              </div>
              <h4 className="font-semibold mb-2">View Impact</h4>
              <p className="text-sm text-muted-foreground">Track your donation and see the transparent public ledger</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-gradient-card border-t border-border/50 mt-auto">
        <div className="container mx-auto px-4 py-8 text-center">
          <p className="text-muted-foreground">
            Built on Base Mainnet &bull; Secured by Blockchain &bull; Powered by Transparency
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            This application uses Base Mainnet. Please use real funds responsibly.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
