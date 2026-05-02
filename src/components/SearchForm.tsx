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
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">
      <textarea
        className="w-full rounded-lg border border-slate-300 p-3 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none"
        rows={4}
        placeholder="Describe what you're going through..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Describe your situation"
      />

      {/* Sample prompt chips */}
      <div className="flex flex-wrap gap-2">
        {SAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              onChange(prompt);
              // small delay so state updates before submit fires
              setTimeout(onSubmit, 0);
            }}
            className="rounded-full border border-blue-300 bg-blue-50 px-3 py-1 text-sm text-blue-700 hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            {prompt}
          </button>
        ))}
      </div>

      <button
        type="submit"
        className="w-full rounded-lg bg-blue-600 px-4 py-3 font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
      >
        Find Support
      </button>
    </form>
  );
}
