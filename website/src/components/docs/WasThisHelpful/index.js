import React, { useState } from 'react';
import clsx from 'clsx';
import { useColorMode } from '@docusaurus/theme-common';
import Icon from '../../ui/Icon';
import {
  captureDocsHelpfulSubmit,
  captureDocsHelpfulVote,
} from '@site/src/utils/captureDocsFeedback';
import styles from './styles.module.css';
import { useDocumentationFeedback } from '../../../hooks/useDocumentationFeedback';

/**
 * WasThisHelpful Component - Feedback widget for documentation pages
 * 
 * @param {string} pageId - Unique identifier for the page
 * @param {Function} onSubmit - Callback function when feedback is submitted
 */
export default function WasThisHelpful({
  pageId,
  onSubmit
}) {
  const { submitFeedback } = useDocumentationFeedback();
  const [feedback, setFeedback] = useState(null);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const thumbUpName = colorMode === 'dark' ? 'thumbs-up-dark' : 'thumbs-up';
  const thumbDownName = colorMode === 'dark' ? 'thumbs-down-dark' : 'thumbs-down';

  const analyticsContext = { pageId, permalink, title, variant };

  const handleCardFeedback = (value) => {
    setFeedback(value);
    captureDocsHelpfulVote({ helpful: value, ...analyticsContext });
  };

  const handleSubmit = () => {
    submitFeedback(pageId, feedback, comment.trim() || null);
    if (onSubmit) {
      onSubmit({ pageId, feedback, comment });
    }
    
    setSubmitted(true);
  };

  if (submitted) {
    const submittedBody = (
      <>
        <FeedbackCheckIcon
          size={variant === 'aside' ? 18 : 20}
          className={styles.feedbackSubmittedCheck}
        />
        <span>Thank you for your feedback!</span>
      </>
    );

    if (variant === 'aside' && asideEndSlot) {
      return (
        <div
          className={clsx(
            styles.asideRoot,
            styles.asideRootWithEndSlot,
            styles.asideRootSubmittedAside
          )}
        >
          <div
            className={clsx(
              styles.feedbackSubmitted,
              styles.feedbackSubmittedAside,
              styles.asideSubmittedMain
            )}
          >
            {submittedBody}
          </div>
          <div className={styles.asideEndSlot}>{asideEndSlot}</div>
        </div>
      );
    }

    return (
      <div
        className={clsx(
          styles.feedbackSubmitted,
          variant === 'aside' && styles.feedbackSubmittedAside
        )}
      >
        {submittedBody}
      </div>
    );
  }

  if (variant === 'aside') {
    const buttonsRow = (
      <div className={styles.asideButtons}>
        <button
          type="button"
          className={styles.asideBtn}
          onClick={handleAsideYes}
          aria-label="Yes, this was helpful"
        >
          <Icon name={thumbUpName} size={18} className={styles.thumbIcon} />
          Yes
        </button>
        <button
          type="button"
          className={styles.asideBtn}
          onClick={handleAsideNo}
          aria-label="No, this was not helpful"
        >
          <Icon name={thumbDownName} size={18} className={styles.thumbIcon} />
          No
        </button>
      </div>
    );

    return (
      <div
        className={clsx(
          styles.asideRoot,
          asideEndSlot && styles.asideRootWithEndSlot,
          feedback === 'no' && styles.asideRootWithFollowup
        )}
      >
        <p className={styles.asideLabel}>Was this helpful?</p>
        {buttonsRow}
        {feedback === 'no' && (
          <div className={styles.asideFollowup}>
            <textarea
              className={styles.asideTextarea}
              placeholder="Tell us more (optional)..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              rows={2}
            />
            <button
              type="button"
              className={clsx(styles.asideSubmit, styles.feedbackSubmitNo)}
              onClick={handleAsideSubmit}
            >
              Submit
            </button>
          </div>
        )}
        {asideEndSlot ? (
          <div className={styles.asideEndSlot}>{asideEndSlot}</div>
        ) : null}
      </div>
    );
  }

  return (
    <div className={styles.wasThisHelpful}>
      <div className={styles.feedbackPrompt}>
        <span className={styles.promptText}>Was this helpful?</span>
        <div className={styles.feedbackButtons}>
          <button
            type="button"
            className={clsx(
              styles.feedbackButton,
              feedback === 'yes' && styles.feedbackButtonActive
            )}
            onClick={() => handleCardFeedback('yes')}
            aria-label="Yes, this was helpful"
          >
            <img 
              src={feedback === 'yes' ? "/icons/thumbs-up-white.svg" : "/icons/thumbs-up.svg"}
              alt="" 
              width="20" 
              height="20"
              className={styles.feedbackIcon}
              aria-hidden="true"
            />
            Yes
          </button>
          <button
            type="button"
            className={clsx(
              styles.feedbackButton,
              feedback === 'no' && styles.feedbackButtonActive
            )}
            onClick={() => handleCardFeedback('no')}
            aria-label="No, this was not helpful"
          >
            <img 
              src={feedback === 'no' ? "/icons/thumbs-down-white.svg" : "/icons/thumbs-down.svg"}
              alt="" 
              width="20" 
              height="20"
              className={styles.feedbackIcon}
              aria-hidden="true"
            />
            No
          </button>
        </div>
      </div>
      {feedback && (
        <div className={styles.feedbackForm}>
          <textarea
            className={styles.commentInput}
            placeholder="Tell us more (optional)..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={3}
          />
          <button
            type="button"
            className={clsx(
              styles.submitButton,
              feedback === 'no' && styles.feedbackSubmitNo
            )}
            onClick={handleCardSubmit}
          >
            Submit Feedback
          </button>
        </div>
      )}
    </div>
  );
}
