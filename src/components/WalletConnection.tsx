import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { WalletButton } from '@/components/ui/wallet-button';
import { useToast } from '@/hooks/use-toast';
import { Wallet, ExternalLink } from 'lucide-react';

interface WalletConnectionProps {
  onAccountChange: (account: string | null) => void;
}

export function WalletConnection({ onAccountChange }: WalletConnectionProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    checkConnection();
    
    if (window.ethereum) {
      window.ethereum.on('accountsChanged', handleAccountsChanged);
      window.ethereum.on('chainChanged', () => window.location.reload());
    }

    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);

  const checkConnection = async () => {
    if (window.ethereum) {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        if (accounts.length > 0) {
          setAccount(accounts[0]);
          onAccountChange(accounts[0]);
        }
      } catch (error) {
        console.error('Error checking connection:', error);
      }
    }
  };

  const handleAccountsChanged = (accounts: string[]) => {
    if (accounts.length === 0) {
      setAccount(null);
      onAccountChange(null);
      toast({
        title: "Wallet Disconnected",
        description: "Your wallet has been disconnected.",
      });
    } else {
      setAccount(accounts[0]);
      onAccountChange(accounts[0]);
    }
  };

  const connectWallet = async () => {
    if (!window.ethereum) {
      toast({
        title: "MetaMask Not Found",
        description: "Please install MetaMask to use this dApp.",
        variant: "destructive",
      });
      return;
    }

    setIsConnecting(true);
    
    try {
      const accounts = await window.ethereum.request({
        method: 'eth_requestAccounts',
      });
      
      setAccount(accounts[0]);
      onAccountChange(accounts[0]);
      
      toast({
        title: "Wallet Connected",
        description: `Connected to ${accounts[0].slice(0, 6)}...${accounts[0].slice(-4)}`,
      });
    } catch (error: any) {
      console.error('Error connecting wallet:', error);
      toast({
        title: "Connection Failed",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
    } finally {
      setIsConnecting(false);
    }
  };

  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  if (account) {
    return (
      <div className="flex items-center gap-3 bg-gradient-card p-3 rounded-lg shadow-warm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-success rounded-full"></div>
          <span className="text-sm text-muted-foreground">Connected</span>
        </div>
        <div className="flex items-center gap-2 bg-background px-3 py-2 rounded-md">
          <Wallet className="w-4 h-4 text-primary" />
          <span className="font-mono text-sm">{formatAddress(account)}</span>
        </div>
        <WalletButton
          variant="outline"
          size="sm"
          onClick={() => window.open(`https://sepolia.etherscan.io/address/${account}`, '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
        </WalletButton>
      </div>
    );
  }

  return (
    <WalletButton
      variant="connect"
      onClick={connectWallet}
      disabled={isConnecting}
      className="min-w-[160px]"
    >
      <Wallet className="w-4 h-4 mr-2" />
      {isConnecting ? 'Connecting...' : 'Connect Wallet'}
    </WalletButton>
  );
}