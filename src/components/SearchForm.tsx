import type { FormEvent, RefObject } from "react";

interface SearchFormProps {
  value: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  textareaRef?: RefObject<HTMLTextAreaElement>;
  isLoading?: boolean;
}

const SAMPLE_PROMPTS = [
  "I don't have money for groceries this week.",
  "My laptop broke and I have homework due tomorrow.",
  "I'm overwhelmed and falling behind in class.",
];

export function SearchForm({
  value,
  onChange,
  onSubmit,
  textareaRef,
  isLoading = false,
}: SearchFormProps) {
  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!isLoading) onSubmit();
  }

  return (
    <form onSubmit={handleSubmit} className="w-full space-y-4">

      {/* Label */}
      <label
        htmlFor="situation-input"
        className="block text-xs font-semibold uppercase tracking-[0.15em] mb-2"
        style={{ color: "#cbd5e1" }}
      >
        Describe your situation
      </label>

      {/* Textarea */}
      <textarea
        ref={textareaRef}
        id="situation-input"
        className="w-full rounded-xl p-4 text-sm resize-none backdrop-blur-sm
          transition-all duration-200
          focus:outline-none"
        style={{
          background: "rgba(255,255,255,0.08)",
          border: "1px solid rgba(255,255,255,0.18)",
          color: "#f1f5f9",
          caretColor: "#22d3ee",
          colorScheme: "dark",
        }}
        onFocus={(e) => {
          e.currentTarget.style.border = "1px solid rgba(96,165,250,0.55)";
          e.currentTarget.style.background = "rgba(255,255,255,0.10)";
          e.currentTarget.style.boxShadow = "0 0 0 3px rgba(96,165,250,0.12)";
        }}
        onBlur={(e) => {
          e.currentTarget.style.border = "1px solid rgba(255,255,255,0.13)";
          e.currentTarget.style.background = "rgba(255,255,255,0.07)";
          e.currentTarget.style.boxShadow = "none";
        }}
        rows={4}
        placeholder="e.g. I'm stressed about rent and falling behind in class..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Describe your situation"
      />

      {/* Sample prompt chips */}
      <div className="flex flex-wrap gap-2" role="group" aria-label="Example prompts">
        <span className="w-full text-xs mb-1" style={{ color: "rgba(148,163,184,0.6)" }}>
          Try an example:
        </span>
        {SAMPLE_PROMPTS.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => {
              if (isLoading) return;
              onChange(prompt);
              setTimeout(onSubmit, 0);
            }}
            className="rounded-full px-3 py-1.5 text-xs font-medium
              backdrop-blur-sm
              transition-all duration-150
              active:scale-95
              focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400/60"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#94a3b8",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLButtonElement).style.color = "#e2e8f0";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.22)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.06)";
              (e.currentTarget as HTMLButtonElement).style.color = "#94a3b8";
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
            }}
          >
            {prompt}
          </button>
        ))}
      </div>

      {/* Submit */}
      <button
        type="submit"
        disabled={isLoading}
        className="group w-full inline-flex items-center justify-center gap-2
          rounded-full px-6 py-3 text-sm font-semibold text-white
          transition-all duration-[220ms]
          hover:-translate-y-[2px] active:translate-y-0 active:scale-[0.98]
          focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-300
          disabled:opacity-70 disabled:cursor-not-allowed
          focus-visible:ring-offset-2 focus-visible:ring-offset-transparent"
        style={{
          background: "linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)",
          boxShadow: "0 4px 20px rgba(99,102,241,0.40)",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 28px rgba(99,102,241,0.58)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 4px 20px rgba(99,102,241,0.40)";
        }}
      >
        {isLoading ? "Finding support..." : "Find Support"}
        {!isLoading && (
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true"
            className="transition-transform duration-200 group-hover:translate-x-0.5">
            <path d="M2 7h10M8 3l4 4-4 4" stroke="currentColor" strokeWidth="1.8"
              strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>
    </form>
  );
}
