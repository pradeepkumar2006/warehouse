/**
 * Shared Formatting Utilities
 */

export const formatPercent = (val, decimals = 1) => {
  if (val === null || val === undefined) return '0%';
  return `${Number(val).toFixed(decimals)}%`;
};

export const formatDuration = (minutes) => {
  if (!minutes && minutes !== 0) return '0 min';
  return `${minutes} min`;
};

export const formatBytes = (bytes, decimals = 2) => {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
};

export const formatNumber = (num) => {
  if (num === null || num === undefined) return '0';
  return new Intl.NumberFormat().format(num);
};
