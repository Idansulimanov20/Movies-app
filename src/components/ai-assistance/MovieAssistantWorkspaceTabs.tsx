import { FaBookmark } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";

/** Switches between live chat and saved recommendation answers. */
function MovieAssistantWorkspaceTabs({ activeTab, onTabChange, savedCount }) {
  return (
    <div className="ai-tabs" role="tablist" aria-label="Movie assistant workspace">
      <button
        type="button"
        className={activeTab === "chat" ? "active" : ""}
        onClick={() => onTabChange("chat")}
        role="tab"
        aria-selected={activeTab === "chat"}
      >
        <HiSparkles aria-hidden="true" />
        Chat
      </button>
      <button
        type="button"
        className={activeTab === "saved" ? "active" : ""}
        onClick={() => onTabChange("saved")}
        role="tab"
        aria-selected={activeTab === "saved"}
      >
        <FaBookmark aria-hidden="true" />
        Saved ({savedCount})
      </button>
    </div>
  );
}

export default MovieAssistantWorkspaceTabs;
