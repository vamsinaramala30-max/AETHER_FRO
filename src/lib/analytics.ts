import ReactGA from "react-ga4";

// Environment variables configuration
const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
const IS_PROD = import.meta.env.PROD;
const IS_DEV_ENABLE = import.meta.env.VITE_GA_ENABLE_DEV === "true";

let isInitialized = false;

/**
 * Validates whether the Measurement ID follows standard GA4 format (G-XXXXXXXXXX)
 */
const isValidMeasurementId = (id?: string): boolean => {
  return typeof id === "string" && /^G-[A-Z0-9]+$/i.test(id.trim());
};

/**
 * Initializes Google Analytics 4.
 * Only initializes in production unless VITE_GA_ENABLE_DEV="true" is set.
 */
export const initGA = (): boolean => {
  if (isInitialized) {
    return true;
  }

  const shouldInitialize = IS_PROD || IS_DEV_ENABLE;

  if (!shouldInitialize) {
    return false;
  }

  if (!MEASUREMENT_ID || !isValidMeasurementId(MEASUREMENT_ID)) {
    console.warn(
      "[GA4] Analytics skipped: Invalid or missing VITE_GA_MEASUREMENT_ID."
    );
    return false;
  }

  try {
    ReactGA.initialize(MEASUREMENT_ID.trim());
    isInitialized = true;
    return true;
  } catch (error) {
    console.error("[GA4] Failed to initialize Google Analytics:", error);
    return false;
  }
};

/**
 * Helper to check if GA4 active before sending events
 */
export const isGAInitialized = (): boolean => isInitialized;

// ============================================================================
// Tracking Helpers
// ============================================================================

/**
 * Track page views dynamically
 */
export const trackPageView = (path: string, title?: string): void => {
  if (!isInitialized) return;
  try {
    ReactGA.send({
      hitType: "pageview",
      page: path,
      title: title || document.title,
    });
  } catch (error) {
    console.error("[GA4] Pageview tracking failed:", error);
  }
};

/**
 * Generic custom event tracker
 */
export const trackEvent = (
  category: string,
  action: string,
  label?: string,
  value?: number,
  params?: Record<string, unknown>
): void => {
  if (!isInitialized) return;
  try {
    ReactGA.event({
      category,
      action,
      label,
      value,
      ...params,
    });
  } catch (error) {
    console.error("[GA4] Custom event tracking failed:", error);
  }
};

/**
 * User authentication & lifecycle events
 */
export const trackLogin = (method: string): void => {
  trackEvent("User", "login", method, undefined, { method });
};

export const trackSignUp = (method: string): void => {
  trackEvent("User", "sign_up", method, undefined, { method });
};

/**
 * UI & Interaction events
 */
export const trackButtonClick = (buttonName: string, location?: string): void => {
  trackEvent("UI", "click_button", buttonName, undefined, {
    button_name: buttonName,
    location: location || window.location.pathname,
  });
};

export const trackFormSubmit = (formName: string, success: boolean = true): void => {
  trackEvent("Form", success ? "submit_success" : "submit_failure", formName, undefined, {
    form_name: formName,
  });
};

/**
 * Product-specific workflows
 */
export const trackAIChatStarted = (modelName?: string): void => {
  trackEvent("AI", "chat_started", modelName, undefined, {
    model: modelName || "default",
  });
};

export const trackFileUpload = (fileType: string, fileSizeMb?: number): void => {
  trackEvent("Storage", "file_upload", fileType, fileSizeMb, {
    file_type: fileType,
    file_size_mb: fileSizeMb,
  });
};

export const trackWorkspaceCreated = (workspaceName?: string): void => {
  trackEvent("Workspace", "workspace_created", workspaceName, undefined, {
    workspace_name: workspaceName,
  });
};

export const trackSubscriptionSuccess = (
  planName: string,
  value?: number,
  currency: string = "USD"
): void => {
  trackEvent("ECommerce", "purchase", planName, value, {
    plan: planName,
    currency,
    value,
  });
};

/**
 * Errors & Exception tracking
 */
export const trackError = (description: string, fatal: boolean = false): void => {
  if (!isInitialized) return;
  try {
    ReactGA.event("exception", {
      description,
      fatal,
    });
  } catch (error) {
    console.error("[GA4] Error tracking failed:", error);
  }
};