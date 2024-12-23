import ReactGA from "react-ga4";
import { supabase } from "./supabase";

export const initGA = () => {
  const measurementId = import.meta.env.VITE_GA_MEASUREMENT_ID;
  if (!measurementId) {
    console.warn("GA_MEASUREMENT_ID not found, analytics will be disabled");
    return;
  }
  ReactGA.initialize(measurementId);
};

export const logPageView = () => {
  if (!import.meta.env.VITE_GA_MEASUREMENT_ID) return;
  ReactGA.send({ hitType: "pageview", page: window.location.pathname });

  // Also log to our analytics system
  trackEvent("page_view", { path: window.location.pathname });
};

export const logEvent = async (
  category: string,
  action: string,
  label?: string,
) => {
  if (!import.meta.env.VITE_GA_MEASUREMENT_ID) return;

  // Log to Google Analytics
  ReactGA.event({
    category,
    action,
    label,
  });

  // Log to our analytics system
  await trackEvent(action, { category, label });
};

export const trackEvent = async (eventType: string, eventData: any = {}) => {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const { error } = await supabase.from("analytics_events").insert([
      {
        event_type: eventType,
        event_data: eventData,
        user_id: user?.id,
      },
    ]);

    if (error) throw error;
  } catch (error) {
    console.error("Error tracking event:", error);
  }
};

export const getAnalytics = async (timeRange: number = 30) => {
  try {
    const [revenue, occupancy] = await Promise.all([
      supabase.rpc("get_revenue_over_time", { days: timeRange }),
      supabase.rpc("get_occupancy_over_time", { days: timeRange }),
    ]);

    return {
      revenue: revenue.data || [],
      occupancy: occupancy.data || [],
    };
  } catch (error) {
    console.error("Error fetching analytics:", error);
    return { revenue: [], occupancy: [] };
  }
};
