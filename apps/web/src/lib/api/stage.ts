/**
 * API client utilities for Spotlight and Tracking Links (client-side)
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000';

export interface Spotlight {
  id: number;
  title: string;
  type: 'release' | 'tour' | 'announcement' | 'other';
  status: 'scheduled' | 'active' | 'ended';
  starts_at: string | null;
  ends_at: string | null;
  primary_url: string;
  description: string | null;
  show_on_page?: boolean;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: number;
  name: string;
  platform: string | null;
  notes: string | null;
  spotlight_id: number | null;
  spotlight_title?: string;
  starts_at: string | null;
  ends_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface TrackingLink {
  id: number;
  slug: string;
  module: string;
  label: string;
  target_url: string;
  tracking_url: string;
  spotlight_id: number | null;
  spotlight_title?: string;
  campaign_id: number | null;
  campaign_name?: string;
  platform?: string;
  placement?: string;
  click_count?: number;
  archived_at?: string | null;
  is_active: boolean;
  created_at: string;
}

export interface AnalyticsData {
  range: string;
  spotlight_id: number | null;
  campaign_id: number | null;
  total_clicks: number;
  by_module: Array<{ module: string; clicks: number }>;
  by_referrer: Array<{ referrer: string; clicks: number }>;
  trend: Array<{ date: string; clicks: number }>;
}

export interface StudioHomeData {
  spotlight: {
    id: number;
    title: string;
    type: string;
    status: string;
    activated_at: string;
    days_active: number;
    show_on_page: boolean;
  } | null;
  stats: {
    total_clicks_7d: number;
    trend: number;
  };
  top_links: {
    id: number;
    platform: string;
    placement: string;
    tracking_url: string;
    click_count: number;
  }[];
  page: {
    handle: string;
    is_published: boolean;
    display_name: string;
    updated_at: string;
  } | null;
  tip: {
    type: string;
    message: string;
    action_label: string;
    action_type: string;
    action_payload: Record<string, any>;
  } | null;
}

export interface AnalyticsBreakdown {
  total_clicks: number;
  trend: number;
  period: string;
  by_platform: {
    platform: string;
    clicks: number;
    placements: {
      placement: string;
      clicks: number;
    }[];
  }[];
}

export interface DuplicateCheckResult {
  exists: boolean;
  link?: TrackingLink | null;
}

/**
 * Get auth token from cookie (client-side)
 */
function getTokenFromCookie(): string | null {
  if (typeof document === 'undefined') return null;
  
  const cookies = document.cookie.split(';');
  const tokenCookie = cookies.find(c => c.trim().startsWith('vibaro_token='));
  
  if (!tokenCookie) return null;
  
  const encodedToken = tokenCookie.split('=')[1];
  // Decode URL-encoded token (e.g., %7C becomes |)
  return decodeURIComponent(encodedToken);
}

/**
 * Client-side fetch helper with auth
 */
async function apiFetch(path: string, init?: RequestInit): Promise<Response> {
  const token = getTokenFromCookie();
  
  // DEBUG: Log token status
  console.log('[DEBUG] All cookies:', document.cookie);
  console.log('[DEBUG] Token from cookie:', token ? `${token.substring(0, 20)}...` : 'NOT FOUND');
  
  const headers = new Headers(init?.headers || {});
  
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
    console.log('[DEBUG] Authorization header set');
  } else {
    console.warn('[DEBUG] No token found, request will be unauthorized');
  }
  
  if (init?.body && typeof init.body === 'string' && !headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }
  
  return fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    credentials: 'include', // Required for Sanctum stateful auth with cookies
  });
}

// ============================================
// Spotlight API
// ============================================

