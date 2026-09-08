'use client';

import { useState } from 'react';
import { useTranslations } from 'next-intl';
import { NavIcon } from '@/components/icons';
import type { Locale } from '@/i18n/routing';

/**
 * PDF export, with a fallback chain.
 *
 * 1. html2canvas + jsPDF, both installed from npm and bundled — never a CDN.
 *    The prototype learned this the hard way: CDN scripts get blocked in
 *    sandboxed contexts and the export silently does nothing.
 * 2. Browser print-to-PDF, driven by the print stylesheet in globals.css. That
 *    needs no network and no download permission, so it works where the first
 *    path is blocked outright.
 *
 * Why rasterise rather than lay out text: jsPDF's built-in fonts cannot shape
 * Arabic script — an Arabic CV comes out as disconnected letters in the wrong
 * order, which is worse than useless. Rendering the DOM to a canvas is what
 * makes the Arabic export correct. The cost is that text in the PDF is not
 * selectable; if employers turn out to need to copy text out, that means
 * embedding an Arabic-capable font and doing the layout in code, which is a
 * significantly larger job and only worth it on evidence.
 *
 * The libraries are loaded with a dynamic import so neither ships in the main
 * bundle — most people never export anything.
 */
export function PdfExport({
  targetId,
  fileName,
  documentLocale,
}: {
  targetId: string;
  /** Named for the *document's* language, not the app's. */
  fileName: string;
  documentLocale: Locale;
}) {
  const t = useTranslations('common');
  const [busy, setBusy] = useState(false);
  const [failed, setFailed] = useState(false);

  async function download() {
    const element = document.getElementById(targetId);
    if (!element) return;

    setBusy(true);
    setFailed(false);

    try {
      const [{ default: html2canvas }, { jsPDF }] = await Promise.all([
        import('html2canvas'),
        import('jspdf'),
      ]);

      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });

      const pdf = new jsPDF({ unit: 'mm', format: 'a4', orientation: 'portrait' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const margin = 10;
      const usableWidth = pageWidth - margin * 2;
      const scaledHeight = (canvas.height * usableWidth) / canvas.width;

      // Multi-page: slice the rendered canvas across as many A4 pages as it
      // needs. A long CV is the normal case, not an edge case.
      let remaining = scaledHeight;
      let offset = 0;
      const image = canvas.toDataURL('image/jpeg', 0.95);

      while (remaining > 0) {
        if (offset > 0) pdf.addPage();
        pdf.addImage(
          image,
          'JPEG',
          margin,
          margin - offset,
          usableWidth,
          scaledHeight,
          undefined,
          'FAST',
        );
        remaining -= pageHeight - margin * 2;
        offset += pageHeight - margin * 2;
      }

      pdf.save(`${fileName}.pdf`);
    } catch {
      // Blocked or unavailable — fall back to print, which needs neither the
      // network nor permission to write a file.
      setFailed(true);
      window.print();
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="no-print flex flex-wrap gap-2" dir={documentLocale === 'ar' ? 'rtl' : 'ltr'}>
      <button type="button" onClick={download} disabled={busy} className="btn-secondary !w-auto flex-1">
        <span className="inline-flex items-center gap-1.5">
          <NavIcon name="upload" className="h-4 w-4 rotate-180" />
          {busy ? t('loading') : t('exportPdf')}
        </span>
      </button>

      <button
        type="button"
        onClick={() => window.print()}
        className="rounded-[13px] border border-line px-4 py-[11.5px] text-sm font-semibold text-ink-soft"
      >
        {t('print')}
      </button>

      {failed && (
        <p className="w-full text-center text-[11.5px] text-ink-faint">{t('exportFellBack')}</p>
      )}
    </div>
  );
}
