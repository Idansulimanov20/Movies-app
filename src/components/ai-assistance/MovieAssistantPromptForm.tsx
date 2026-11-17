import { FaPaperPlane } from "react-icons/fa";

/** Text field + send for asking the movie assistant for picks. */
function MovieAssistantPromptForm({
  prompt,
  maxLength,
  onPromptChange,
  onSubmit,
  disabled,
}) {
  function handleSubmit(event) {
    event.preventDefault();
    onSubmit(event);
  }

  return (
    <form className="ai-chat-form" onSubmit={handleSubmit}>
      <label htmlFor="ai-prompt">Ask for recommendations</label>
      <div className="ai-input-row">
        <input
          id="ai-prompt"
          type="text"
          value={prompt}
          onChange={(event) => onPromptChange(event.target.value)}
          maxLength={maxLength}
          placeholder="Try: 90s action movies with big set pieces"
          disabled={disabled}
        />
        <button type="submit" disabled={disabled}>
          <FaPaperPlane aria-hidden="true" />
          Send
        </button>
      </div>
      <p className="ai-character-count">
        {prompt.length}/{maxLength}
      </p>
    </form>
  );
}

export default MovieAssistantPromptForm;
