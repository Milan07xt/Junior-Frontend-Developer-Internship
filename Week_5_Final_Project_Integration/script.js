/**
 * NexusOps Enterprise Cloud Dashboard - Application Engine
 * Vanilla JavaScript (ES6+) - High Performance, Zero Dependencies, WCAG AAA Accessible
 */

(function () {
  'use strict';

  // --- Embedded Telemetry Data (Ensures 100% offline functionality if file:// protocol blocks fetch) ---
  const FALLBACK_TELEMETRY_DATA = {
    systemMetrics: {
      overallHealth: "Operational",
      uptimeSla: 99.98,
      activeNodesCount: 24,
      totalContainers: 482,
      avgResponseTimeMs: 38,
      totalRequestsToday: "48.2M",
      cpuUsagePct: 42.6,
      memoryUsagePct: 68.4,
      diskUsagePct: 54.1,
      bandwidthThroughputGbps: 18.4
    },
    trafficTimeline: {
      "1h": [
        { time: "15:00", requests: 28400, latency: 34 },
        { time: "15:10", requests: 31200, latency: 36 },
        { time: "15:20", requests: 29800, latency: 35 },
        { time: "15:30", requests: 44100, latency: 48 },
        { time: "15:40", requests: 38900, latency: 42 },
        { time: "15:50", requests: 35600, latency: 38 },
        { time: "16:00", requests: 42000, latency: 41 }
      ],
      "24h": [
        { time: "00:00", requests: 14200, latency: 28 },
        { time: "04:00", requests: 11500, latency: 26 },
        { time: "08:00", requests: 38400, latency: 42 },
        { time: "12:00", requests: 52600, latency: 49 },
        { time: "16:00", requests: 48100, latency: 44 },
        { time: "20:00", requests: 34800, latency: 38 }
      ],
      "7d": [
        { time: "Mon", requests: 380000, latency: 36 },
        { time: "Tue", requests: 420000, latency: 39 },
        { time: "Wed", requests: 480000, latency: 42 },
        { time: "Thu", requests: 460000, latency: 41 },
        { time: "Fri", requests: 510000, latency: 45 },
        { time: "Sat", requests: 290000, latency: 32 },
        { time: "Sun", requests: 260000, latency: 30 }
      ],
      "30d": [
        { time: "W1", requests: 2650000, latency: 37 },
        { time: "W2", requests: 2890000, latency: 40 },
        { time: "W3", requests: 3120000, latency: 42 },
        { time: "W4", requests: 3480000, latency: 44 }
      ]
    },
    clusters: [
      { id: "node-us-east-01", name: "Apex-Primary-US-East", region: "US-East (N. Virginia)", status: "operational", cpuUsage: 48.2, memoryUsage: 72.4, activeConnections: 14200, diskIo: "420 MB/s", uptimeDays: 142 },
      { id: "node-us-east-02", name: "Apex-Secondary-US-East", region: "US-East (Ohio)", status: "operational", cpuUsage: 38.6, memoryUsage: 61.2, activeConnections: 9800, diskIo: "310 MB/s", uptimeDays: 89 },
      { id: "node-eu-west-01", name: "Apex-Core-EU-West", region: "EU-West (Frankfurt)", status: "operational", cpuUsage: 54.1, memoryUsage: 78.5, activeConnections: 18400, diskIo: "580 MB/s", uptimeDays: 210 },
      { id: "node-eu-west-02", name: "Apex-Worker-EU-West", region: "EU-West (Ireland)", status: "degraded", cpuUsage: 89.4, memoryUsage: 94.2, activeConnections: 22100, diskIo: "820 MB/s", uptimeDays: 14 },
      { id: "node-ap-south-01", name: "Apex-Gateway-AP-South", region: "AP-South (Mumbai)", status: "operational", cpuUsage: 41.5, memoryUsage: 64.8, activeConnections: 12600, diskIo: "340 MB/s", uptimeDays: 64 },
      { id: "node-ap-east-01", name: "Apex-Edge-AP-East", region: "AP-East (Tokyo)", status: "operational", cpuUsage: 32.8, memoryUsage: 55.4, activeConnections: 8400, diskIo: "290 MB/s", uptimeDays: 115 },
      { id: "node-sa-east-01", name: "Apex-Worker-SA-East", region: "SA-East (São Paulo)", status: "maintenance", cpuUsage: 12.0, memoryUsage: 24.1, activeConnections: 420, diskIo: "45 MB/s", uptimeDays: 2 },
      { id: "node-ca-central-01", name: "Apex-Vault-CA-Central", region: "CA-Central (Montreal)", status: "operational", cpuUsage: 29.4, memoryUsage: 48.7, activeConnections: 6200, diskIo: "210 MB/s", uptimeDays: 180 }
    ],
    deployments: [
      { id: "dep-v4.8.2", service: "auth-gateway-service", version: "v4.8.2", author: "Marcus Chen", commitHash: "8f3b92c", status: "success", durationSeconds: 48, coveragePct: 98.4, timestamp: "10 minutes ago" },
      { id: "dep-v3.1.9", service: "vector-search-engine", version: "v3.1.9", author: "Elena Vance", commitHash: "4a1c78e", status: "success", durationSeconds: 72, coveragePct: 96.8, timestamp: "42 minutes ago" },
      { id: "dep-v5.0.0", service: "distributed-cache-pool", version: "v5.0.0-rc", author: "DevOps Pipeline", commitHash: "e92f11a", status: "in_progress", durationSeconds: 24, coveragePct: 94.2, timestamp: "Just now" },
      { id: "dep-v2.9.4", service: "billing-webhooks-relay", version: "v2.9.4", author: "Sarah Jenkins", commitHash: "7c8d23b", status: "failed", durationSeconds: 31, coveragePct: 88.5, timestamp: "2 hours ago" }
    ],
    securityAlerts: [
      { id: "sec-9942", severity: "critical", event: "Anomalous Traffic Spike (DDoS Mitigation Engaged)", affectedNode: "node-eu-west-02", timestamp: "14 minutes ago", status: "Mitigating" },
      { id: "sec-9941", severity: "warning", event: "Memory Pool Saturation Threshold > 90%", affectedNode: "node-eu-west-02", timestamp: "28 minutes ago", status: "Active" },
      { id: "sec-9940", severity: "normal", event: "Automated TLS Certificate Rotation Completed", affectedNode: "node-us-east-01", timestamp: "1 hour ago", status: "Resolved" },
      { id: "sec-9939", severity: "normal", event: "Scheduled Database Snapshot Replicated to Cold Vault", affectedNode: "node-ca-central-01", timestamp: "3 hours ago", status: "Resolved" }
    ]
  };

  // --- Global Application State ---
  const state = {
    data: null,
    activeTab: 'overview',
    chart: {
      timeframe: '24h',
      metric: 'requests' // 'requests' | 'latency'
    },
    table: {
      searchQuery: '',
      statusFilter: 'all',
      regionFilter: 'all',
      sortColumn: 'id',
      sortDirection: 'asc', // 'asc' | 'desc'
      currentPage: 1,
      pageSize: 8
    },
    selectedNode: null,
    lastFocusedElement: null
  };

  // --- DOM Elements Cache ---
  const elements = {};

  function initElementCache() {
    elements.srAnnouncer = document.getElementById('sr-announcer');
    elements.clockDisplay = document.getElementById('clock-display');
    elements.btnRefresh = document.getElementById('btn-refresh');
    elements.btnThemeToggle = document.getElementById('btn-theme-toggle');
    elements.btnA11ySettings = document.getElementById('btn-a11y-settings');
    elements.a11yMenu = document.getElementById('a11y-menu');
    elements.fontSizeSelect = document.getElementById('font-size-select');
    elements.contrastSelect = document.getElementById('contrast-select');
    elements.reduceMotionToggle = document.getElementById('reduce-motion-toggle');

    // Tabs
    elements.tabButtons = document.querySelectorAll('.tab-btn');
    elements.tabPanels = document.querySelectorAll('.tab-panel');

    // Chart
    elements.chartSvg = document.getElementById('telemetry-chart-svg');
    elements.chartTooltip = document.getElementById('chart-tooltip');
    elements.btnMetricRequests = document.getElementById('btn-metric-requests');
    elements.btnMetricLatency = document.getElementById('btn-metric-latency');
    elements.timeButtons = document.querySelectorAll('.time-btn');
    elements.statPeak = document.getElementById('stat-peak');
    elements.statAvg = document.getElementById('stat-avg');
    elements.statSla = document.getElementById('stat-sla');

    // Table
    elements.nodeSearchInput = document.getElementById('node-search-input');
    elements.btnClearSearch = document.getElementById('btn-clear-search');
    elements.nodeStatusFilter = document.getElementById('node-status-filter');
    elements.nodeRegionFilter = document.getElementById('node-region-filter');
    elements.btnResetFilters = document.getElementById('btn-reset-node-filters');
    elements.nodesTableBody = document.getElementById('nodes-table-body');
    elements.tableHeaders = document.querySelectorAll('.th-sortable');
    elements.tableEmptyState = document.getElementById('table-empty-state');
    elements.btnEmptyReset = document.getElementById('btn-empty-reset');
    elements.nodesCountDisplay = document.getElementById('nodes-count-display');
    elements.paginationInfo = document.getElementById('pagination-info');
    elements.btnPagePrev = document.getElementById('btn-page-prev');
    elements.btnPageNext = document.getElementById('btn-page-next');
    elements.pageIndicator = document.getElementById('page-indicator');

    // Overview Feeds & Actions
    elements.activityFeedList = document.getElementById('activity-feed-list');
    elements.btnViewAllAlerts = document.getElementById('btn-view-all-alerts');
    elements.btnRunDiagnostics = document.getElementById('btn-run-diagnostics');
    elements.btnExportTelemetry = document.getElementById('btn-export-telemetry');

    // Deployments & Security
    elements.deploymentsGrid = document.getElementById('deployments-grid');
    elements.securityTimelineList = document.getElementById('security-timeline-list');
    elements.btnTriggerDeployment = document.getElementById('btn-trigger-deployment');

    // Modal
    elements.nodeModal = document.getElementById('node-modal');
    elements.btnCloseModal = document.getElementById('btn-close-modal');
    elements.btnModalDismiss = document.getElementById('btn-modal-dismiss');
    elements.btnDrainNode = document.getElementById('btn-drain-node');
    elements.btnRestartNode = document.getElementById('btn-restart-node');

    // Toast Container
    elements.toastContainer = document.getElementById('toast-container');
  }

  // --- Accessibility Announcer Helper ---
  function announce(message) {
    if (elements.srAnnouncer) {
      elements.srAnnouncer.textContent = '';
      setTimeout(() => {
        elements.srAnnouncer.textContent = message;
      }, 50);
    }
  }

  // --- Toast Notification System ---
  function showToast(message, type = 'info', duration = 3500) {
    if (!elements.toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.setAttribute('role', 'alert');
    toast.innerHTML = `
      <span class="toast-message">${escapeHtml(message)}</span>
    `;

    elements.toastContainer.appendChild(toast);
    announce(message);

    setTimeout(() => {
      toast.style.opacity = '0';
      toast.style.transform = 'translateY(10px)';
      toast.style.transition = 'all 200ms ease';
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 250);
    }, duration);
  }

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  // --- Live UTC Clock ---
  function initClock() {
    function updateClock() {
      const now = new Date();
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      if (elements.clockDisplay) {
        elements.clockDisplay.textContent = `${hours}:${minutes}:${seconds} UTC`;
      }
    }
    updateClock();
    setInterval(updateClock, 1000);
  }

  // --- Data Fetching with Seamless Embedded Fallback ---
  async function loadTelemetryData() {
    try {
      const response = await fetch('data.json', { cache: 'no-store' });
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      state.data = await response.json();
      showToast('Live cloud telemetry synchronized successfully.', 'success');
    } catch (err) {
      console.warn('Network fetch not available, utilizing embedded telemetry dataset:', err.message);
      state.data = JSON.parse(JSON.stringify(FALLBACK_TELEMETRY_DATA));
      showToast('Operating on local telemetry snapshot (Offline Mode).', 'info');
    }

    renderAllComponents();
  }

  // --- Render All Subsystems ---
  function renderAllComponents() {
    renderKPIs();
    renderChart();
    renderActivityFeed();
    renderNodesTable();
    renderDeployments();
    renderSecurity();
  }

  // --- Render KPIs ---
  function renderKPIs() {
    if (!state.data || !state.data.systemMetrics) return;
    const m = state.data.systemMetrics;

    const elReq = document.getElementById('kpi-requests');
    if (elReq) elReq.textContent = m.totalRequestsToday;

    const elLatency = document.getElementById('kpi-latency');
    if (elLatency) elLatency.innerHTML = `${m.avgResponseTimeMs}<span class="metric-unit">ms</span>`;

    const elContainers = document.getElementById('kpi-containers');
    if (elContainers) elContainers.textContent = m.totalContainers;

    const elBw = document.getElementById('kpi-bandwidth');
    if (elBw) elBw.innerHTML = `${m.bandwidthThroughputGbps}<span class="metric-unit">Gbps</span>`;

    const elCpuText = document.getElementById('gauge-cpu-text');
    if (elCpuText) elCpuText.textContent = `${m.cpuUsagePct}%`;
    const elCpuBar = document.getElementById('gauge-cpu-bar');
    if (elCpuBar) {
      elCpuBar.setAttribute('aria-valuenow', m.cpuUsagePct);
      elCpuBar.firstElementChild.style.width = `${m.cpuUsagePct}%`;
    }

    const elMemText = document.getElementById('gauge-mem-text');
    if (elMemText) elMemText.textContent = `${m.memoryUsagePct}%`;
    const elMemBar = document.getElementById('gauge-mem-bar');
    if (elMemBar) {
      elMemBar.setAttribute('aria-valuenow', m.memoryUsagePct);
      elMemBar.firstElementChild.style.width = `${m.memoryUsagePct}%`;
    }

    const elDiskText = document.getElementById('gauge-disk-text');
    if (elDiskText) elDiskText.textContent = `${m.diskUsagePct}%`;
    const elDiskBar = document.getElementById('gauge-disk-bar');
    if (elDiskBar) {
      elDiskBar.setAttribute('aria-valuenow', m.diskUsagePct);
      elDiskBar.firstElementChild.style.width = `${m.diskUsagePct}%`;
    }

    const badgeCount = document.getElementById('badge-node-count');
    if (badgeCount && state.data.clusters) {
      badgeCount.textContent = state.data.clusters.length;
    }
  }

  // --- Interactive Telemetry SVG Chart Engine ---
  function renderChart() {
    if (!elements.chartSvg || !state.data || !state.data.trafficTimeline) return;

    const timelineData = state.data.trafficTimeline[state.chart.timeframe] || [];
    if (timelineData.length === 0) return;

    const isLatency = state.chart.metric === 'latency';
    const values = timelineData.map(d => isLatency ? d.latency : d.requests);

    // Compute Stats
    const minVal = Math.min(...values);
    const maxVal = Math.max(...values);
    const sumVal = values.reduce((a, b) => a + b, 0);
    const avgVal = Math.round(sumVal / values.length);

    // Update Footer Stats
    if (elements.statPeak) {
      elements.statPeak.textContent = isLatency ? `${maxVal} ms` : `${maxVal.toLocaleString()} req/s`;
    }
    if (elements.statAvg) {
      elements.statAvg.textContent = isLatency ? `${avgVal} ms` : `${avgVal.toLocaleString()} req/s`;
    }

    // Chart Dimensions
    const width = 900;
    const height = 320;
    const padding = { top: 30, right: 40, bottom: 40, left: 70 };
    const chartW = width - padding.left - padding.right;
    const chartH = height - padding.top - padding.bottom;

    // Range scaling
    const valueBuffer = (maxVal - minVal) * 0.15 || maxVal * 0.1 || 10;
    const yMin = Math.max(0, minVal - valueBuffer);
    const yMax = maxVal + valueBuffer;

    function getX(index) {
      if (timelineData.length === 1) return padding.left + chartW / 2;
      return padding.left + (index / (timelineData.length - 1)) * chartW;
    }

    function getY(val) {
      const normalized = (val - yMin) / (yMax - yMin);
      return padding.top + chartH - (normalized * chartH);
    }

    // Generate Points & Paths
    const points = timelineData.map((d, i) => ({
      x: getX(i),
      y: getY(isLatency ? d.latency : d.requests),
      time: d.time,
      val: isLatency ? d.latency : d.requests
    }));

    const linePathD = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(' ');
    const areaPathD = `${linePathD} L ${points[points.length - 1].x.toFixed(1)} ${(padding.top + chartH).toFixed(1)} L ${points[0].x.toFixed(1)} ${(padding.top + chartH).toFixed(1)} Z`;

    // Horizontal Gridlines & Y-Axis Labels (4 ticks)
    let gridLinesHtml = '';
    const numTicks = 4;
    for (let i = 0; i <= numTicks; i++) {
      const tickVal = yMin + (i / numTicks) * (yMax - yMin);
      const tickY = getY(tickVal);
      const displayLabel = isLatency ? `${Math.round(tickVal)}ms` : formatNumber(tickVal);

      gridLinesHtml += `
        <line class="chart-grid-line" x1="${padding.left}" y1="${tickY.toFixed(1)}" x2="${width - padding.right}" y2="${tickY.toFixed(1)}" />
        <text class="chart-axis-label" x="${padding.left - 12}" y="${(tickY + 4).toFixed(1)}" text-anchor="end">${displayLabel}</text>
      `;
    }

    // X-Axis Labels
    let xLabelsHtml = '';
    points.forEach((p) => {
      xLabelsHtml += `
        <text class="chart-axis-label" x="${p.x.toFixed(1)}" y="${(height - 12).toFixed(1)}" text-anchor="middle">${p.time}</text>
      `;
    });

    // Data Points
    let pointsHtml = '';
    points.forEach((p, idx) => {
      const formattedVal = isLatency ? `${p.val} ms` : `${p.val.toLocaleString()} req/s`;
      pointsHtml += `
        <circle class="chart-data-point" cx="${p.x.toFixed(1)}" cy="${p.y.toFixed(1)}" r="4.5"
          data-time="${p.time}" data-val="${formattedVal}" tabindex="0" role="button"
          aria-label="Timestamp ${p.time}: ${formattedVal}">
        </circle>
      `;
    });

    // Build SVG Inner HTML
    elements.chartSvg.innerHTML = `
      <defs>
        <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="var(--color-brand)" stop-opacity="0.55" />
          <stop offset="100%" stop-color="var(--color-brand)" stop-opacity="0.0" />
        </linearGradient>
      </defs>
      <!-- Grid Lines -->
      ${gridLinesHtml}
      <!-- Area Fill -->
      <path class="chart-area-path" d="${areaPathD}" />
      <!-- Line Stroke -->
      <path class="chart-line-path" d="${linePathD}" />
      <!-- X-Axis Labels -->
      ${xLabelsHtml}
      <!-- Data Points -->
      ${pointsHtml}
    `;

    // Tooltip Attachments
    attachChartTooltipEvents();
  }

  function formatNumber(num) {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(0) + 'k';
    return Math.round(num);
  }

  function attachChartTooltipEvents() {
    const dataPoints = elements.chartSvg.querySelectorAll('.chart-data-point');
    const tooltip = elements.chartTooltip;
    if (!tooltip) return;

    dataPoints.forEach(pt => {
      const showPtTooltip = () => {
        const time = pt.getAttribute('data-time');
        const val = pt.getAttribute('data-val');
        const cx = parseFloat(pt.getAttribute('cx'));
        const cy = parseFloat(pt.getAttribute('cy'));

        tooltip.innerHTML = `<strong>${time}</strong>: ${val}`;
        tooltip.classList.remove('hidden');

        // Scale coordinates relative to SVG bounding box
        const rect = elements.chartSvg.getBoundingClientRect();
        const scaleX = rect.width / 900;
        const scaleY = rect.height / 320;

        tooltip.style.left = `${cx * scaleX}px`;
        tooltip.style.top = `${cy * scaleY}px`;
      };

      const hidePtTooltip = () => {
        tooltip.classList.add('hidden');
      };

      pt.addEventListener('mouseenter', showPtTooltip);
      pt.addEventListener('focus', showPtTooltip);
      pt.addEventListener('mouseleave', hidePtTooltip);
      pt.addEventListener('blur', hidePtTooltip);
    });
  }

  // --- Render Activity Feed ---
  function renderActivityFeed() {
    if (!elements.activityFeedList || !state.data || !state.data.securityAlerts) return;

    elements.activityFeedList.innerHTML = state.data.securityAlerts.map(alert => {
      let iconColor = 'var(--color-brand)';
      let iconSymbol = '&#9432;';
      if (alert.severity === 'critical') {
        iconColor = 'var(--color-danger)';
        iconSymbol = '&#9888;';
      } else if (alert.severity === 'warning') {
        iconColor = 'var(--color-warning)';
        iconSymbol = '&#9888;';
      }

      return `
        <li class="activity-feed-item">
          <div class="activity-icon-wrap" style="background-color: ${alert.severity === 'critical' ? 'var(--color-danger-bg)' : 'var(--bg-tertiary)'}; color: ${iconColor};">
            ${iconSymbol}
          </div>
          <div class="activity-content">
            <h4 class="activity-title">${escapeHtml(alert.event)}</h4>
            <div class="activity-meta">
              <span>Node: <strong>${escapeHtml(alert.affectedNode)}</strong></span>
              <span>&bull;</span>
              <span>${escapeHtml(alert.timestamp)}</span>
            </div>
          </div>
        </li>
      `;
    }).join('');
  }

  // --- Render Cluster Nodes Data Table ---
  function renderNodesTable() {
    if (!elements.nodesTableBody || !state.data || !state.data.clusters) return;

    let filtered = [...state.data.clusters];

    // Filter by Search Query
    if (state.table.searchQuery.trim() !== '') {
      const q = state.table.searchQuery.toLowerCase().trim();
      filtered = filtered.filter(node =>
        node.id.toLowerCase().includes(q) ||
        node.name.toLowerCase().includes(q) ||
        node.region.toLowerCase().includes(q)
      );
    }

    // Filter by Status
    if (state.table.statusFilter !== 'all') {
      filtered = filtered.filter(node => node.status.toLowerCase() === state.table.statusFilter.toLowerCase());
    }

    // Filter by Region
    if (state.table.regionFilter !== 'all') {
      filtered = filtered.filter(node => node.region.toLowerCase().includes(state.table.regionFilter.toLowerCase()));
    }

    // Sort Table Data
    const col = state.table.sortColumn;
    const dir = state.table.sortDirection === 'asc' ? 1 : -1;

    filtered.sort((a, b) => {
      let valA = a[col];
      let valB = b[col];

      if (typeof valA === 'string') {
        return valA.localeCompare(valB) * dir;
      }
      return (valA - valB) * dir;
    });

    // Update Header Sort Indicators
    elements.tableHeaders.forEach(th => {
      const sortKey = th.getAttribute('data-sort');
      if (sortKey === col) {
        th.setAttribute('aria-sort', state.table.sortDirection === 'asc' ? 'ascending' : 'descending');
      } else {
        th.setAttribute('aria-sort', 'none');
      }
    });

    // Pagination Calculation
    const totalItems = filtered.length;
    const totalPages = Math.max(1, Math.ceil(totalItems / state.table.pageSize));
    if (state.table.currentPage > totalPages) state.table.currentPage = totalPages;

    const startIdx = (state.table.currentPage - 1) * state.table.pageSize;
    const pageItems = filtered.slice(startIdx, startIdx + state.table.pageSize);

    // Update Meta Counters
    if (elements.nodesCountDisplay) {
      elements.nodesCountDisplay.textContent = `Showing ${filtered.length} of ${state.data.clusters.length} nodes`;
    }
    if (elements.paginationInfo) {
      const endIdx = Math.min(startIdx + state.table.pageSize, totalItems);
      elements.paginationInfo.textContent = totalItems === 0
        ? 'Showing 0 items'
        : `Showing ${startIdx + 1}-${endIdx} of ${totalItems} items`;
    }
    if (elements.pageIndicator) {
      elements.pageIndicator.textContent = `Page ${state.table.currentPage} of ${totalPages}`;
    }
    if (elements.btnPagePrev) {
      elements.btnPagePrev.disabled = state.table.currentPage <= 1;
    }
    if (elements.btnPageNext) {
      elements.btnPageNext.disabled = state.table.currentPage >= totalPages;
    }

    // Handle Empty State
    if (pageItems.length === 0) {
      elements.nodesTableBody.innerHTML = '';
      if (elements.tableEmptyState) elements.tableEmptyState.classList.remove('hidden');
      return;
    } else {
      if (elements.tableEmptyState) elements.tableEmptyState.classList.add('hidden');
    }

    // Render Table Rows
    elements.nodesTableBody.innerHTML = pageItems.map(node => {
      const statusClass = `status-${node.status}`;
      return `
        <tr data-node-id="${escapeHtml(node.id)}">
          <td><span class="mono font-semibold">${escapeHtml(node.id)}</span></td>
          <td>
            <div class="node-cell-name">${escapeHtml(node.name)}</div>
            <div class="node-cell-region">${escapeHtml(node.region)}</div>
          </td>
          <td>
            <span class="node-status-badge ${statusClass}">
              <span class="status-indicator-dot" style="background-color: currentColor;" aria-hidden="true"></span>
              ${escapeHtml(node.status)}
            </span>
          </td>
          <td>
            <div class="table-progress-wrap">
              <div class="table-progress-bar">
                <div class="table-progress-fill fill-cpu" style="width: ${node.cpuUsage}%"></div>
              </div>
              <span class="table-progress-text">${node.cpuUsage}%</span>
            </div>
          </td>
          <td>
            <div class="table-progress-wrap">
              <div class="table-progress-bar">
                <div class="table-progress-fill fill-mem" style="width: ${node.memoryUsage}%"></div>
              </div>
              <span class="table-progress-text">${node.memoryUsage}%</span>
            </div>
          </td>
          <td><span class="mono">${node.activeConnections.toLocaleString()}</span></td>
          <td><span>${node.uptimeDays} days</span></td>
          <td>
            <button class="btn btn-secondary btn-sm btn-inspect-node" data-node-id="${escapeHtml(node.id)}" aria-label="Inspect telemetry for ${escapeHtml(node.name)}">
              Inspect
            </button>
          </td>
        </tr>
      `;
    }).join('');

    // Attach Row Action Handlers
    elements.nodesTableBody.querySelectorAll('.btn-inspect-node').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const nodeId = btn.getAttribute('data-node-id');
        openNodeModal(nodeId, btn);
      });
    });
  }

  // --- Render Pipelines & Deployments ---
  function renderDeployments() {
    if (!elements.deploymentsGrid || !state.data || !state.data.deployments) return;

    elements.deploymentsGrid.innerHTML = state.data.deployments.map(dep => {
      let statusBadge = `<span class="badge badge-success">Succeeded</span>`;
      if (dep.status === 'in_progress') {
        statusBadge = `<span class="badge badge-warning">Building &amp; Testing</span>`;
      } else if (dep.status === 'failed') {
        statusBadge = `<span class="badge badge-alert">Failed</span>`;
      }

      return `
        <article class="deployment-card">
          <div class="dep-card-header">
            <div>
              <h3 class="dep-service-name">${escapeHtml(dep.service)}</h3>
              <span class="dep-version">${escapeHtml(dep.version)} &bull; ${escapeHtml(dep.commitHash)}</span>
            </div>
            ${statusBadge}
          </div>
          <div class="dep-meta-row">
            <span>Author: <strong>${escapeHtml(dep.author)}</strong></span>
            <span>Duration: <strong>${dep.durationSeconds}s</strong></span>
          </div>
          <div class="dep-coverage">
            <div class="dep-coverage-label">
              <span>Code Quality &amp; Test Coverage:</span>
              <span class="mono">${dep.coveragePct}%</span>
            </div>
            <div class="progress-track">
              <div class="progress-fill fill-cpu" style="width: ${dep.coveragePct}%"></div>
            </div>
          </div>
          <div class="dep-card-actions">
            <button class="btn btn-secondary btn-sm" onclick="window.NexusOps.simulatePipelineAction('${escapeHtml(dep.id)}', 'logs')">View Build Logs</button>
            <button class="btn btn-warning btn-sm" onclick="window.NexusOps.simulatePipelineAction('${escapeHtml(dep.id)}', 'rollback')">Rollback</button>
          </div>
        </article>
      `;
    }).join('');
  }

  // --- Render Security Center ---
  function renderSecurity() {
    if (!elements.securityTimelineList || !state.data || !state.data.securityAlerts) return;

    elements.securityTimelineList.innerHTML = state.data.securityAlerts.map(sec => {
      let sevClass = 'sec-norm';
      if (sec.severity === 'critical') sevClass = 'sec-crit';
      if (sec.severity === 'warning') sevClass = 'sec-warn';

      return `
        <div class="security-event-card">
          <span class="sec-severity-pill ${sevClass}">${escapeHtml(sec.severity)}</span>
          <div class="sec-event-info">
            <h3 class="sec-event-title">${escapeHtml(sec.event)}</h3>
            <div class="sec-event-meta">
              <span>Affected Node: <strong class="mono">${escapeHtml(sec.affectedNode)}</strong></span>
              <span>Logged: ${escapeHtml(sec.timestamp)}</span>
              <span>Status: <strong class="text-success">${escapeHtml(sec.status)}</strong></span>
            </div>
          </div>
          <button class="btn btn-secondary btn-sm" onclick="window.NexusOps.simulateSecurityAction('${escapeHtml(sec.id)}')">Audit Trail</button>
        </div>
      `;
    }).join('');
  }

  // --- Accessible Modal Operations ---
  function openNodeModal(nodeId, triggerElement) {
    if (!state.data || !state.data.clusters) return;
    const node = state.data.clusters.find(n => n.id === nodeId);
    if (!node) return;

    state.selectedNode = node;
    state.lastFocusedElement = triggerElement;

    // Fill Modal Data
    document.getElementById('modal-node-title').textContent = `${node.name} Telemetry`;
    document.getElementById('modal-node-id').textContent = node.id;
    document.getElementById('modal-node-region').textContent = node.region;
    document.getElementById('modal-node-status').textContent = node.status.toUpperCase();
    document.getElementById('modal-node-uptime').textContent = `${node.uptimeDays} days continuous`;
    document.getElementById('modal-node-cpu').textContent = `${node.cpuUsage}% allocated`;
    document.getElementById('modal-node-memory').textContent = `${node.memoryUsage}% allocated`;
    document.getElementById('modal-node-conns').textContent = `${node.activeConnections.toLocaleString()} active sockets`;
    document.getElementById('modal-node-disk').textContent = node.diskIo;

    const modalBar = document.getElementById('modal-load-bar');
    if (modalBar) modalBar.style.width = `${Math.min(100, (node.activeConnections / 25000) * 100)}%`;

    // Open Modal
    elements.nodeModal.classList.remove('hidden');
    elements.btnCloseModal.focus();
    announce(`Opened telemetry inspection modal for ${node.name}. Press Escape to close.`);

    // Trap focus inside modal
    elements.nodeModal.addEventListener('keydown', trapModalFocus);
  }

  function closeNodeModal() {
    if (!elements.nodeModal.classList.contains('hidden')) {
      elements.nodeModal.classList.add('hidden');
      elements.nodeModal.removeEventListener('keydown', trapModalFocus);

      if (state.lastFocusedElement) {
        state.lastFocusedElement.focus();
      }
      announce('Closed telemetry inspection modal.');
    }
  }

  function trapModalFocus(e) {
    if (e.key === 'Escape') {
      closeNodeModal();
      return;
    }

    if (e.key === 'Tab') {
      const focusable = elements.nodeModal.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])');
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        last.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === last) {
        first.focus();
        e.preventDefault();
      }
    }
  }

  // --- Event Listeners & Binding ---
  function initEventListeners() {
    // Tab Switching
    elements.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetPanelId = btn.getAttribute('aria-controls');

        elements.tabButtons.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
          b.setAttribute('tabindex', '-1');
        });

        elements.tabPanels.forEach(p => {
          p.classList.remove('active');
          p.setAttribute('hidden', '');
        });

        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');
        btn.setAttribute('tabindex', '0');

        const activePanel = document.getElementById(targetPanelId);
        if (activePanel) {
          activePanel.classList.add('active');
          activePanel.removeAttribute('hidden');
        }

        state.activeTab = targetPanelId.replace('panel-', '');
        announce(`Navigated to ${btn.textContent.trim()} view.`);
      });

      // Keyboard arrow navigation between tabs (WAI-ARIA pattern)
      btn.addEventListener('keydown', (e) => {
        const tabsArray = Array.from(elements.tabButtons);
        const index = tabsArray.indexOf(btn);

        if (e.key === 'ArrowRight') {
          const nextIndex = (index + 1) % tabsArray.length;
          tabsArray[nextIndex].focus();
          tabsArray[nextIndex].click();
          e.preventDefault();
        } else if (e.key === 'ArrowLeft') {
          const prevIndex = (index - 1 + tabsArray.length) % tabsArray.length;
          tabsArray[prevIndex].focus();
          tabsArray[prevIndex].click();
          e.preventDefault();
        }
      });
    });

    // Chart Timeframe Buttons
    elements.timeButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        elements.timeButtons.forEach(b => {
          b.classList.remove('active');
          b.removeAttribute('aria-current');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-current', 'true');
        state.chart.timeframe = btn.getAttribute('data-timeframe');
        renderChart();
        announce(`Telemetry chart updated to ${state.chart.timeframe} timeframe.`);
      });
    });

    // Chart Metric Switcher
    if (elements.btnMetricRequests) {
      elements.btnMetricRequests.addEventListener('click', () => {
        elements.btnMetricRequests.classList.add('active');
        elements.btnMetricRequests.setAttribute('aria-pressed', 'true');
        elements.btnMetricLatency.classList.remove('active');
        elements.btnMetricLatency.setAttribute('aria-pressed', 'false');
        state.chart.metric = 'requests';
        renderChart();
        announce('Chart displaying Requests per second.');
      });
    }

    if (elements.btnMetricLatency) {
      elements.btnMetricLatency.addEventListener('click', () => {
        elements.btnMetricLatency.classList.add('active');
        elements.btnMetricLatency.setAttribute('aria-pressed', 'true');
        elements.btnMetricRequests.classList.remove('active');
        elements.btnMetricRequests.setAttribute('aria-pressed', 'false');
        state.chart.metric = 'latency';
        renderChart();
        announce('Chart displaying Latency in milliseconds.');
      });
    }

    // Table Column Sorting
    elements.tableHeaders.forEach(th => {
      const btn = th.querySelector('.btn-sort');
      if (btn) {
        btn.addEventListener('click', () => {
          const sortKey = th.getAttribute('data-sort');
          if (state.table.sortColumn === sortKey) {
            state.table.sortDirection = state.table.sortDirection === 'asc' ? 'desc' : 'asc';
          } else {
            state.table.sortColumn = sortKey;
            state.table.sortDirection = 'asc';
          }
          renderNodesTable();
          announce(`Sorted table by ${sortKey} ${state.table.sortDirection === 'asc' ? 'ascending' : 'descending'}.`);
        });
      }
    });

    // Table Live Search (with debounce)
    let debounceTimer;
    if (elements.nodeSearchInput) {
      elements.nodeSearchInput.addEventListener('input', (e) => {
        clearTimeout(debounceTimer);
        const val = e.target.value;
        if (elements.btnClearSearch) {
          elements.btnClearSearch.classList.toggle('hidden', val.length === 0);
        }
        debounceTimer = setTimeout(() => {
          state.table.searchQuery = val;
          state.table.currentPage = 1;
          renderNodesTable();
          announce(`Filtered cluster nodes for search query: ${val}`);
        }, 200);
      });
    }

    if (elements.btnClearSearch) {
      elements.btnClearSearch.addEventListener('click', () => {
        elements.nodeSearchInput.value = '';
        elements.btnClearSearch.classList.add('hidden');
        state.table.searchQuery = '';
        state.table.currentPage = 1;
        renderNodesTable();
        elements.nodeSearchInput.focus();
      });
    }

    // Status Filter Dropdown
    if (elements.nodeStatusFilter) {
      elements.nodeStatusFilter.addEventListener('change', (e) => {
        state.table.statusFilter = e.target.value;
        state.table.currentPage = 1;
        renderNodesTable();
        announce(`Filtered nodes by status: ${e.target.value}`);
      });
    }

    // Region Filter Dropdown
    if (elements.nodeRegionFilter) {
      elements.nodeRegionFilter.addEventListener('change', (e) => {
        state.table.regionFilter = e.target.value;
        state.table.currentPage = 1;
        renderNodesTable();
        announce(`Filtered nodes by region: ${e.target.value}`);
      });
    }

    // Reset Table Filters Button
    const resetFiltersAction = () => {
      if (elements.nodeSearchInput) elements.nodeSearchInput.value = '';
      if (elements.btnClearSearch) elements.btnClearSearch.classList.add('hidden');
      if (elements.nodeStatusFilter) elements.nodeStatusFilter.value = 'all';
      if (elements.nodeRegionFilter) elements.nodeRegionFilter.value = 'all';
      state.table.searchQuery = '';
      state.table.statusFilter = 'all';
      state.table.regionFilter = 'all';
      state.table.currentPage = 1;
      renderNodesTable();
      showToast('Cluster node filters have been reset.', 'info');
    };

    if (elements.btnResetFilters) elements.btnResetFilters.addEventListener('click', resetFiltersAction);
    if (elements.btnEmptyReset) elements.btnEmptyReset.addEventListener('click', resetFiltersAction);

    // Pagination Buttons
    if (elements.btnPagePrev) {
      elements.btnPagePrev.addEventListener('click', () => {
        if (state.table.currentPage > 1) {
          state.table.currentPage--;
          renderNodesTable();
          announce(`Switched to page ${state.table.currentPage}`);
        }
      });
    }
    if (elements.btnPageNext) {
      elements.btnPageNext.addEventListener('click', () => {
        state.table.currentPage++;
        renderNodesTable();
        announce(`Switched to page ${state.table.currentPage}`);
      });
    }

    // Theme Switcher Button
    if (elements.btnThemeToggle) {
      elements.btnThemeToggle.addEventListener('click', () => {
        const html = document.documentElement;
        const currentTheme = html.getAttribute('data-theme') || 'dark';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        html.setAttribute('data-theme', nextTheme);
        if (elements.contrastSelect) elements.contrastSelect.value = nextTheme;
        showToast(`Theme switched to ${nextTheme.toUpperCase()} mode.`, 'info');
      });
    }

    // Accessibility Menu Popover Toggle
    if (elements.btnA11ySettings && elements.a11yMenu) {
      elements.btnA11ySettings.addEventListener('click', (e) => {
        e.stopPropagation();
        const isHidden = elements.a11yMenu.classList.contains('hidden');
        elements.a11yMenu.classList.toggle('hidden', !isHidden);
        elements.btnA11ySettings.setAttribute('aria-expanded', String(isHidden));
      });

      document.addEventListener('click', (e) => {
        if (!elements.a11yMenu.contains(e.target) && e.target !== elements.btnA11ySettings) {
          elements.a11yMenu.classList.add('hidden');
          elements.btnA11ySettings.setAttribute('aria-expanded', 'false');
        }
      });
    }

    // Accessibility Controls
    if (elements.fontSizeSelect) {
      elements.fontSizeSelect.addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-font', e.target.value);
        showToast(`Text sizing adjusted to ${e.target.options[e.target.selectedIndex].text}`, 'info');
      });
    }

    if (elements.contrastSelect) {
      elements.contrastSelect.addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-theme', e.target.value);
        showToast(`Contrast mode updated to ${e.target.value}`, 'info');
      });
    }

    if (elements.reduceMotionToggle) {
      elements.reduceMotionToggle.addEventListener('change', (e) => {
        document.documentElement.setAttribute('data-motion', e.target.checked ? 'reduced' : 'normal');
        showToast(`Reduced motion ${e.target.checked ? 'enabled' : 'disabled'}`, 'info');
      });
    }

    // Modal Close Triggers
    if (elements.btnCloseModal) elements.btnCloseModal.addEventListener('click', closeNodeModal);
    if (elements.btnModalDismiss) elements.btnModalDismiss.addEventListener('click', closeNodeModal);
    if (elements.nodeModal) {
      elements.nodeModal.addEventListener('click', (e) => {
        if (e.target === elements.nodeModal) closeNodeModal();
      });
    }

    // Modal Node Operations
    if (elements.btnDrainNode) {
      elements.btnDrainNode.addEventListener('click', () => {
        if (state.selectedNode) {
          state.selectedNode.status = 'maintenance';
          state.selectedNode.activeConnections = 0;
          renderNodesTable();
          closeNodeModal();
          showToast(`Node ${state.selectedNode.id} drained. Status set to Maintenance.`, 'warning');
        }
      });
    }

    if (elements.btnRestartNode) {
      elements.btnRestartNode.addEventListener('click', () => {
        if (state.selectedNode) {
          showToast(`Restarting container pods on ${state.selectedNode.id}...`, 'info');
          setTimeout(() => {
            state.selectedNode.status = 'operational';
            state.selectedNode.cpuUsage = 24.5;
            state.selectedNode.memoryUsage = 45.0;
            renderNodesTable();
            closeNodeModal();
            showToast(`Node ${state.selectedNode.id} successfully rebooted and healthy.`, 'success');
          }, 1200);
        }
      });
    }

    // Refresh Telemetry Button
    if (elements.btnRefresh) {
      elements.btnRefresh.addEventListener('click', () => {
        loadTelemetryData();
      });
    }

    // Diagnostics Simulation Button
    if (elements.btnRunDiagnostics) {
      elements.btnRunDiagnostics.addEventListener('click', () => {
        showToast('Initiating cluster mesh diagnostics across 8 cloud regions...', 'info');
        setTimeout(() => {
          showToast('Health diagnostic complete: 100% of internal probes passed without packet loss.', 'success');
        }, 1500);
      });
    }

    // Export Telemetry JSON
    if (elements.btnExportTelemetry) {
      elements.btnExportTelemetry.addEventListener('click', () => {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state.data, null, 2));
        const downloadAnchor = document.createElement('a');
        downloadAnchor.setAttribute("href", dataStr);
        downloadAnchor.setAttribute("download", "nexusops-telemetry-export.json");
        document.body.appendChild(downloadAnchor);
        downloadAnchor.click();
        downloadAnchor.remove();
        showToast('Telemetry JSON file exported to downloads.', 'success');
      });
    }

    // View All Alerts Navigation
    if (elements.btnViewAllAlerts) {
      elements.btnViewAllAlerts.addEventListener('click', () => {
        const tabSec = document.getElementById('tab-security');
        if (tabSec) tabSec.click();
      });
    }

    // Trigger New Deployment Button
    if (elements.btnTriggerDeployment) {
      elements.btnTriggerDeployment.addEventListener('click', () => {
        const newDep = {
          id: `dep-v${(Math.random() * 5).toFixed(1)}.${Math.floor(Math.random() * 9)}`,
          service: "microservices-edge-proxy",
          version: `v1.8.${Math.floor(Math.random() * 20)}`,
          author: "Current User",
          commitHash: Math.random().toString(16).substring(2, 9),
          status: "in_progress",
          durationSeconds: 12,
          coveragePct: 97.2,
          timestamp: "Just now"
        };
        state.data.deployments.unshift(newDep);
        renderDeployments();
        showToast(`Deployment initiated for ${newDep.service} (${newDep.version}).`, 'info');
      });
    }
  }

  // --- Global Window API for Embedded Inline Handlers ---
  window.NexusOps = {
    simulatePipelineAction: (id, action) => {
      if (action === 'rollback') {
        showToast(`Rollback triggered for build ${id}. Reverting to previous stable hash.`, 'warning');
      } else {
        showToast(`Build logs for ${id}: Pipeline passed unit tests and static security analysis.`, 'info');
      }
    },
    simulateSecurityAction: (id) => {
      showToast(`Audit log detail loaded for event ${id}. Incident ticket synced with Jira.`, 'info');
    }
  };

  // --- Bootstrap on DOM Content Loaded ---
  document.addEventListener('DOMContentLoaded', () => {
    initElementCache();
    initClock();
    initEventListeners();
    loadTelemetryData();
  });
})();
