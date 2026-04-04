/**
 * Consent gate for PostHog when using cookieless_mode: "on_reject".
 * Accept enables cookies, session replay, and full SDK features; decline keeps cookieless counting.
 *
 * @see https://posthog.com/docs/tutorials/cookieless-tracking
 * @see https://posthog.com/tutorials/react-cookie-banner
 *
 * If consent stays pending (user ignores the banner), PostHog captures nothing until
 * they choose. After AUTO_DECLINE_MS we call opt_out_capturing() so the banner hides
 * and cookieless visit counting can run—same as clicking Decline.
 */
import React, {useEffect, useState} from 'react';
import ExecutionEnvironment from '@docusaurus/ExecutionEnvironment';
import styles from './styles.module.css';

const POLL_MS = 50;
const POLL_MAX = 200;

/** Silence after this long is treated as decline (cookieless only). */
const AUTO_DECLINE_MS = 60_000;

export default function CookieConsentBanner() {
  const [consent, setConsent] = useState(
    /** @type {'unknown' | 'pending' | 'granted' | 'denied' | 'skip'} */ ('unknown'),
  );

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return undefined;

    let cancelled = false;
    let tries = 0;
    const id = window.setInterval(() => {
      tries += 1;
      const ph = window.posthog;

      if (cancelled) {
        window.clearInterval(id);
        return;
      }

      if (!ph) {
        if (tries >= POLL_MAX) {
          window.clearInterval(id);
          setConsent('skip');
        }
        return;
      }

      if (typeof ph.get_explicit_consent_status !== 'function') {
        if (tries >= POLL_MAX) {
          window.clearInterval(id);
          setConsent('skip');
        }
        return;
      }

      window.clearInterval(id);
      setConsent(ph.get_explicit_consent_status());
    }, POLL_MS);

    return () => {
      cancelled = true;
      window.clearInterval(id);
    };
  }, []);

  useEffect(() => {
    if (!ExecutionEnvironment.canUseDOM) return undefined;
    if (consent !== 'pending') return undefined;

    const id = window.setTimeout(() => {
      window.posthog?.opt_out_capturing?.();
      setConsent('denied');
    }, AUTO_DECLINE_MS);

    return () => window.clearTimeout(id);
  }, [consent]);

  if (consent !== 'pending') {
    return null;
  }

  const handleAccept = () => {
    window.posthog?.opt_in_capturing?.();
    setConsent('granted');
  };

  const handleDecline = () => {
    window.posthog?.opt_out_capturing?.();
    setConsent('denied');
  };

  return (
    <div
      className={styles.banner}
      role="region"
      aria-label="Analytics and cookie consent"
      aria-describedby="cookie-consent-desc">
      <div className={styles.inner}>
        <p className={styles.text} id="cookie-consent-desc">
          We use cookies to <b>measure and improve</b> our documentation experience.
        </p>
        <div className={styles.actions}>
          <button
            type="button"
            className={styles.btnSecondary}
            onClick={handleDecline}>
            Decline
          </button>
          <button
            type="button"
            className={styles.btnPrimary}
            onClick={handleAccept}>
            Accept
          </button>
        </div>
      </div>
    </div>
  );
}
