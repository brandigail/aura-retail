/** Owner-editable message above the header; renders nothing when empty. */
export function AnnouncementBar({ text }: { text: string }) {
  if (!text.trim()) return null;
  return (
    <div role="region" aria-label="Announcement" className="bg-accent px-4 py-2 text-center text-sm font-medium text-accent-foreground">
      <p className="mx-auto max-w-6xl">{text}</p>
    </div>
  );
}
