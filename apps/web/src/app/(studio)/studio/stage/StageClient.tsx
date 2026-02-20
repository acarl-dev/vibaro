"use client";

import { useState, useEffect } from "react";
import {
  getActiveSpotlight,
  getAllSpotlights,
  createSpotlight,
  activateSpotlight,
  endSpotlight,
  getAllTrackingLinks,
  createCampaign,
  createTrackingLink,
  deleteTrackingLink,
  getAnalytics,
  type Spotlight,
  type TrackingLink,
  type AnalyticsData,
} from "@/lib/api/stage";

import FocusSection from "./FocusSection";
import SpreadSection, { PLATFORMS } from "./SpreadSection";
import ActiveSpreadList from "./ActiveSpreadList";
import MiniPerformanceSummary from "./MiniPerformanceSummary";

export default function StageClient() {
  const [activeSpotlight, setActiveSpotlight] = useState<Spotlight | null>(null);
  const [allSpotlights, setAllSpotlights] = useState<Spotlight[]>([]);
  const [trackingLinks, setTrackingLinks] = useState<TrackingLink[]>([]);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(false);
  const [generatingPlatform, setGeneratingPlatform] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  async function loadData() {
    try {
      setLoading(true);
      const [active, all, links] = await Promise.all([
        getActiveSpotlight(),
        getAllSpotlights(),
        getAllTrackingLinks(),
      ]);
      setActiveSpotlight(active);
      setAllSpotlights(all);
      setTrackingLinks(links);

      // Load analytics in background if there's an active spotlight
      if (active) {
        loadAnalytics(active.id);
      }
    } catch (error) {
      console.error("Failed to load data:", error);
    } finally {
      setLoading(false);
    }
  }

  async function loadAnalytics(spotlightId: number) {
    try {
      setAnalyticsLoading(true);
      const data = await getAnalytics("7d", spotlightId);
      setAnalytics(data);
    } catch {
      // Non-critical – silently fail
      setAnalytics(null);
    } finally {
      setAnalyticsLoading(false);
    }
  }

  // ── Focus handlers ──

  async function handleCreateFocus(data: {
    title: string;
    type: "release" | "tour" | "announcement" | "other";
    primary_url: string;
  }) {
    const result = await createSpotlight({
      title: data.title,
      type: data.type,
      primary_url: data.primary_url,
    });

    // Activate immediately
    if (result.status === "scheduled") {
      await activateSpotlight(result.id);
    }

    await loadData();
  }

  async function handleChangeFocus(id: number) {
    await activateSpotlight(id);
    await loadData();
  }

  async function handleEndFocus() {
    if (!activeSpotlight) return;
    await endSpotlight(activeSpotlight.id);
    setAnalytics(null);
    await loadData();
  }

  // ── Spread handlers ──

  async function handleGenerateLink(platformId: string, label: string) {
    if (!activeSpotlight) return;

    const platform = PLATFORMS.find((p) => p.id === platformId);
    if (!platform) return;

    try {
      setGeneratingPlatform(platformId);

      // 1. Create campaign (internal – user never sees this)
      const campaign = await createCampaign({
        name: `${label} — ${activeSpotlight.title}`,
        platform: platform.utmSource,
        spotlight_id: activeSpotlight.id,
      });

      // 2. Create the link
      const link = await createTrackingLink({
        module: "share",
        label,
        target_url: activeSpotlight.primary_url,
        spotlight_id: activeSpotlight.id,
        campaign_id: campaign.id,
        utm_source: platform.utmSource,
        utm_medium: platform.utmMedium,
        utm_campaign: activeSpotlight.title.toLowerCase().replace(/\s+/g, "-"),
      });

      await loadData();

      // Auto-copy to clipboard
      try {
        await navigator.clipboard.writeText(link.tracking_url);
      } catch {
        // clipboard may not be available
      }
    } catch (error: any) {
      alert(error.message || "Konnte nicht erstellt werden.");
    } finally {
      setGeneratingPlatform(null);
    }
  }

  async function handleCopyLink(url: string) {
    try {
      await navigator.clipboard.writeText(url);
    } catch {
      alert("Kopieren fehlgeschlagen.");
    }
  }

  async function handleDeleteLink(id: number) {
    await deleteTrackingLink(id);
    await loadData();
  }

  // ── Render ──

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-zinc-500 text-sm">Lädt…</div>
      </div>
    );
  }

  return (
    <div className="space-y-10 max-w-3xl mx-auto">
      {/* Section 1 – Fokus */}
      <FocusSection
        activeSpotlight={activeSpotlight}
        allSpotlights={allSpotlights}
        totalClicks7d={analytics?.total_clicks ?? 0}
        onCreateFocus={handleCreateFocus}
        onChangeFocus={handleChangeFocus}
        onEndFocus={handleEndFocus}
      />

      {/* Section 2 – Verbreiten (only when focus is set) */}
      {activeSpotlight && (
        <SpreadSection
          disabled={!activeSpotlight}
          generatingPlatform={generatingPlatform}
          onGenerateLink={handleGenerateLink}
        />
      )}

      {/* Section 3 – Aktive Verbreitung */}
      <ActiveSpreadList
        links={trackingLinks}
        onCopy={handleCopyLink}
        onDelete={handleDeleteLink}
      />

      {/* Section 4 – Ergebnisse (compact) */}
      {activeSpotlight && (
        <MiniPerformanceSummary
          analytics={analytics}
          loading={analyticsLoading}
        />
      )}
    </div>
  );
}
