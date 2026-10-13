// hooks/useSubmissionVotes.js
import { useState, useCallback } from "react";
import { supabase } from "../lib/supabase";

/**
 * Handles voting/un-voting on submissions via the submission_votes table.
 * Optimistically updates local state, rolls back on failure.
 * Enforces single active vote across all voting systems.
 *
 * @param {Array} submissions - current submissions array (must have id, votes, hasVoted)
 * @param {Function} setSubmissions - state setter for submissions
 * @param {Function} [showToast] - optional toast handler for error feedback
 */
export function useSubmissionVotes(submissions, setSubmissions, showToast) {
  const [votingId, setVotingId] = useState(null); // submission currently being voted on

  const toggleVote = useCallback(
    async (submissionId) => {
      if (votingId) return; // block overlapping vote requests

      const { data: { user }, error: authError } = await supabase.auth.getUser();
      if (authError || !user) {
        showToast?.("You must be signed in to vote.", "error");
        return;
      }

      const submission = (submissions ?? []).find((s) => s.id === submissionId);
      if (!submission) return;

      // Check if user has any existing vote (faculty or submission) - except possibly on this submission
      const { data: existingFacultyVote, error: facultyVoteError } = await supabase
        .from("faculty_votes")
        .select("entry_id")
        .eq("user_id", user.id)
        .maybeSingle();

      const { data: existingSubmissionVote, error: submissionVoteError } = await supabase
        .from("submission_votes")
        .select("submission_id")
        .eq("user_id", user.id)
        .maybeSingle();

      const hasExistingVote =
        (existingFacultyVote && !facultyVoteError) ||
        (existingSubmissionVote && !submissionVoteError);

      // If user has existing vote elsewhere and is not removing it from this submission, prevent voting
      if (hasExistingVote) {
        const isVotingOnOwnSubmission =
          (existingFacultyVote && existingFacultyVote.entry_id === submissionId) ||
          (existingSubmissionVote && existingSubmissionVote.submission_id === submissionId);

        if (!isVotingOnOwnSubmission) {
          showToast?.("Please remove your existing vote before voting on another entry.", "warning");
          return;
        }
      }

      const wasVoted = submission.hasVoted;
      setVotingId(submissionId);

      // Optimistic update
      setSubmissions((prev) =>
        (prev ?? []).map((item) =>
          item.id === submissionId
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
            .from("submission_votes")
            .delete()
            .eq("submission_id", submissionId)
            .eq("user_id", user.id);
          if (error) throw error;
        } else {
          const { error } = await supabase
            .from("submission_votes")
            .insert({ submission_id: submissionId, user_id: user.id });
          if (error) throw error;
        }
      } catch (err) {
        // Roll back on failure
        setSubmissions((prev) =>
          (prev ?? []).map((item) =>
            item.id === submissionId
              ? { ...item, hasVoted: wasVoted, votes: submission.votes }
              : item,
          ),
        );
        console.error("Vote failed:", err);
        showToast?.(err?.message || "Vote failed. Please try again.", "error");
      } finally {
        setVotingId(null);
      }
    },
    [submissions, setSubmissions, showToast, votingId],
  );

  return { toggleVote, votingId };
}