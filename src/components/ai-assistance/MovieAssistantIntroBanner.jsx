import { FaCommentDots } from "react-icons/fa";
import { HiSparkles } from "react-icons/hi2";
import { TbBolt } from "react-icons/tb";

function MovieAssistantIntroBanner() {
  return (
    <header className="ai-hero">
      <div className="ai-hero-copy">
        <p className="ai-eyebrow">Mock AI movie concierge</p>
        <h1>Ask for the movie name you have in mind</h1>
        <p>
          Describe the vibe, decade, genre, or occasion. This demo uses a local mock
          recommender until the server gets real AI infrastructure.
        </p>
      </div>
      <div className="ai-hero-icons" aria-label="Movie assistant highlights">
        <span>
          <HiSparkles aria-hidden="true" />
          Natural language
        </span>
        <span>
          <TbBolt aria-hidden="true" />
          Instant picks
        </span>
        <span>
          <FaCommentDots aria-hidden="true" />
          Feedback ready
        </span>
      </div>
    </header>
  );
}

export default MovieAssistantIntroBanner;
