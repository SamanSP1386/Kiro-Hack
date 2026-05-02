import type { FormEvent } from "react";

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
}

const SAMPLE_PROMPTS = [
  "I don't have money for groceries this week.",
  "My laptop broke and I have homework due tomorrow.",
  "I'm overwhelmed and falling behind in class.",
];

export function SearchForm({ value, onChange, onSubmit }: SearchFormProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      {/* Textarea */}
      <textarea
        className="
          w-full rounded-xl border border-white/15 bg-white/[0.07]
          p-4 text-sm text-white placeholder-white/35
          resize-none backdrop-blur-sm
          transition-colors duration-200
          focus:outline-none focus:border-blue-400/60 focus:bg-white/10
          focus-visible:ring-2 focus-visible:ring-blue-400/50
        "
        rows={4}
        placeholder="Describe what you're going through..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Describe your situation"
      />

      {/* Sample prompt chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Example prompts">
        {SAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              onChange(prompt);
              setTimeout(onSubmit, 0);
            }}
            className="
              rounded-full border border-white/15 bg-white/[0.06]
              px-3 py-1.5 text-xs font-medium text-white/60
              backdrop-blur-sm
              transition-all duration-150
              hover:bg-white/15 hover:text-white/90 hover:border-white/25
              active:scale-95
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60
            "
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Submit button */}
      <button
        type="submit"
        className="
          group w-full inline-flex items-center justify-center gap-2
          rounded-full bg-blue-500 px-6 py-3
          text-sm font-semibold text-white
          shadow-lg shadow-blue-900/40
          transition-all duration-200
          hover:bg-blue-400 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-blue-900/50
          active:translate-y-0 active:scale-[0.98] active:shadow-md
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-950
        "
      >
        Find Support
        <svg
          width="14" height="14" viewBox="0 0 14 14" fill="none"
          aria-hidden="true"
          className="transition-transform duration-200 group-hover:translate-x-0.5"
        >
          <path
            d="M2 7h10M8 3l4 4-4 4"
            stroke="currentColor" strokeWidth="1.8"
            strokeLinecap="round" strokeLinejoin="round"
          />
        </svg>
      </button>
    </form>
  );
}
