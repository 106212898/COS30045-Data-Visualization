/* Data Story charts — reads window.TV_DATA (see tv-data.js) and renders
   the Chart.js visuals for data-story.html using the WattWise palette. */
(function () {
  const DATA = window.TV_DATA;
  if (!DATA) return;

  const INK = '#10192b';
  const TEXT_SOFT = 'rgba(22, 32, 44, 0.68)';
  const GRID = 'rgba(16, 25, 43, 0.08)';
  const AMBER = '#ffb020';
  const TEAL = '#1fb6a6';
  const ALERT = '#e6553a';
  const LCD_GREY = '#5b6b85';

  const COLORS = {
    'LCD (LED)': AMBER,
    'LCD': LCD_GREY,
    'OLED': TEAL
  };

  Chart.defaults.font.family = "'Inter', 'Segoe UI', sans-serif";
  Chart.defaults.color = TEXT_SOFT;
  Chart.defaults.font.size = 12;

  const totalEl = document.getElementById('totalModels');
  if (totalEl) totalEl.textContent = 'n = ' + DATA.points.length.toLocaleString();

  // ---- 01: model counts by technology ----
  (function () {
    const el = document.getElementById('chartTechCounts');
    if (!el) return;
    const order = ['LCD (LED)', 'LCD', 'OLED'];
    const counts = order.map((t) => DATA.techCounts[t] || 0);
    new Chart(el, {
      type: 'bar',
      data: {
        labels: order,
        datasets: [{
          data: counts,
          backgroundColor: order.map((t) => COLORS[t]),
          borderRadius: 4,
          maxBarThickness: 70
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => c.parsed.x.toLocaleString() + ' models' } }
        },
        scales: {
          x: { grid: { color: GRID }, ticks: { callback: (v) => v.toLocaleString() } },
          y: { grid: { display: false } }
        }
      }
    });
  })();

  // ---- 02: size vs power scatter + trend line ----
  (function () {
    const el = document.getElementById('chartSizePower');
    if (!el) return;
    const order = ['LCD (LED)', 'LCD', 'OLED'];
    const datasets = order.map((t) => ({
      label: t,
      type: 'scatter',
      data: DATA.points.filter((p) => p.tech === t).map((p) => ({ x: p.size, y: p.power })),
      backgroundColor: COLORS[t] + 'AA',
      pointRadius: 2.2,
      pointHoverRadius: 4
    }));
    datasets.push({
      label: 'average',
      type: 'line',
      data: DATA.sizeStats.map((s) => ({ x: s.mid, y: s.avg_power })),
      borderColor: INK,
      borderWidth: 2,
      pointRadius: 0,
      fill: false,
      tension: 0.25,
      order: 0
    });
    new Chart(el, {
      type: 'scatter',
      data: { datasets },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: (c) => (c.dataset.label === 'average'
                ? 'avg ' + c.parsed.y + 'W at ' + c.parsed.x + 'cm'
                : c.dataset.label + ': ' + c.parsed.x + 'cm, ' + c.parsed.y + 'W')
            }
          }
        },
        scales: {
          x: { title: { display: true, text: 'Screen size (cm diagonal)' }, grid: { color: GRID }, min: 30 },
          y: { title: { display: true, text: 'Average mode power (W)' }, grid: { color: GRID }, min: 0 }
        }
      }
    });
    const legend = document.getElementById('legendTech');
    if (legend) {
      legend.innerHTML = order.map((t) => `<span><span class="swatch" style="background:${COLORS[t]}"></span>${t}</span>`).join('')
        + `<span><span class="swatch" style="background:${INK}"></span>average at each size</span>`;
    }
  })();

  // ---- 03: technology comparison bars ----
  (function () {
    const powerEl = document.getElementById('chartTechPower');
    const kwhEl = document.getElementById('chartTechKwh');
    if (!powerEl || !kwhEl) return;
    const order = ['LCD', 'LCD (LED)', 'OLED'];
    const byTech = {};
    DATA.techStats.forEach((r) => { byTech[r.tech] = r; });

    new Chart(powerEl, {
      type: 'bar',
      data: {
        labels: order,
        datasets: [{
          data: order.map((t) => byTech[t].avg_power),
          backgroundColor: order.map((t) => COLORS[t]),
          borderRadius: 4,
          maxBarThickness: 60
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => c.parsed.y + ' W avg (n=' + byTech[order[c.dataIndex]].n + ')' } }
        },
        scales: {
          y: { grid: { color: GRID }, min: 0, title: { display: true, text: 'W' } },
          x: { grid: { display: false } }
        }
      }
    });

    new Chart(kwhEl, {
      type: 'bar',
      data: {
        labels: order,
        datasets: [{
          data: order.map((t) => byTech[t].avg_kwh),
          backgroundColor: order.map((t) => COLORS[t]),
          borderRadius: 4,
          maxBarThickness: 60
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => c.parsed.y + ' kWh/yr avg (n=' + byTech[order[c.dataIndex]].n + ')' } }
        },
        scales: {
          y: { grid: { color: GRID }, min: 0, title: { display: true, text: 'kWh / year' } },
          x: { grid: { display: false } }
        }
      }
    });
  })();

  // ---- 04: star rating vs consumption ----
  (function () {
    const el = document.getElementById('chartStarKwh');
    if (!el) return;
    const stats = DATA.starStats.slice().sort((a, b) => a.star_bucket - b.star_bucket);

    function lerpColor(a, b, t) {
      const ah = a.match(/\w\w/g).map((x) => parseInt(x, 16));
      const bh = b.match(/\w\w/g).map((x) => parseInt(x, 16));
      const c = ah.map((v, i) => Math.round(v + (bh[i] - v) * t));
      return `rgb(${c[0]},${c[1]},${c[2]})`;
    }
    function colorForStar(s) {
      const t = (s - 1) / 7;
      return t < 0.5 ? lerpColor(ALERT, AMBER, t / 0.5) : lerpColor(AMBER, TEAL, (t - 0.5) / 0.5);
    }

    new Chart(el, {
      type: 'bar',
      data: {
        labels: stats.map((s) => s.star_bucket + '★'),
        datasets: [{
          data: stats.map((s) => s.avg_kwh),
          backgroundColor: stats.map((s) => colorForStar(s.star_bucket)),
          borderRadius: 4,
          maxBarThickness: 44
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { callbacks: { label: (c) => c.parsed.y + ' kWh/yr avg (n=' + stats[c.dataIndex].n + ')' } }
        },
        scales: {
          y: { grid: { color: GRID }, min: 0, title: { display: true, text: 'Avg. kWh / year' } },
          x: { grid: { display: false }, title: { display: true, text: 'Star rating' } }
        }
      }
    });
  })();

  // ---- 05: interactive filter ----
  (function () {
    const el = document.getElementById('chartFilter');
    const select = document.getElementById('techFilter');
    const countLabel = document.getElementById('legendFilterCount');
    if (!el || !select) return;
    let chart;

    function buildDatasets(filter) {
      if (filter === 'all') {
        const order = ['LCD (LED)', 'LCD', 'OLED'];
        return {
          datasets: order.map((t) => ({
            label: t,
            data: DATA.points.filter((p) => p.tech === t).map((p) => ({ x: p.size, y: p.kwh })),
            backgroundColor: COLORS[t] + 'AA',
            pointRadius: 2.2
          })),
          count: DATA.points.length
        };
      }
      const pts = DATA.points.filter((p) => p.tech === filter);
      return {
        datasets: [{
          label: filter,
          data: pts.map((p) => ({ x: p.size, y: p.kwh })),
          backgroundColor: COLORS[filter] + 'CC',
          pointRadius: 2.6
        }],
        count: pts.length
      };
    }

    function render(filter) {
      const { datasets, count } = buildDatasets(filter);
      if (chart) chart.destroy();
      chart = new Chart(el, {
        type: 'scatter',
        data: { datasets },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
            tooltip: { callbacks: { label: (c) => c.dataset.label + ': ' + c.parsed.x + 'cm, ' + c.parsed.y + ' kWh/yr' } }
          },
          scales: {
            x: { title: { display: true, text: 'Screen size (cm diagonal)' }, grid: { color: GRID }, min: 30 },
            y: { title: { display: true, text: 'Labelled consumption (kWh/year)' }, grid: { color: GRID }, min: 0 }
          }
        }
      });
      if (countLabel) countLabel.innerHTML = `<span>${count.toLocaleString()} models shown</span>`;
    }

    select.addEventListener('change', (e) => render(e.target.value));
    render('all');
  })();
})();