import { searchMovies } from "./api";

export class TmdbMatchError extends Error {
  constructor(code, message) {
    super(message);
    this.code = code;
  }
}

/**
 * Maps a mock / recommendation movie (title + optional release_date) to a TMDB search hit.
 */
export async function resolveRecommendationToTmdbMovie(recommendation) {
  const title = recommendation.title?.trim();
  if (!title) {
    throw new TmdbMatchError("MISSING_TITLE", "Movie title is missing.");
  }

  const year = recommendation.release_date?.slice(0, 4) || "";
  const query = year ? `${title} ${year}` : title;
  const results = await searchMovies(query);

  if (!results?.length) {
    throw new TmdbMatchError(
      "NO_RESULTS",
      "No matching movies found in the catalog.",
    );
  }

  const wanted = title.toLowerCase();

  const exactTitle = (m) =>
    m.title?.toLowerCase() === wanted ||
    m.original_title?.toLowerCase() === wanted;

  let match = results.find(exactTitle);

  if (year && match && match.release_date && !match.release_date.startsWith(year)) {
    const exactSameYear = results.find(
      (m) => exactTitle(m) && m.release_date?.startsWith(year),
    );
    match = exactSameYear || match;
  }

  if (!match && year) {
    match = results.find((m) => m.release_date?.startsWith(year));
  }

  return match || results[0];
}
