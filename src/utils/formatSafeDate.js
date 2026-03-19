import { format } from "date-fns";

export const formatSafeDate = (date, fallback = "N/A") => {
  try {
    return date ? format(new Date(date), "MM/dd/yyyy") : fallback;
  } catch {
    return fallback;
  }
};
export const formatSafeDateMinutes = (date, fallback = "N/A") => {
  try {
    return date ? format(new Date(date), "MM/dd/yyyy hh:mm") : fallback;
  } catch {
    return fallback;
  }
};
export const formatFrenchDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "numeric",
    year: "numeric",
  });
};
export const formatShortFrenchDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("fr-FR", {
    month: "long",
    year: "numeric",
  });
};
export const addOneYear = (date) => {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + 1);
  return newDate;
};
export const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ar-DZ", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};
// Calculate program duration in days
export const calculateDuration = (startDate, endDate) => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const diffTime = Math.abs(end - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1;

  // Format number in Arabic numerals
  const arabicNumber = diffDays.toLocaleString("ar");

  // Arabic pluralization rules
  if (diffDays === 1) {
    return `${arabicNumber} يوم`;
  } else if (diffDays === 2) {
    return `${arabicNumber} يومين`;
  } else if (diffDays >= 3 && diffDays <= 10) {
    return `${arabicNumber} أيام`;
  } else {
    return `${arabicNumber} يومًا`;
  }
};

export function timeToMinutes(value) {
  const normalized = normalizeTime(value);
  if (!normalized) return null;
  const parts = normalized.split(":");
  const hh = parseInt(parts[0], 10);
  const mm = parseInt(parts[1], 10);
  if (Number.isNaN(hh) || Number.isNaN(mm)) return null;
  return hh * 60 + mm;
}

export function formatTime(value) {
  const normalized = normalizeTime(value);
  return normalized || "";
}

function normalizeTime(value) {
  if (!value) return null;
  const d = new Date(value);
  if (!Number.isNaN(d.getTime())) {
    const hh = String(d.getHours()).padStart(2, "0");
    const mm = String(d.getMinutes()).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  const timeMatch = `${value}`.match(/^(\d{1,2}):(\d{2})$/);
  if (timeMatch) {
    const hh = String(parseInt(timeMatch[1], 10)).padStart(2, "0");
    const mm = String(parseInt(timeMatch[2], 10)).padStart(2, "0");
    return `${hh}:${mm}`;
  }
  return null;
}
