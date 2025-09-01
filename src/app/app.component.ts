import {
  Component,
  AfterViewInit,
  OnDestroy,
  ViewChild,
  ElementRef,
  Inject,
  PLATFORM_ID,
} from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { PdfService } from '../app/service/pdf.service';
import { Chart, ChartConfiguration, registerables } from 'chart.js';

Chart.register(...registerables);

interface Tab {
  id: string;
  title: string;
  html?: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit, OnDestroy {
  selectedIndex = 0;
  chartInstance: Chart | null = null;
  chartImage: string | null = null; // 🔹 Always store chart as base64

  @ViewChild('pieCanvas') pieCanvas!: ElementRef<HTMLCanvasElement>;

  tabs: Tab[] = [
    { id: 'tab-1', title: 'Tab One' },
    {
      id: 'tab-2',
      title: 'Tab Two',
      html: `
        <div class="profile-card-wrapper">
          <div class="profile-header">
         </div>
          <div class="profile-card">
            <div class="profile-avatar">SJ</div>
           
            <h2 class="profile-name">Samantha Jones</h2>
            <div class="profile-location">New York, United States</div>
            <p class="profile-role">
              Web Producer - Web Specialist<br/>
              Columbia University - New York
            </p>
            <table class="profile-stats">
              <tr>
                <td><div class="stat-value">65</div><div class="stat-label">Friends</div></td>
                <td><div class="stat-value">43</div><div class="stat-label">Photos</div></td>
                <td><div class="stat-value">21</div><div class="stat-label">Comments</div></td>
              </tr>
            </table>
            <div class="profile-cta">
              <a href="https://example.com/profile/samantha-jones" target="_blank" class="btn-show-more">Show more</a>
            </div>
          </div>
        </div>
      `,
    },
    {
      id: 'tab-3',
      title: 'Tab Three',
      html: `
            <h2>Social Platforms</h2>

        <div class="social-cards">

          <div class="card twitter">
            <div class="icon">🐦</div>
            <h6>TWITTER</h6>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ullam aliquid non eligendi, nemo est neque reiciendis error?</p>
            <a href="https://twitter.com" target="_blank" class="btn">READ MORE</a>
          </div>
          <div class="card instagram">
            <div class="icon">📷</div>
            <h6>INSTAGRAM</h6>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ullam aliquid non eligendi, nemo est neque reiciendis error?</p>
            <a href="https://instagram.com" target="_blank" class="btn">READ MORE</a>
          </div>
          <div class="card youtube">
            <div class="icon">▶️</div>
            <h6>YOUTUBE</h6>
            <p>Lorem ipsum dolor sit amet, consectetur adipisicing elit. Expedita ullam aliquid non eligendi, nemo est neque reiciendis error?</p>
            <a href="https://youtube.com" target="_blank" class="btn">READ MORE</a>
          </div>
        </div>
      `,
    },
  ];

  constructor(
    private pdf: PdfService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngAfterViewInit() {
    if (isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.renderChartOnce(), 500);
      // 🔹 Render chart only in browser
    }
  }

  ngOnDestroy() {
    this.destroyChart();
  }

  setIndex(i: number) {
    this.selectedIndex = i;
    if (i === 0 && isPlatformBrowser(this.platformId)) {
      setTimeout(() => this.renderChartOnce(), 50);
    }
  }

  private renderChartOnce() {
    if (!this.pieCanvas) return;

    this.destroyChart();
    const canvas = this.pieCanvas.nativeElement;
    const responsivePlugin = {
  id: "responsivePadding",
  resize(chart: any, size: any) {
    // Adjust padding dynamically based on size
    chart.options.layout = {
      padding: {  
        left: 0,
        right: size.width < 800 ? 50 : 500, // responsive padding
      },
    };
    chart.update();
  },
};

    const config: ChartConfiguration<'pie'> = {
      type: 'pie',
      data: {
        labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple'],
        datasets: [
          {
            data: [12, 19, 3, 5, 2],
            backgroundColor: [
              '#ff6384',
              '#36a2eb',
              '#ffcd56',
              '#4bc0c0',
              '#9966ff',
            ],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'right' } },
        layout: {
          padding: {
            left: 0,
            right: 0, // start with 0
          },
        },
      },
       plugins: [responsivePlugin],
    };

    this.chartInstance = new Chart(canvas, config);

    // 🔹 Capture base64 image for PDF
    setTimeout(() => {
      this.chartImage = this.chartInstance?.toBase64Image() || null;
    }, 500);
  }

  private destroyChart() {
    if (this.chartInstance) {
      this.chartInstance.destroy();
      this.chartInstance = null;
    }
  }

  private getAllTabsHtml(): string {
    const tab1Html = this.chartImage
      ? `<h2>Simple Pie Chart</h2>
         <p>This tab includes a pie chart rendered with Chart.js.</p>
         <img src="${this.chartImage}" style="max-width:100%;height:auto;border-radius:8px;"/>`
      : '';

    const others = this.tabs
      .filter((_, i) => i !== 0)
      .map((t) => `<div class="tab-page">${t.html}</div>`)
      .join('');

    return `<div class="tab-page">${tab1Html}</div>` + others;
  }

  async downloadPdf() {
    const html = this.getAllTabsHtml();
    await this.pdf.generatePdfFromHtml(html, 'tabs-export.pdf');
  }
}
