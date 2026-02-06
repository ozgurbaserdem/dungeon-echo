export function GameFooter() {
  return (
    <footer className="p-4 text-center text-xs text-text-muted space-y-1">
      <p>Delve deeper, think smarter</p>
      <p className="flex items-center justify-center gap-3">
        <a href="https://www.linkedin.com/in/ozgur-baserdem/" target="_blank" rel="noopener noreferrer" className="hover:text-[#ffd700] transition-colors">LinkedIn</a>
        <span>·</span>
        <a href="https://github.com/ozgurbaserdem/gunud" target="_blank" rel="noopener noreferrer" className="hover:text-[#ffd700] transition-colors">GitHub</a>
      </p>
    </footer>
  );
}
