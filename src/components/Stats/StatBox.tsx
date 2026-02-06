interface StatBoxProps {
  label: string;
  value: number;
  emoji?: string;
}

export function StatBox({ label, value, emoji }: StatBoxProps) {
  return (
    <div className="bg-dungeon-bg rounded p-3 text-center">
      <p className="text-text-secondary text-xs mb-1">{label}</p>
      <p className="text-2xl font-bold">
        {emoji && <span className="mr-1">{emoji}</span>}
        {value}
      </p>
    </div>
  );
}
