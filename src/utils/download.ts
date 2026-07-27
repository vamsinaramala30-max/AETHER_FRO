/**
 * Triggers client file download programmatically given a string/blob content.
 */
export const downloadFile = (data: Blob | string, filename: string, mimeType?: string): void => {
  const type =
    typeof mimeType === 'string' && mimeType.trim() !== '' ? mimeType : 'text/plain;charset=utf-8';
  const blob = typeof data === 'string' ? new Blob([data], { type }) : data;

  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
