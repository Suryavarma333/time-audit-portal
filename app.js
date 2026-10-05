/**
 * Mission 1: The Time Audit & Daily Tracker
 * Mobile Logic, Chart.js Visuals, Date Reviewer, and Self-to-Self Gmail Dispatch
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const auditDate = document.getElementById('auditDate');
  const totalHoursDisplay = document.getElementById('totalHoursDisplay');
  const meterBar = document.getElementById('meterBar');
  const meterStatusMessage = document.getElementById('meterStatusMessage');
  const balanceToRandomBtn = document.getElementById('balanceToRandomBtn');
  const stickyTotal = document.getElementById('stickyTotal');
  const stickyStatus = document.getElementById('stickyStatus');
  const stickySubmitBtn = document.getElementById('stickySubmitBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnSubmitText = document.getElementById('btnSubmitText');
  const displayEmail = document.getElementById('displayEmail');
  const mobileToast = document.getElementById('mobileToast');

  // Chart & Status Elements
  const chartSelectedDateTitle = document.getElementById('chartSelectedDateTitle');
  const chartStatusBadge = document.getElementById('chartStatusBadge');
  const chartLegendGrid = document.getElementById('chartLegendGrid');
  const recapGymText = document.getElementById('recapGymText');
  const recapWorkText = document.getElementById('recapWorkText');
  const recapRealityText = document.getElementById('recapRealityText');

  // KPI Widget Elements
  const widgetSleepVal = document.getElementById('widgetSleepVal');
  const widgetSleepBar = document.getElementById('widgetSleepBar');
  const widgetWorkVal = document.getElementById('widgetWorkVal');
  const widgetWorkBar = document.getElementById('widgetWorkBar');
  const widgetGymVal = document.getElementById('widgetGymVal');
  const widgetGymBar = document.getElementById('widgetGymBar');
  const widgetGymSub = document.getElementById('widgetGymSub');
  const widgetPhoneVal = document.getElementById('widgetPhoneVal');
  const widgetPhoneBar = document.getElementById('widgetPhoneBar');
  const widgetPhoneSub = document.getElementById('widgetPhoneSub');

  // Modal Elements
  const targetEmailBadge = document.getElementById('targetEmailBadge');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const customEmailInput = document.getElementById('customEmailInput');
  const webhookUrlInput = document.getElementById('webhookUrlInput');
  const saveEmailBtn = document.getElementById('saveEmailBtn');

  // Dispatch Modal Elements
  const dispatchSuccessModal = document.getElementById('dispatchSuccessModal');
  const closeDispatchBtn = document.getElementById('closeDispatchBtn');
  const closeDispatchBottomBtn = document.getElementById('closeDispatchBottomBtn');
  const openInGmailDirectBtn = document.getElementById('openInGmailDirectBtn');
  const copyAuditReportBtn = document.getElementById('copyAuditReportBtn');

  const historyModal = document.getElementById('historyModal');
  const historyModalBtn = document.getElementById('historyModalBtn');
  const closeHistoryBtn = document.getElementById('closeHistoryBtn');
  const closeHistoryBottom = document.getElementById('closeHistoryBottom');
  const historyContainer = document.getElementById('historyContainer');
  const historyEmptyState = document.getElementById('historyEmptyState');
  const clearAllHistory = document.getElementById('clearAllHistory');

  // Category Configuration
  const categoryMeta = [
    { id: 'sleepHours', name: 'Sleep', icon: '🛌', color: '#6366f1' },
    { id: 'workHours', name: 'Work', icon: '💼', color: '#3b82f6' },
    { id: 'phoneHours', name: 'Phone', icon: '📱', color: '#f43f5e' },
    { id: 'foodHours', name: 'Food', icon: '🥗', color: '#10b981' },
    { id: 'familyHours', name: 'Family', icon: '👨‍👩‍👧', color: '#ec4899' },
    { id: 'learningHours', name: 'Learning', icon: '📚', color: '#8b5cf6' },
    { id: 'exerciseHours', name: 'Exercise', icon: '🏋️', color: '#f59e0b' },
    { id: 'entertainmentHours', name: 'Entertainment', icon: '🎮', color: '#06b6d4' },
    { id: 'randomHours', name: 'Random', icon: '⏳', color: '#64748b' }
  ];

  const categoryIds = categoryMeta.map(c => c.id);

  // Default Email Configuration
  const DEFAULT_EMAIL = 'suryavarma830@gmail.com';
  let userEmail = localStorage.getItem('timeAudit_email') || DEFAULT_EMAIL;
  if (!localStorage.getItem('timeAudit_email')) {
    localStorage.setItem('timeAudit_email', DEFAULT_EMAIL);
  }

  function updateEmailDisplay() {
    userEmail = localStorage.getItem('timeAudit_email') || DEFAULT_EMAIL;
    if (displayEmail) displayEmail.textContent = userEmail;
    if (customEmailInput) customEmailInput.value = userEmail;
    if (webhookUrlInput) webhookUrlInput.value = localStorage.getItem('timeAudit_webhook') || '';
    if (btnSubmitText) btnSubmitText.textContent = `🚀 Send to ${userEmail.split('@')[0]}`;
  }
  updateEmailDisplay();

  // Date Helpers
  function getTodayString() {
    return new Date().toISOString().split('T')[0];
  }

  function getYesterdayString() {
    const d = new Date();
    d.setDate(d.getDate() - 1);
    return d.toISOString().split('T')[0];
  }

  function getLastSundayString() {
    const d = new Date();
    const day = d.getDay(); // 0 is Sunday
    const diff = day === 0 ? 7 : day;
    d.setDate(d.getDate() - diff);
    return d.toISOString().split('T')[0];
  }

  function formatReadableDate(dateStr) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const d = new Date(parts[0], parts[1] - 1, parts[2]);
      return d.toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });
    }
    return dateStr;
  }

  let currentDate = getTodayString();
  if (auditDate) auditDate.value = currentDate;

  // Initialize Sample Sunday Data if user hasn't logged it yet
  function ensureSampleSundayData() {
    const sundayDate = getLastSundayString();
    const saved = JSON.parse(localStorage.getItem('timeAudit_history') || '[]');
    const hasSunday = saved.some(item => item.date === sundayDate);

    if (!hasSunday) {
      const sampleSunday = {
        id: Date.now() - 86400000 * 3,
        date: sundayDate,
        totalHours: 24.0,
        categories: {
          sleep: 8.5,
          work: 3.5,
          phone: 2.0,
          food: 2.0,
          family: 3.0,
          learning: 1.5,
          exercise: 1.5,
          entertainment: 1.5,
          random: 0.5
        },
        workoutSplit: 'Legs & Core',
        gymExercises: '• Barbell Squats: 4 sets × 10 reps (90kg)\n• Romanian Deadlifts: 3 sets × 10 reps\n• Hanging Leg Raises: 4 sets × 15 reps',
        gymIntensity: '🔥 Beast Mode (10/10)',
        waterIntake: '3.5 Liters',
        workTasks: '• Weekend review & sprint planning\n• Code refactor & system documentation',
        workWins: 'Solid Sunday recovery and leg workout PR!',
        tomorrowPlan: '1. Ship auth module\n2. Dev team sync at 10 AM',
        realityReflection: 'Rest and family time balanced nicely. Stayed off mindless scrolling.'
      };
      saved.push(sampleSunday);
      localStorage.setItem('timeAudit_history', JSON.stringify(saved));
    }
  }
  ensureSampleSundayData();

  // ================= TAB NAVIGATION =================
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  function switchTab(tabId) {
    tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.getAttribute('data-tab') === tabId);
    });
    tabPanes.forEach(pane => {
      pane.classList.toggle('active', pane.id === tabId);
    });

    if (tabId === 'tab-charts') {
      refreshChartsView();
    }

    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabId = btn.getAttribute('data-tab');
      switchTab(tabId);
    });
  });

  document.querySelectorAll('.btn-next-tab').forEach(nextBtn => {
    nextBtn.addEventListener('click', () => {
      const nextTab = nextBtn.getAttribute('data-goto');
      switchTab(nextTab);
    });
  });

  // ================= DATE SELECTOR & QUICK CHIPS =================
  function loadDataForDate(dateStr) {
    currentDate = dateStr;
    if (auditDate) auditDate.value = dateStr;

    const saved = JSON.parse(localStorage.getItem('timeAudit_history') || '[]');
    const record = saved.find(item => item.date === dateStr);

    if (record) {
      categoryMeta.forEach(cat => {
        const input = document.getElementById(cat.id);
        const val = record.categories[cat.id.replace('Hours', '')];
        if (input && val !== undefined) {
          input.value = val;
          const card = input.closest('.tap-card');
          if (card) {
            card.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
            const match = card.querySelector(`.preset-chip[data-val="${val}"]`);
            if (match) match.classList.add('active');
          }
        }
      });

      if (record.workoutSplit) {
        document.querySelectorAll('.split-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-val') === record.workoutSplit);
        });
        const wsInput = document.getElementById('workoutSplit');
        if (wsInput) wsInput.value = record.workoutSplit;
      }
      if (record.gymExercises && document.getElementById('gymExercises')) {
        document.getElementById('gymExercises').value = record.gymExercises;
      }
      if (record.gymIntensity) {
        document.querySelectorAll('.intensity-btn').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-val') === record.gymIntensity);
        });
      }
      if (record.waterIntake) {
        document.querySelectorAll('.water-chip').forEach(b => {
          b.classList.toggle('active', b.getAttribute('data-val') === record.waterIntake);
        });
      }

      if (record.workTasks && document.getElementById('workTasks')) {
        document.getElementById('workTasks').value = record.workTasks;
      }
      if (record.workWins && document.getElementById('workWins')) {
        document.getElementById('workWins').value = record.workWins;
      }
      if (record.tomorrowPlan && document.getElementById('tomorrowPlan')) {
        document.getElementById('tomorrowPlan').value = record.tomorrowPlan;
      }
      if (record.realityReflection && document.getElementById('realityObservation')) {
        document.getElementById('realityObservation').value = record.realityReflection;
      }

      showToast(`Loaded records for ${formatReadableDate(dateStr)}`, 'info');
    }

    calculateTotal();
    refreshChartsView();
  }

  document.querySelectorAll('.q-date-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.q-date-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const dateType = btn.getAttribute('data-date');
      let targetDate = getTodayString();

      if (dateType === 'yesterday') {
        targetDate = getYesterdayString();
      } else if (dateType === 'lastSunday') {
        targetDate = getLastSundayString();
      }

      loadDataForDate(targetDate);
    });
  });

  if (auditDate) {
    auditDate.addEventListener('change', () => {
      document.querySelectorAll('.q-date-btn').forEach(b => b.classList.remove('active'));
      loadDataForDate(auditDate.value);
    });
  }

  // ================= TOTAL HOURS & REALITY GAUGE =================
  function calculateTotal() {
    let sum = 0;
    categoryIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const val = parseFloat(el.value);
        if (!isNaN(val) && val >= 0) {
          sum += val;
        }
      }
    });

    sum = Math.round(sum * 10) / 10;
    totalHoursDisplay.textContent = sum.toFixed(1);
    stickyTotal.textContent = `${sum.toFixed(1)}h`;

    const percentage = Math.min((sum / 24) * 100, 100);
    meterBar.style.width = `${percentage}%`;

    meterStatusMessage.classList.remove('balanced', 'over');
    if (Math.abs(sum - 24.0) < 0.05) {
      meterStatusMessage.textContent = '✨ Exactly 24.0h (Reality Balanced)';
      meterStatusMessage.classList.add('balanced');
      stickyStatus.textContent = 'Balanced ✨';
      stickyStatus.style.color = '#10b981';
      meterBar.style.background = 'linear-gradient(90deg, #10b981, #059669)';
    } else if (sum > 24.0) {
      const over = (sum - 24.0).toFixed(1);
      meterStatusMessage.textContent = `⚠️ Over by ${over}h — Don't manipulate numbers!`;
      meterStatusMessage.classList.add('over');
      stickyStatus.textContent = `+${over}h Over ⚠️`;
      stickyStatus.style.color = '#f43f5e';
      meterBar.style.background = 'linear-gradient(90deg, #f59e0b, #f43f5e)';
    } else {
      const remaining = (24.0 - sum).toFixed(1);
      meterStatusMessage.textContent = `${remaining} hours remaining to log`;
      stickyStatus.textContent = `${remaining}h remaining`;
      stickyStatus.style.color = '#06b6d4';
      meterBar.style.background = 'linear-gradient(90deg, #3b82f6, #06b6d4, #10b981)';
    }

    return sum;
  }

  // ================= PRESET CHIPS & STEPPERS =================
  document.querySelectorAll('.preset-chip').forEach(chip => {
    chip.addEventListener('click', (e) => {
      e.preventDefault();
      const targetInputId = chip.getAttribute('data-for');
      const val = parseFloat(chip.getAttribute('data-val'));
      const input = document.getElementById(targetInputId);
      if (!input) return;

      input.value = val;

      const parentRow = chip.closest('.presets-row');
      if (parentRow) {
        parentRow.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      }
      chip.classList.add('active');

      calculateTotal();
    });
  });

  document.querySelectorAll('.step-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const input = document.getElementById(targetId);
      if (!input) return;

      let currentVal = parseFloat(input.value) || 0;
      const step = 0.5;

      if (btn.classList.contains('plus')) {
        currentVal = Math.min(24, currentVal + step);
      } else if (btn.classList.contains('minus')) {
        currentVal = Math.max(0, currentVal - step);
      }

      input.value = currentVal;

      const card = btn.closest('.tap-card');
      if (card) {
        const matchingChip = card.querySelector(`.preset-chip[data-val="${currentVal}"]`);
        card.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        if (matchingChip) matchingChip.classList.add('active');
      }

      calculateTotal();
    });
  });

  categoryIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', () => {
        const val = parseFloat(el.value);
        const card = el.closest('.tap-card');
        if (card) {
          card.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
          const match = card.querySelector(`.preset-chip[data-val="${val}"]`);
          if (match) match.classList.add('active');
        }
        calculateTotal();
      });
    }
  });

  if (balanceToRandomBtn) {
    balanceToRandomBtn.addEventListener('click', () => {
      let allocated = 0;
      categoryIds.forEach(id => {
        if (id !== 'randomHours') {
          const el = document.getElementById(id);
          allocated += parseFloat(el?.value) || 0;
        }
      });

      const remainder = Math.max(0, Math.round((24.0 - allocated) * 10) / 10);
      const randomInput = document.getElementById('randomHours');
      if (randomInput) {
        randomInput.value = remainder;
        const card = randomInput.closest('.tap-card');
        if (card) {
          card.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
          const match = card.querySelector(`.preset-chip[data-val="${remainder}"]`);
          if (match) match.classList.add('active');
        }
        calculateTotal();
        showToast(`⚡ Auto-balanced: ${remainder}h set to Random/Unplanned`, 'success');
      }
    });
  }

  // ================= GYM CONTROLS =================
  const splitBtns = document.querySelectorAll('.split-btn');
  const workoutSplitInput = document.getElementById('workoutSplit');
  splitBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      splitBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (workoutSplitInput) {
        workoutSplitInput.value = btn.getAttribute('data-val');
      }
    });
  });

  const exerciseTextarea = document.getElementById('gymExercises');
  document.querySelectorAll('.quick-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const exerciseText = chip.getAttribute('data-exercise');
      if (!exerciseTextarea) return;

      const current = exerciseTextarea.value.trim();
      if (current.length > 0) {
        exerciseTextarea.value = `${current}\n• ${exerciseText}`;
      } else {
        exerciseTextarea.value = `• ${exerciseText}`;
      }

      showToast(`Added: ${chip.textContent.replace('+', '').trim()}`);
    });
  });

  const intensityBtns = document.querySelectorAll('.intensity-btn');
  const gymIntensityInput = document.getElementById('gymIntensity');
  intensityBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      intensityBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (gymIntensityInput) {
        gymIntensityInput.value = btn.getAttribute('data-val');
      }
    });
  });

  const waterChips = document.querySelectorAll('.water-chip');
  const waterIntakeInput = document.getElementById('waterIntake');
  waterChips.forEach(chip => {
    chip.addEventListener('click', () => {
      waterChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      if (waterIntakeInput) {
        waterIntakeInput.value = chip.getAttribute('data-val');
      }
    });
  });

  // ================= WORK CONTROLS =================
  const vibeBtns = document.querySelectorAll('.vibe-btn');
  const productivityScoreInput = document.getElementById('productivityScore');
  vibeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      vibeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      if (productivityScoreInput) {
        productivityScoreInput.value = btn.getAttribute('data-val');
      }
    });
  });

  // ================= CHART.JS MODERN VISUALS =================
  let pieChartInstance = null;
  let barChartInstance = null;

  function refreshChartsView() {
    const selectedDate = auditDate ? auditDate.value : currentDate;
    const formattedDate = formatReadableDate(selectedDate);
    if (chartSelectedDateTitle) chartSelectedDateTitle.textContent = formattedDate;

    const hoursData = categoryMeta.map(cat => {
      const el = document.getElementById(cat.id);
      return parseFloat(el?.value) || 0;
    });

    const total = hoursData.reduce((a, b) => a + b, 0);
    const roundedTotal = Math.round(total * 10) / 10;

    if (chartStatusBadge) {
      if (Math.abs(roundedTotal - 24.0) < 0.05) {
        chartStatusBadge.textContent = '✨ Balanced (24.0h)';
        chartStatusBadge.style.color = '#6ee7b7';
        chartStatusBadge.style.background = 'rgba(16, 185, 129, 0.15)';
      } else if (roundedTotal > 24.0) {
        chartStatusBadge.textContent = `⚠️ Over by ${(roundedTotal - 24).toFixed(1)}h`;
        chartStatusBadge.style.color = '#fda4af';
        chartStatusBadge.style.background = 'rgba(244, 63, 94, 0.15)';
      } else {
        chartStatusBadge.textContent = `⏳ ${(24 - roundedTotal).toFixed(1)}h Remaining`;
        chartStatusBadge.style.color = '#a5f3fc';
        chartStatusBadge.style.background = 'rgba(6, 182, 212, 0.15)';
      }
    }

    const sleepH = parseFloat(document.getElementById('sleepHours')?.value) || 0;
    const workH = parseFloat(document.getElementById('workHours')?.value) || 0;
    const gymH = parseFloat(document.getElementById('exerciseHours')?.value) || 0;
    const phoneH = parseFloat(document.getElementById('phoneHours')?.value) || 0;
    const currentSplit = workoutSplitInput?.value || 'Workout';

    if (widgetSleepVal) widgetSleepVal.textContent = `${sleepH}h`;
    if (widgetSleepBar) widgetSleepBar.style.width = `${Math.min((sleepH / 8) * 100, 100)}%`;

    if (widgetWorkVal) widgetWorkVal.textContent = `${workH}h`;
    if (widgetWorkBar) widgetWorkBar.style.width = `${Math.min((workH / 8) * 100, 100)}%`;

    if (widgetGymVal) widgetGymVal.textContent = `${gymH}h`;
    if (widgetGymSub) widgetGymSub.textContent = currentSplit.split('(')[0].trim();
    if (widgetGymBar) widgetGymBar.style.width = `${Math.min((gymH / 1.5) * 100, 100)}%`;

    if (widgetPhoneVal) widgetPhoneVal.textContent = `${phoneH}h`;
    if (widgetPhoneBar) widgetPhoneBar.style.width = `${Math.min((phoneH / 4) * 100, 100)}%`;
    if (widgetPhoneSub) {
      if (phoneH <= 2.0) {
        widgetPhoneSub.textContent = 'Controlled 🛡️';
        widgetPhoneSub.className = 'metric-target status-good';
      } else if (phoneH <= 3.5) {
        widgetPhoneSub.textContent = 'Moderate ⚠️';
        widgetPhoneSub.className = 'metric-target';
      } else {
        widgetPhoneSub.textContent = 'High Alert 🔥';
        widgetPhoneSub.className = 'metric-target status-over';
      }
    }

    const gymNotes = document.getElementById('gymExercises')?.value.trim();
    const workNotes = document.getElementById('workTasks')?.value.trim();
    const realityNotes = document.getElementById('realityObservation')?.value.trim();

    if (recapGymText) recapGymText.textContent = gymNotes || 'Push/Legs routine logged. Good workout intensity.';
    if (recapWorkText) recapWorkText.textContent = workNotes || 'Core deliverables and daily milestones logged.';
    if (recapRealityText) recapRealityText.textContent = realityNotes || 'Observed reality cleanly without manipulation.';

    if (chartLegendGrid) {
      chartLegendGrid.innerHTML = categoryMeta.map((cat, idx) => {
        const val = hoursData[idx];
        const pct = roundedTotal > 0 ? Math.round((val / roundedTotal) * 100) : 0;
        return `
          <div class="legend-item">
            <span class="legend-dot" style="background: ${cat.color};"></span>
            <div class="legend-meta">
              <span class="legend-name">${cat.icon} ${cat.name}</span>
              <span class="legend-val">${val}h (${pct}%)</span>
            </div>
          </div>
        `;
      }).join('');
    }

    const pieCanvas = document.getElementById('pieChartCanvas');
    if (pieCanvas && window.Chart) {
      if (pieChartInstance) {
        pieChartInstance.destroy();
      }

      pieChartInstance = new Chart(pieCanvas, {
        type: 'doughnut',
        data: {
          labels: categoryMeta.map(c => `${c.icon} ${c.name}`),
          datasets: [{
            data: hoursData,
            backgroundColor: categoryMeta.map(c => c.color),
            borderColor: '#0f172a',
            borderWidth: 2,
            hoverOffset: 8
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '62%',
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              titleFont: { family: 'Plus Jakarta Sans', size: 13, weight: 'bold' },
              bodyFont: { family: 'JetBrains Mono', size: 12 },
              padding: 10,
              borderColor: 'rgba(255, 255, 255, 0.1)',
              borderWidth: 1,
              callbacks: {
                label: (ctx) => {
                  const val = ctx.raw || 0;
                  const pct = roundedTotal > 0 ? Math.round((val / roundedTotal) * 100) : 0;
                  return ` ${val} hrs (${pct}% of day)`;
                }
              }
            }
          }
        }
      });
    }

    const barCanvas = document.getElementById('barChartCanvas');
    if (barCanvas && window.Chart) {
      if (barChartInstance) {
        barChartInstance.destroy();
      }

      barChartInstance = new Chart(barCanvas, {
        type: 'bar',
        data: {
          labels: categoryMeta.map(c => c.name),
          datasets: [{
            label: 'Hours Spent',
            data: hoursData,
            backgroundColor: categoryMeta.map(c => c.color),
            borderRadius: 6,
            borderSkipped: false
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              max: 12,
              grid: { color: 'rgba(255, 255, 255, 0.05)' },
              ticks: { color: '#94a3b8', font: { family: 'JetBrains Mono', size: 11 } }
            },
            x: {
              grid: { display: false },
              ticks: { color: '#94a3b8', font: { family: 'Plus Jakarta Sans', size: 10 } }
            }
          },
          plugins: {
            legend: { display: false },
            tooltip: {
              backgroundColor: '#0f172a',
              padding: 10,
              callbacks: {
                label: (ctx) => ` ${ctx.raw} hours`
              }
            }
          }
        }
      });
    }
  }

  // ================= SETTINGS MODAL =================
  if (targetEmailBadge) targetEmailBadge.addEventListener('click', () => settingsModal.style.display = 'flex');
  if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'none');
  if (saveEmailBtn) {
    saveEmailBtn.addEventListener('click', () => {
      const val = customEmailInput.value.trim();
      const webhook = webhookUrlInput.value.trim();
      if (val && val.includes('@')) {
        localStorage.setItem('timeAudit_email', val);
        localStorage.setItem('timeAudit_webhook', webhook);
        updateEmailDisplay();
        settingsModal.style.display = 'none';
        showToast('Settings saved!', 'success');
      } else {
        alert('Please enter a valid email address.');
      }
    });
  }

  // ================= DISPATCH SUCCESS MODAL =================
  if (closeDispatchBtn) closeDispatchBtn.addEventListener('click', () => dispatchSuccessModal.style.display = 'none');
  if (closeDispatchBottomBtn) closeDispatchBottomBtn.addEventListener('click', () => dispatchSuccessModal.style.display = 'none');

  let lastGeneratedReportText = '';
  if (copyAuditReportBtn) {
    copyAuditReportBtn.addEventListener('click', () => {
      if (lastGeneratedReportText) {
        navigator.clipboard.writeText(lastGeneratedReportText).then(() => {
          showToast('✅ Full report copied to clipboard!', 'success');
        }).catch(() => {
          showToast('Copy failed, please copy manually', 'error');
        });
      }
    });
  }

  // ================= HISTORY MODAL =================
  function renderHistory() {
    const raw = localStorage.getItem('timeAudit_history');
    const logs = raw ? JSON.parse(raw) : [];

    if (!logs.length) {
      if (historyEmptyState) historyEmptyState.style.display = 'block';
      if (historyContainer) historyContainer.innerHTML = '';
      return;
    }

    if (historyEmptyState) historyEmptyState.style.display = 'none';
    if (historyContainer) {
      historyContainer.innerHTML = logs.map(entry => `
        <div class="h-card" style="cursor: pointer;" onclick="window.selectDateFromHistory('${entry.date}')">
          <div class="h-header">
            <span>📅 ${formatReadableDate(entry.date)}</span>
            <span>${entry.totalHours} hrs</span>
          </div>
          <div class="h-pills">
            <span class="h-pill">🛌 Sleep: ${entry.categories.sleep}h</span>
            <span class="h-pill">💼 Work: ${entry.categories.work}h</span>
            <span class="h-pill">📱 Phone: ${entry.categories.phone}h</span>
            <span class="h-pill">🏋️ Gym: ${entry.categories.exercise}h</span>
            <span class="h-pill">🥗 Food: ${entry.categories.food}h</span>
          </div>
          ${entry.workTasks ? `<div class="h-text"><strong>Work:</strong> ${escapeHtml(entry.workTasks).slice(0, 90)}...</div>` : ''}
          ${entry.realityReflection ? `<div class="h-text" style="border-color:#10b981;"><strong>Reality:</strong> ${escapeHtml(entry.realityReflection)}</div>` : ''}
        </div>
      `).join('');
    }
  }

  window.selectDateFromHistory = (dateStr) => {
    loadDataForDate(dateStr);
    historyModal.style.display = 'none';
    switchTab('tab-charts');
  };

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, m => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;'
    })[m]);
  }

  if (historyModalBtn) {
    historyModalBtn.addEventListener('click', () => {
      renderHistory();
      historyModal.style.display = 'flex';
    });
  }
  if (closeHistoryBtn) closeHistoryBtn.addEventListener('click', () => historyModal.style.display = 'none');
  if (closeHistoryBottom) closeHistoryBottom.addEventListener('click', () => historyModal.style.display = 'none');
  if (clearAllHistory) {
    clearAllHistory.addEventListener('click', () => {
      if (confirm('Clear all stored audit history?')) {
        localStorage.removeItem('timeAudit_history');
        renderHistory();
        showToast('History cleared.');
      }
    });
  }

  // ================= TOAST =================
  let toastTimer;
  function showToast(msg, type = '') {
    if (!mobileToast) return;
    clearTimeout(toastTimer);
    mobileToast.textContent = msg;
    mobileToast.className = `toast-bar visible ${type}`;
    toastTimer = setTimeout(() => {
      mobileToast.className = 'toast-bar';
    }, 3800);
  }

  // ================= SUBMISSION & SELF-TO-SELF GMAIL DISPATCH =================
  if (stickySubmitBtn) {
    stickySubmitBtn.addEventListener('click', async () => {
      const email = localStorage.getItem('timeAudit_email') || DEFAULT_EMAIL;
      const date = auditDate?.value || currentDate;
      const totalHours = calculateTotal();

      const workTasks = document.getElementById('workTasks')?.value.trim();
      if (!workTasks) {
        switchTab('tab-work');
        showToast('Please fill in your Key Tasks under Work tab', 'error');
        document.getElementById('workTasks')?.focus();
        return;
      }

      const categories = {
        sleep: parseFloat(document.getElementById('sleepHours')?.value) || 0,
        work: parseFloat(document.getElementById('workHours')?.value) || 0,
        phone: parseFloat(document.getElementById('phoneHours')?.value) || 0,
        food: parseFloat(document.getElementById('foodHours')?.value) || 0,
        family: parseFloat(document.getElementById('familyHours')?.value) || 0,
        learning: parseFloat(document.getElementById('learningHours')?.value) || 0,
        exercise: parseFloat(document.getElementById('exerciseHours')?.value) || 0,
        entertainment: parseFloat(document.getElementById('entertainmentHours')?.value) || 0,
        random: parseFloat(document.getElementById('randomHours')?.value) || 0
      };

      const workoutSplit = workoutSplitInput?.value || 'Push (Chest & Triceps)';
      const gymExercises = document.getElementById('gymExercises')?.value.trim() || 'No specific exercises logged';
      const gymIntensity = gymIntensityInput?.value || '💪 Strong (8/10)';
      const waterIntake = waterIntakeInput?.value || '3.0 Liters';

      const workWins = document.getElementById('workWins')?.value.trim() || 'None logged';
      const tomorrowPlan = document.getElementById('tomorrowPlan')?.value.trim() || 'None logged';
      const realityReflection = document.getElementById('realityObservation')?.value.trim() || 'Observed reality cleanly.';

      // Save to local history
      const entry = {
        id: Date.now(),
        date,
        totalHours,
        categories,
        workoutSplit,
        gymExercises,
        gymIntensity,
        waterIntake,
        workTasks,
        workWins,
        tomorrowPlan,
        realityReflection
      };

      let savedList = JSON.parse(localStorage.getItem('timeAudit_history') || '[]');
      savedList = savedList.filter(item => item.date !== date);
      savedList.unshift(entry);
      if (savedList.length > 60) savedList.pop();
      localStorage.setItem('timeAudit_history', JSON.stringify(savedList));

      // Construct Formatted Email Body
      const readableDate = formatReadableDate(date);
      const emailSubject = `Mission 1 Time Audit & Daily Report — ${readableDate} [${totalHours}h / 24h]`;
      const emailBody = `
=========================================
MISSION 1 — THE TIME AUDIT (${readableDate})
"Don't manipulate the numbers. Observe reality."
=========================================

📊 24-HOUR TIME DISTRIBUTION:
• 🛌 Sleep:                 ${categories.sleep} hrs
• 💼 Work:                  ${categories.work} hrs
• 📱 Phone / Social Media:  ${categories.phone} hrs
• 🥗 Food:                  ${categories.food} hrs
• 👨‍👩‍👧 Family:                ${categories.family} hrs
• 📚 Learning:              ${categories.learning} hrs
• 🏋️ Exercise:              ${categories.exercise} hrs
• 🎮 Entertainment:         ${categories.entertainment} hrs
• ⏳ Random / Unplanned:    ${categories.random} hrs
-----------------------------------------
TOTAL RECORDED:            ${totalHours} / 24.0 hrs

🏋️ GYM & FITNESS LOG:
• Split / Focus:   ${workoutSplit}
• Intensity:       ${gymIntensity}
• Water Intake:    ${waterIntake}
• Exercises & Sets:
${gymExercises}

💼 WORK & PRODUCTIVITY:
• Key Completed Tasks:
${workTasks}

• Wins & Highlights:
${workWins}

• Priorities for Tomorrow:
${tomorrowPlan}

👁️ OBSERVE REALITY (Honest Reflection):
${realityReflection}

=========================================
Delivered to: ${email}
From: Daily Pulse Time Audit Web Portal
      `.trim();

      lastGeneratedReportText = emailBody;

      // Construct Direct Self-to-Self Gmail Web Compose URL
      const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(email)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      if (openInGmailDirectBtn) {
        openInGmailDirectBtn.href = gmailUrl;
      }

      // Check if custom background webhook configured
      const customWebhook = localStorage.getItem('timeAudit_webhook');
      if (customWebhook) {
        btnSpinner.style.display = 'inline-block';
        btnSubmitText.textContent = 'Sending to Webhook...';
        try {
          await fetch(customWebhook, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              to: email,
              subject: emailSubject,
              body: emailBody,
              data: entry
            })
          });
          showToast('Sent to webhook & saved!', 'success');
        } catch (e) {
          console.warn('Webhook dispatch error:', e);
        } finally {
          btnSpinner.style.display = 'none';
          btnSubmitText.textContent = `🚀 Send to ${email.split('@')[0]}`;
        }
      }

      // Open Direct Gmail in new tab/app immediately OR show Dispatch Modal
      try {
        const win = window.open(gmailUrl, '_blank');
        if (win) {
          showToast('Opening Gmail to send to yourself...', 'success');
        } else {
          // If popup blocked, show the dispatch modal
          dispatchSuccessModal.style.display = 'flex';
        }
      } catch (e) {
        dispatchSuccessModal.style.display = 'flex';
      }

      // Also display dispatch modal so user has 1-tap copy / retry option
      dispatchSuccessModal.style.display = 'flex';
      refreshChartsView();
    });
  }

  // Initial Calculation
  calculateTotal();
});
