
'use client';

export default function StoryCard({ story, compact = false, className = '' }) {
  const { title, authorName, coverUrl } = story;

  const wrapper = `rounded-2xl bg-white ${className}`;
  const media = `w-full overflow-hidden rounded-xl bg-neutral-100 aspect-[4/3]`;
  const titleCls = `font-medium text-neutral-900 truncate ${compact ? 'text-base' : 'text-lg'}`;
  const authorCls = `${compact ? 'text-xs' : 'text-sm'} text-neutral-600`;

  return (
    <div className={wrapper}>
      <div className={media}>
        {coverUrl ? (
          <img src={coverUrl} alt={title || 'Story cover'} className="h-full w-full object-cover" />
        ) : (
          <div className="h-full w-full bg-gradient-to-br from-purple-200 to-blue-200" />
        )}
      </div>

      <div className="mt-3">
        <h3 className={titleCls}>{title || 'Untitled'}</h3>
        <p className={authorCls}>{authorName ? `by ${authorName}` : '\u00A0'}</p>
      </div>
    </div>
  );
}
