import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";

interface NetworkToggleProps {
  useTestnet: boolean;
  onToggle: (enabled: boolean) => void;
}

export function NetworkToggle({ useTestnet, onToggle }: NetworkToggleProps) {
  return (
    <Card className="p-4 mb-6 border-dashed">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Label htmlFor="network-toggle" className="text-sm font-medium">
            Network Mode
          </Label>
          <p className="text-xs text-muted-foreground">
            {useTestnet 
              ? "🧪 Using Sepolia Testnet - Free test ETH!" 
              : "⚠️ Using Ethereum Mainnet - Real money!"}
          </p>
        </div>
        <Switch
          id="network-toggle"
          checked={useTestnet}
          onCheckedChange={onToggle}
        />
      </div>
      {useTestnet && (
        <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-950/20 rounded-lg">
          <p className="text-xs text-blue-700 dark:text-blue-300">
            💡 Get free test ETH from: <a 
              href="https://faucet-sepolia.rockx.com/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="underline hover:no-underline"
            >
              Sepolia Faucet
            </a>
          </p>
        </div>
      )}
      {!useTestnet && (
        <div className="mt-3 p-3 bg-red-50 dark:bg-red-950/20 rounded-lg">
          <p className="text-xs text-red-700 dark:text-red-300">
            ⚠️ Warning: You are using Ethereum mainnet. Real ETH will be spent!
          </p>
        </div>
      )}
    </Card>
  );
}