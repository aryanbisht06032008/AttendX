/**
 * Minimal client-side CSV export helpers.
 * - Escapes commas, quotes and newlines per RFC 4180.
 * - Prepends a UTF-8 BOM so Excel renders special characters correctly.
 */

function escapeCell(value) {
  const cell = value === null || value === undefined ? "" : String(value);

  return /[",\n\r]/.test(cell) ? `"${cell.replace(/"/g, '""')}"` : cell;
}

export function toCsv(rows) {
  return rows.map((row) => row.map(escapeCell).join(",")).join("\r\n");
}

export function downloadCsv({ filename, rows }) {
  const csv = `\uFEFF${toCsv(rows)}`;

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);

  URL.revokeObjectURL(url);
}

export function csvFilename(prefix) {
  const date = new Date().toISOString().slice(0, 10);
  return `${prefix}-${date}.csv`;
}
