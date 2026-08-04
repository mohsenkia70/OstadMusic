"use client";

export function SuggestedQuestions({
  questions,
  onSelect,
}: {
  questions: string[];
  onSelect: (question: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2.5 justify-center">
      {questions.map((q) => (
        <button
          key={q}
          onClick={() => onSelect(q)}
          className="rounded-xl border border-line bg-surface px-4 py-3 text-sm text-ink/90 text-start transition-colors hover:border-gold/40 hover:bg-gold-soft hover:text-gold"
        >
          {q}
        </button>
      ))}
    </div>
  );
}
