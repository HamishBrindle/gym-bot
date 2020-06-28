import fileSaver from 'file-saver';

/**
 * Allows downloading report data generated on client-side.
 */
class ReportDownloader {
  /**
   * Downloads data as CSV file.
   * @param filename without extensions
   * @param data
   */
  downloadCsv(filename: string, data: string[][]): void {
    const csv = this.convertDataToCsv(data);
    // \uFEFF is byte order mark (BOM) for UTF 16, but will work for UTF-8 as well
    const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8' });
    fileSaver.saveAs(blob, `${filename}.csv`);
  }

  /**
   * Converts 2D array data to CSV string.
   * @param data
   * @return csv string
   */
  convertDataToCsv(data: string[][]): string {
    let csv = '';
    data.forEach((row) => {
      row.forEach((col, i) => {
        if (typeof col === 'number') {
          csv += col;
        } else if (typeof col === 'string') {
          csv += `"${col.replace('"', '""')}"`;
        }

        if (i < row.length - 1) {
          csv += ',';
        }
      });
      csv += '\n';
    });
    return csv;
  }
}

export { ReportDownloader };
export default new ReportDownloader();