export async function getActiveSpotlight(): Promise<Spotlight | null> {
  const res = await apiFetch('/api/v1/spotlights/active');
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch active spotlight:', res.status, errorText);
    throw new Error(`Failed to fetch active spotlight: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}

export async function getAllSpotlights(): Promise<Spotlight[]> {
  const res = await apiFetch('/api/v1/spotlights');
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch spotlights:', res.status, errorText);
    throw new Error(`Failed to fetch spotlights: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}

export async function createSpotlight(data: {
  title: string;
  type: string;
  starts_at?: string;
  ends_at?: string;
  primary_url: string;
  description?: string;
}): Promise<{ id: number; status: string }> {
  const res = await apiFetch('/api/v1/spotlights', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to create spotlight');
  }
  
  const json = await res.json();
  return json.data;
}

export async function updateSpotlight(
  id: number,
  data: Partial<{
    title: string;
    type: string;
    starts_at: string | null;
    ends_at: string | null;
    primary_url: string;
    description: string | null;
  }>
): Promise<void> {
  const res = await apiFetch(`/api/v1/spotlights/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to update spotlight');
  }
}

export async function activateSpotlight(id: number): Promise<void> {
  const res = await apiFetch(`/api/v1/spotlights/${id}/activate`, {
    method: 'POST',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to activate spotlight');
  }
}

export async function endSpotlight(id: number): Promise<void> {
  const res = await apiFetch(`/api/v1/spotlights/${id}/end`, {
    method: 'POST',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to end spotlight');
  }
}

// ============================================
// Campaigns API
// ============================================

export async function getAllCampaigns(): Promise<Campaign[]> {
  const res = await apiFetch('/api/v1/campaigns');
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch campaigns:', res.status, errorText);
    throw new Error(`Failed to fetch campaigns: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}

export async function createCampaign(data: {
  name: string;
  platform?: string;
  notes?: string;
  spotlight_id?: number;
  starts_at?: string;
  ends_at?: string;
}): Promise<{ id: number; name: string }> {
  const res = await apiFetch('/api/v1/campaigns', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to create campaign');
  }
  
  const json = await res.json();
  return json.data;
}

export async function updateCampaign(
  id: number,
  data: Partial<{
    name: string;
    platform: string | null;
    notes: string | null;
    spotlight_id: number | null;
    starts_at: string | null;
    ends_at: string | null;
  }>
): Promise<void> {
  const res = await apiFetch(`/api/v1/campaigns/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to update campaign');
  }
}

export async function deleteCampaign(id: number): Promise<void> {
  const res = await apiFetch(`/api/v1/campaigns/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to delete campaign');
  }
}

// ============================================
// Tracking Links API
// ============================================

export async function getAllTrackingLinks(): Promise<TrackingLink[]> {
  const res = await apiFetch('/api/v1/tracking-links');
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch tracking links:', res.status, errorText);
    throw new Error(`Failed to fetch tracking links: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}

export async function createTrackingLink(data: {
  spotlight_id: number;
  platform: string;
  placement: string;
  target_url: string;
}): Promise<TrackingLink> {
  const res = await apiFetch('/api/v1/tracking-links', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to create tracking link');
  }
  
  const json = await res.json();
  return json.data;
}

export async function deleteTrackingLink(id: number): Promise<void> {
  const res = await apiFetch(`/api/v1/tracking-links/${id}`, {
    method: 'DELETE',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to delete tracking link');
  }
}

// ============================================
// Analytics API
// ============================================

export async function getAnalytics(
  range: '7d' | '30d' = '7d',
  spotlightId?: number,
  campaignId?: number
): Promise<AnalyticsData> {
  const params = new URLSearchParams({ range });
  
  if (spotlightId) {
    params.set('spotlight_id', spotlightId.toString());
  }
  
  if (campaignId) {
    params.set('campaign_id', campaignId.toString());
  }
  
  const res = await apiFetch(`/api/v1/analytics/overview?${params.toString()}`);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch analytics:', res.status, errorText);
    throw new Error(`Failed to fetch analytics: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}

// ============================================
// Studio Home API (Phase 2)
// ============================================

export async function getStudioHome(): Promise<StudioHomeData> {
  const res = await apiFetch('/api/v1/studio/home');
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch studio home:', res.status, errorText);
    throw new Error(`Failed to fetch studio home: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}

export async function checkTrackingLink(
  spotlightId: number,
  platform: string,
  placement: string
): Promise<DuplicateCheckResult> {
  const params = new URLSearchParams({
    spotlight_id: spotlightId.toString(),
    platform,
    placement,
  });
  
  const res = await apiFetch(`/api/v1/tracking-links/check?${params.toString()}`);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to check tracking link:', res.status, errorText);
    throw new Error(`Failed to check tracking link: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}

export async function archiveTrackingLink(id: number): Promise<TrackingLink> {
  const res = await apiFetch(`/api/v1/tracking-links/${id}/archive`, {
    method: 'PATCH',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to archive tracking link');
  }
  
  const json = await res.json();
  return json.data;
}

export async function getAnalyticsBreakdown(
  spotlightId: number,
  period: string = '7d'
): Promise<AnalyticsBreakdown> {
  const params = new URLSearchParams({
    spotlight_id: spotlightId.toString(),
    period,
  });
  
  const res = await apiFetch(`/api/v1/analytics/breakdown?${params.toString()}`);
  
  if (!res.ok) {
    const errorText = await res.text();
    console.error('Failed to fetch analytics breakdown:', res.status, errorText);
    throw new Error(`Failed to fetch analytics breakdown: ${res.status}`);
  }
  
  const json = await res.json();
  return json.data;
}

export async function toggleShowOnPage(spotlightId: number): Promise<Spotlight> {
  const res = await apiFetch(`/api/v1/spotlights/${spotlightId}/show-on-page`, {
    method: 'PATCH',
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to toggle show on page');
  }
  
  const json = await res.json();
  return json.data;
}

export async function updateVisibleSections(
  pageId: number,
  sections: string[]
): Promise<void> {
  const res = await apiFetch(`/api/v1/artist-pages/${pageId}/sections`, {
    method: 'PATCH',
    body: JSON.stringify({ visible_sections: sections }),
  });
  
  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.error?.message || 'Failed to update visible sections');
  }
}
