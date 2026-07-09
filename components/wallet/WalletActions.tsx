import Button from "@/components/ui/Button";

export default function WalletActions() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      <Button>Send π</Button>
      <Button variant="secondary">Receive</Button>
      <Button variant="secondary">Stake</Button>
      <Button variant="gold">Buy π</Button>
    </div>
  );
}