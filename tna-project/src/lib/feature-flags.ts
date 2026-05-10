/**
 * Feature Flags Module
 *
 * Centralized toggle management for incremental rollout of UX refactor features.
 * Flags can be tied to environment variables, remote config, or static booleans.
 *
 * Usage:
 *   import { FEATURE_FLAGS } from '@/lib/feature-flags';
 *   if (FEATURE_FLAGS.KYC_FLOW_ENABLED) { ... }
 */

export type FeatureFlagKey =
  | 'KYC_FLOW_ENABLED'
  | 'TNA_ISSUANCE_REFACTOR'
  | 'ADDRESS_SEARCH_REFACTOR'
  | 'BINDING_FINANCIALS'
  | 'PAYMENT_CHECKOUT_V2'
  | 'GOV_TNA_QUEUE_SPLIT'
  | 'GOV_ADDRESS_QUEUE'
  | 'GOV_ADJUSTMENTS_QUEUE'
  | 'CARRIER_RESOLVER'
  | 'CARRIER_STAFF_MANAGEMENT'
  | 'OWNER_PROPERTY_DEED_REQUIRED'
  | 'DEPRECATED_ROUTES_DISABLED';

interface FeatureFlagConfig {
  [key: string]: boolean;
}

/**
 * Static feature flag configuration.
 *
 * In production, these could be fetched from a remote config service
 * or controlled via environment variables.
 */
const defaultFlags: FeatureFlagConfig = {
  // Visitor flows
  KYC_FLOW_ENABLED: true,              // KYC document upload page
  TNA_ISSUANCE_REFACTOR: true,         // New TNA request wizard
  ADDRESS_SEARCH_REFACTOR: true,       // Enhanced address discovery
  BINDING_FINANCIALS: true,            // Full contract breakdown on binding detail
  PAYMENT_CHECKOUT_V2: true,           // Refactored checkout with rent_contracts

  // Government flows
  GOV_TNA_QUEUE_SPLIT: true,           // Separate TNA queue (not merged with address)
  GOV_ADDRESS_QUEUE: true,             // New address verification queue
  GOV_ADJUSTMENTS_QUEUE: true,         // Settlement adjustment approval

  // Carrier flows
  CARRIER_RESOLVER: true,              // TNA resolver page
  CARRIER_STAFF_MANAGEMENT: true,      // Staff roster (renamed from fleet)

  // Owner flows
  OWNER_PROPERTY_DEED_REQUIRED: true,  // Enforce title_deed_reference on property creation

  // Deprecations
  DEPRECATED_ROUTES_DISABLED: true,    // Old routes return 404/redirect
};

/**
 * Environment override keys (NEXT_PUBLIC_ prefixed for client-side access)
 */
const envFlagMap: Record<FeatureFlagKey, string> = {
  KYC_FLOW_ENABLED: 'NEXT_PUBLIC_FEATURE_KYC',
  TNA_ISSUANCE_REFACTOR: 'NEXT_PUBLIC_FEATURE_TNA_ISSUANCE',
  ADDRESS_SEARCH_REFACTOR: 'NEXT_PUBLIC_FEATURE_ADDRESS_SEARCH',
  BINDING_FINANCIALS: 'NEXT_PUBLIC_FEATURE_BINDING_FINANCIALS',
  PAYMENT_CHECKOUT_V2: 'NEXT_PUBLIC_FEATURE_CHECKOUT_V2',
  GOV_TNA_QUEUE_SPLIT: 'NEXT_PUBLIC_FEATURE_GOV_TNA_QUEUE',
  GOV_ADDRESS_QUEUE: 'NEXT_PUBLIC_FEATURE_GOV_ADDRESS_QUEUE',
  GOV_ADJUSTMENTS_QUEUE: 'NEXT_PUBLIC_FEATURE_GOV_ADJUSTMENTS',
  CARRIER_RESOLVER: 'NEXT_PUBLIC_FEATURE_CARRIER_RESOLVER',
  CARRIER_STAFF_MANAGEMENT: 'NEXT_PUBLIC_FEATURE_CARRIER_STAFF',
  OWNER_PROPERTY_DEED_REQUIRED: 'NEXT_PUBLIC_FEATURE_OWNER_DEED_REQUIRED',
  DEPRECATED_ROUTES_DISABLED: 'NEXT_PUBLIC_FEATURE_DEPRECATED_DISABLED',
};

/**
 * Resolve feature flag value: env var > default config
 */
function resolveFlag(key: FeatureFlagKey): boolean {
  const envVar = envFlagMap[key];
  if (envVar && process.env[envVar] !== undefined) {
    const envValue = process.env[envVar].toLowerCase();
    return envValue === 'true' || envValue === '1';
  }
  return defaultFlags[key];
}

/**
 * Public API: Feature flag getter
 */
export const FEATURE_FLAGS = Object.keys(defaultFlags).reduce((acc, key) => {
  acc[key as FeatureFlagKey] = resolveFlag(key as FeatureFlagKey);
  return acc;
}, {} as Record<FeatureFlagKey, boolean>);

/**
 * Hook for reactive feature flag checking (optional enhancement with context)
 */
export function useFeatureFlag(key: FeatureFlagKey): boolean {
  // For static flags, return directly.
  // For dynamic remote config, integrate with React Context/State here.
  return FEATURE_FLAGS[key];
}

/**
 * Utility: Check if ALL specified flags are enabled
 */
export function allEnabled(keys: FeatureFlagKey[]): boolean {
  return keys.every(key => FEATURE_FLAGS[key]);
}

/**
 * Utility: Check if ANY specified flag is enabled
 */
export function anyEnabled(keys: FeatureFlagKey[]): boolean {
  return keys.some(key => FEATURE_FLAGS[key]);
}
