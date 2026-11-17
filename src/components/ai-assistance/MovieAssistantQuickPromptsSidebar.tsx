/** Sidebar with one-click example prompts and short demo notes. */
function MovieAssistantQuickPromptsSidebar({
  isThinking,
  onStarterPrompt,
  starterPrompts,
}) {
  return (
    <aside className="ai-sidebar">
      <div className="ai-sidebar-section">
        <h2>Built-in ideas</h2>
        <div className="ai-prompt-list">
          {starterPrompts.map((starterPrompt) => (
            <button
              type="button"
              key={starterPrompt}
              onClick={() => onStarterPrompt(starterPrompt)}
              disabled={isThinking}
            >
              {starterPrompt}
            </button>
          ))}
        </div>
      </div>

      <div className="ai-sidebar-section">
        <h2>Demo coverage</h2>
        <p>
          Handles empty prompts, long prompts, duplicate saves, no exact mock matches,
          unauthenticated favorite saves, and feedback on each AI answer.
        </p>
      </div>
    </aside>
  );
}

export default MovieAssistantQuickPromptsSidebar;
