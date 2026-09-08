// hooks/useFacultyVotes.js
import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

/**
 * Handles voting/un-voting on faculty_entries via the faculty_votes table.
 * Optimistically updates local state, rolls back on failure.
 *
 * @param {Array} entries - current entries array (must have id, votes, hasVoted)
 * @param {Function} setEntries - state setter for entries
 * @param {Function} [showToast] - optional toast handler for error feedback
 */
export function useFacultyVotes(entries, setEntries, showToast) {
  const [votingId, setVotingId] = useState(null); // entry currently being voted on

  const toggleVote = useCallback(
    async (entryId) => {
      if (votingId) return; // block overlapping vote requests

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        showToast?.("You must be signed in to vote.", "error");
        return;
      }

      // Enforce student-only voting to avoid faculty self-voting / bias
      let role = user.user_metadata?.role || user.user_metadata?.user_type;
      if (!role || role === "user") {
        const { data: profile } = await supabase
          .from("profiles")
          .select("role, user_type")
          .eq("id", user.id)
          .single();
        role = profile?.role || profile?.user_type || "student";
      }

      if (role === "faculty" || role === "admin") {
        showToast?.(
          "Only students are eligible to vote on GreenMate Challenge entries.",
          "error"
        );
        return;
      }

      const entry = (entries ?? []).find((e) => e.id === entryId);
      if (!entry) return;

      const wasVoted = entry.hasVoted;
      setVotingId(entryId);

      // Optimistic update
      setEntries((prev) =>
        (prev ?? []).map((item) =>
          item.id === entryId
            ? {
                ...item,
                hasVoted: !wasVoted,
                votes: wasVoted ? item.votes - 1 : item.votes + 1,
              }
            : item,
        ),
      );

      try {
        if (wasVoted) {
          const { error } = await supabase
            .from("faculty_votes")
            .delete()
            .eq("entry_id", entryId)
            .eq("user_id", user.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("faculty_votes")
            .insert({ entry_id: entryId, user_id: user.id });
          if (error) throw error;
        }
      } catch (err) {
        // Roll back on failure
        setEntries((prev) =>
          (prev ?? []).map((item) =>
            item.id === entryId
              ? { ...item, hasVoted: wasVoted, votes: entry.votes }
              : item,
          ),
        );
        console.error("Vote failed:", err);
        showToast?.(err?.message || "Vote failed. Please try again.", "error");
      } finally {
        setVotingId(null);
      }
    },
    [entries, setEntries, showToast, votingId],
  );

  return { toggleVote, votingId };
}