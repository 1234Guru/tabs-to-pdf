import { Injectable } from '@angular/core';
import htmlToPdfmake from 'html-to-pdfmake';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

(pdfMake as any).vfs = (pdfFonts as any).pdfMake?.vfs || (pdfFonts as any).vfs;

@Injectable({ providedIn: 'root' })
export class PdfService {
  constructor() {}

  private async fetchToDataURL(src: string): Promise<string> {
    const res = await fetch(src, { mode: 'cors' });
    if (!res.ok) throw new Error(`Fetch failed: ${res.status} ${res.statusText}`);
    const blob = await res.blob();
    return await this.blobToDataURL(blob);
  }

  private blobToDataURL(blob: Blob): Promise<string> {
    return new Promise((res, rej) => {
      const reader = new FileReader();
      reader.onload = () => res(reader.result as string);
      reader.onerror = (err) => rej(err);
      reader.readAsDataURL(blob);
    });
  }

  private normalizeSrc(src: string): string {
    try {
      return new URL(src, window.location.href).href;
    } catch {
      return src;
    }
  }

  private async embedImages(htmlString: string): Promise<string> {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, 'text/html');

    const images = Array.from(doc.querySelectorAll('img')) as HTMLImageElement[];
    for (const img of images) {
      try {
        let src = img.getAttribute('src') || '';
        if (!src) { img.remove(); continue; }

        // 🔹 Base64 (Chart.js) images are already fine
        if (src.startsWith('data:image/')) {
          img.setAttribute('src', src);
          continue;
        }

        const absolute = this.normalizeSrc(src);
        let dataUrl: string | null = null;

        try {
          dataUrl = await this.fetchToDataURL(absolute);
        } catch {
          dataUrl = null;
        }

        if (!dataUrl) { img.remove(); continue; }
        img.setAttribute('src', dataUrl);
      } catch {
        img.remove();
      }
    }

    doc.querySelectorAll('canvas').forEach(c => c.remove());
    return doc.body.innerHTML;
  }

  async generatePdfFromHtml(htmlString: string, filename = 'tabs-content.pdf') {
    const safeHtml = await this.embedImages(htmlString);
    const pdfContent = htmlToPdfmake(safeHtml, { window: window } as any);
    const docDefinition: any = {
      content: pdfContent,
      defaultStyle: { fontSize: 12 },
    };
    try {
      pdfMake.createPdf(docDefinition).download(filename);
    } catch (err) {
      console.error('PDF creation error:', err);
      throw err;
    }
  }
}
