import { HiSparkles } from "react-icons/hi2";
import MovieAssistantConversationMessage from "./MovieAssistantConversationMessage";
import MovieAssistantPromptForm from "./MovieAssistantPromptForm";

function MovieAssistantChatWorkspace({
  messages,
  savedIds,
  isThinking,
  messagesEndRef,
  prompt,
  maxPromptLength,
  onPromptChange,
  onSubmit,
  onSaveAnswer,
  onFavoriteMovie,
  isRecommendationFavorite,
  savingFavoriteId,
  onFeedback,
  onFeedbackTextChange,
}) {
  return (
    <section className="ai-chat-shell">
      <div className="ai-chat-header">
        <div className="ai-avatar">
          <HiSparkles aria-hidden="true" />
        </div>
        <div>
          <h2>Watch & Chill AI</h2>
          <p>Mock mode active</p>
        </div>
      </div>

      <div className="ai-messages" aria-live="polite">
        {messages.map((message) => (
          <MovieAssistantConversationMessage
            key={message.id}
            message={message}
            savedIds={savedIds}
            onSaveAnswer={onSaveAnswer}
            onFavoriteMovie={onFavoriteMovie}
            isRecommendationFavorite={isRecommendationFavorite}
            savingFavoriteId={savingFavoriteId}
            onFeedback={onFeedback}
            onFeedbackTextChange={onFeedbackTextChange}
          />
        ))}

        {isThinking && (
          <article className="ai-message assistant">
            <div className="ai-message-icon" aria-hidden="true">
              <HiSparkles />
            </div>
            <div className="ai-message-body">
              <div className="ai-thinking">
                <span />
                <span />
                <span />
              </div>
            </div>
          </article>
        )}
        <div ref={messagesEndRef} />
      </div>

      <MovieAssistantPromptForm
        prompt={prompt}
        maxLength={maxPromptLength}
        onPromptChange={onPromptChange}
        onSubmit={onSubmit}
        disabled={isThinking}
      />
    </section>
  );
}

export default MovieAssistantChatWorkspace;
