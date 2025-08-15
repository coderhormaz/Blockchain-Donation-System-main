import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';
import type { Donation } from '@/components/DonationList';

// Base Mainnet configuration
const BASE_MAINNET_CONFIG = {
  chainId: 8453, // Base Mainnet
  chainIdHex: '0x2105',
  chainName: 'Base Mainnet',
  rpcUrl: 'https://mainnet.base.org',
  blockExplorer: 'https://basescan.org',
  contractAddress: "0x4c675ebfbf0be454d0632a28e167f78b9f775d90" // User's donation address
};

export function useDonations(account: string | null) {
  const [donations, setDonations] = useState<Donation[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  // Load existing donations from localStorage on mount (mock data persistence)
  useEffect(() => {
    const savedDonations = localStorage.getItem('donation-tracker-donations');
    if (savedDonations) {
      setDonations(JSON.parse(savedDonations));
    }
  }, []);

  // Save donations to localStorage whenever donations change
  useEffect(() => {
    localStorage.setItem('donation-tracker-donations', JSON.stringify(donations));
  }, [donations]);

  const makeDonation = async (amount: string, cause: string) => {
    if (!account) {
      toast({
        title: "Wallet Not Connected",
        description: "Please connect your wallet to make a donation.",
        variant: "destructive",
      });
      return;
    }

  setIsLoading(true);
  const networkConfig = BASE_MAINNET_CONFIG;

    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const network = await provider.getNetwork();
      
      if (Number(network.chainId) !== networkConfig.chainId) {
        try {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: networkConfig.chainIdHex }],
          });
        } catch (switchError: any) {
          if (switchError.code === 4902) {
            // Network not added, add Base mainnet
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [{
                chainId: networkConfig.chainIdHex,
                chainName: networkConfig.chainName,
                nativeCurrency: {
                  name: 'Ethereum',
                  symbol: 'ETH',
                  decimals: 18,
                },
                rpcUrls: [networkConfig.rpcUrl],
                blockExplorerUrls: [networkConfig.blockExplorer],
              }],
            });
          } else {
            throw switchError;
          }
        }
      }
      
      const updatedProvider = new ethers.BrowserProvider(window.ethereum);
      const signer = await updatedProvider.getSigner();
      
      const checksummedAddress = ethers.getAddress(networkConfig.contractAddress);
      
      const tx = await signer.sendTransaction({
        to: checksummedAddress,
        value: ethers.parseEther(amount),
      });

      await tx.wait();

      const newDonation: Donation = {
        id: donations.length + 1,
        amount,
        donor: account,
        cause,
        timestamp: Date.now(),
        txHash: tx.hash,
      };

      setDonations(prev => [newDonation, ...prev]);

      toast({
        title: "Donation Successful! 🎉",
        description: `Thank you for donating ${amount} ETH on Base Mainnet!`,
      });

    } catch (error: any) {
      console.error('Donation error:', error);
      
      let errorMessage = "Failed to process donation";
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage = "Transaction was cancelled by user";
      } else if (error.code === 'INSUFFICIENT_FUNDS' || error.code === -32000) {
        errorMessage = "Insufficient funds for transaction and gas fees";
      } else if (error.code === 'NETWORK_ERROR' || error.code === -32603) {
        errorMessage = "Network error. Please check your connection and try again";
      } else if (error.code === 'INVALID_ARGUMENT') {
        errorMessage = "Invalid transaction parameters. Please try again";
      } else if (error.code === 4902) {
        errorMessage = `Please add Base Mainnet to your wallet`;
      }

      toast({
        title: "Donation Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    donations,
    makeDonation,
    isLoading,
  };
}