export const MOVIE_LIBRARY = [
  {
    id: 91001,
    title: "Heat",
    release_date: "1995-12-15",
    genres: ["90s", "action", "crime", "thriller"],
    moods: ["intense", "smart", "cat-and-mouse"],
    reason:
      "A polished 90s crime epic with tense set pieces, big personalities, and a famous downtown shootout.",
  },
  {
    id: 91002,
    title: "Terminator 2: Judgment Day",
    release_date: "1991-07-03",
    genres: ["90s", "action", "sci-fi"],
    moods: ["blockbuster", "explosive", "iconic"],
    reason:
      "A clean pick when someone wants 90s action, memorable effects, and relentless momentum.",
  },
  {
    id: 91003,
    title: "Speed",
    release_date: "1994-06-10",
    genres: ["90s", "action", "thriller"],
    moods: ["fast", "suspense", "fun"],
    reason:
      "A high-concept action thriller that stays simple, urgent, and wildly rewatchable.",
  },
  {
    id: 91004,
    title: "The Matrix",
    release_date: "1999-03-31",
    genres: ["90s", "action", "sci-fi"],
    moods: ["stylish", "mind-bending", "cool"],
    reason:
      "Ideal for cyberpunk action, slick fight choreography, and a story with big ideas.",
  },
  {
    id: 91005,
    title: "Point Break",
    release_date: "1991-07-12",
    genres: ["90s", "action", "crime"],
    moods: ["sunny", "reckless", "cult"],
    reason:
      "A breezy action-crime ride with surfing, undercover tension, and cult-movie energy.",
  },
  {
    id: 91006,
    title: "The Fugitive",
    release_date: "1993-08-06",
    genres: ["90s", "thriller", "action"],
    moods: ["chase", "smart", "suspense"],
    reason:
      "A sharp man-on-the-run thriller for viewers who want action with detective tension.",
  },
  {
    id: 91007,
    title: "Jurassic Park",
    release_date: "1993-06-11",
    genres: ["90s", "adventure", "sci-fi"],
    moods: ["wonder", "suspense", "family"],
    reason:
      "A crowd-pleasing adventure with awe, danger, and the kind of spectacle that still lands.",
  },
  {
    id: 91008,
    title: "Clueless",
    release_date: "1995-07-19",
    genres: ["90s", "comedy", "romance"],
    moods: ["light", "stylish", "funny"],
    reason:
      "A bright 90s comedy pick when the request leans charming, stylish, and easy to watch.",
  },
  {
    id: 91009,
    title: "The Shawshank Redemption",
    release_date: "1994-09-23",
    genres: ["drama", "classic"],
    moods: ["hopeful", "emotional", "slow-burn"],
    reason:
      "A reliable classic for a thoughtful, emotional movie night with a satisfying payoff.",
  },
  {
    id: 91010,
    title: "Mad Max: Fury Road",
    release_date: "2015-05-15",
    genres: ["action", "adventure"],
    moods: ["chaotic", "visual", "nonstop"],
    reason:
      "A modern action blast when the viewer wants pure momentum and striking visuals.",
  },
  {
    id: 91011,
    title: "Knives Out",
    release_date: "2019-11-27",
    genres: ["mystery", "comedy", "crime"],
    moods: ["clever", "funny", "twisty"],
    reason:
      "Great for a playful mystery with a strong ensemble and enough twists to keep everyone engaged.",
  },
  {
    id: 91012,
    title: "Spider-Man: Into the Spider-Verse",
    release_date: "2018-12-14",
    genres: ["animation", "action", "family"],
    moods: ["colorful", "heartfelt", "energetic"],
    reason:
      "A lively animated pick with action, humor, and a lot of heart.",
  },
  {
    id: 91013,
    title: "Before Sunrise",
    release_date: "1995-01-27",
    genres: ["90s", "romance", "drama"],
    moods: ["talky", "intimate", "gentle"],
    reason:
      "Perfect for a romantic, conversation-driven movie that feels human and low-key.",
  },
  {
    id: 91014,
    title: "Alien",
    release_date: "1979-05-25",
    genres: ["horror", "sci-fi"],
    moods: ["tense", "claustrophobic", "scary"],
    reason:
      "A classic choice for slow-building sci-fi horror and serious tension.",
  },
  {
    id: 91015,
    title: "Paddington 2",
    release_date: "2017-11-10",
    genres: ["family", "comedy", "adventure"],
    moods: ["cozy", "kind", "funny"],
    reason:
      "A warm, beautifully made comfort movie when the request asks for something wholesome.",
  },
];

export const STARTER_PROMPTS = [
  "90s action movies",
  "A cozy family movie",
  "Smart mystery with humor",
  "Sci-fi action with style",
  "A romantic 90s movie",
];

export function createInitialMessages() {
  return [
    {
      id: "welcome",
      role: "assistant",
      prompt: "Built-in recommendations",
      content:
        "Tell me the mood, decade, genre, actor, or situation. I will suggest a few movie names and explain why they fit.",
      recommendations: MOVIE_LIBRARY.filter((movie) =>
        ["Heat", "Terminator 2: Judgment Day", "Speed"].includes(movie.title),
      ),
      saved: false,
      feedback: null,
      feedbackText: "",
    },
  ];
}

export function buildMockRecommendation(prompt) {
  const normalizedPrompt = prompt.toLowerCase();
  const words = normalizedPrompt
    .split(/[^a-z0-9]+/)
    .filter((word) => word.length > 1);

  const scoredMovies = MOVIE_LIBRARY.map((movie) => {
    const searchableText = [
      movie.title,
      movie.release_date.split("-")[0],
      ...movie.genres,
      ...movie.moods,
      movie.reason,
    ]
      .join(" ")
      .toLowerCase();

    const score = words.reduce((total, word) => {
      if (searchableText.includes(word)) return total + 3;
      if (word === "nineties" && searchableText.includes("90s")) return total + 3;
      if (word === "scary" && searchableText.includes("horror")) return total + 2;
      if (word === "kids" && searchableText.includes("family")) return total + 2;
      return total;
    }, 0);

    return { movie, score };
  })
    .sort((left, right) => right.score - left.score)
    .map(({ movie, score }) => ({ ...movie, score }));

  const strongMatches = scoredMovies.filter((movie) => movie.score > 0);
  const recommendations = (strongMatches.length ? strongMatches : scoredMovies)
    .slice(0, 4)
    .map((rankedMovie) => {
      const movie = { ...rankedMovie };
      delete movie.score;
      return movie;
    });

  const lower = prompt.trim().toLowerCase();
  const content =
    strongMatches.length > 0
      ? `Here are ${recommendations.length} picks that match "${prompt.trim()}". I weighted genre, mood, decade, and title clues from your request.`
      : `I could not find an exact mock match for "${prompt.trim()}", so here are flexible crowd-pleasers to start from. Try adding a genre, decade, or mood for sharper picks.`;

  return {
    content,
    recommendations:
      lower.includes("90") && lower.includes("action")
        ? MOVIE_LIBRARY.filter((movie) =>
            ["Heat", "Terminator 2: Judgment Day", "Speed", "The Matrix"].includes(
              movie.title,
            ),
          )
        : recommendations,
  };
}
