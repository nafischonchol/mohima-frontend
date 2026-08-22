export function AnnouncementBar() {
  const message = (
    <span className="flex items-center gap-2 px-4 sm:px-12">
      <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-ping shrink-0" />
      <span>
        🇰🇷 <strong>Direct Seoul Import B2B Hub:</strong> Exclusive Wholesale
        Supply for Cosmetics Shop Owners & Resellers in Bangladesh!
      </span>
    </span>
  );

  return (
    <div className="bg-gradient-to-r from-rose-900 via-indigo-950 to-slate-950 border-b border-rose-500/20 text-rose-200 text-[11px] sm:text-xs py-2 font-medium overflow-hidden whitespace-nowrap flex relative w-full">
      <div className="flex w-max animate-marquee hover:[animation-play-state:paused]">
        {message}
        {message}
        {message}
        {message}
      </div>
    </div>
  );
}
