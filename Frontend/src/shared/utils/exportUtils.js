/**
 * Shared Export & Download Utilities
 */

export const downloadBlob = (content, filename, mimeType = 'text/plain') => {
  try {
    const blob = new Blob([content], { type: mimeType });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    return true;
  } catch (err) {
    console.error('[exportUtils] Download failed:', err);
    return false;
  }
};

export const exportToCSV = (data, filename = 'export.csv') => {
  if (!data || !data.length) return false;
  const headers = Object.keys(data[0]).join(',');
  const rows = data.map((item) =>
    Object.values(item)
      .map((val) => `"${String(val).replace(/"/g, '""')}"`)
      .join(',')
  );
  const csvContent = [headers, ...rows].join('\n');
  return downloadBlob(csvContent, filename, 'text/csv');
};
