/**
 * Mission 1: The Time Audit & Daily Tracker
 * Mobile Web Portal Logic & Email Dispatcher
 */

document.addEventListener('DOMContentLoaded', () => {
  // Elements
  const auditForm = document.getElementById('auditForm');
  const auditDate = document.getElementById('auditDate');
  const totalHoursCount = document.getElementById('totalHoursCount');
  const gaugeMeter = document.getElementById('gaugeMeter');
  const gaugeStatusText = document.getElementById('gaugeStatusText');
  const balanceRandomBtn = document.getElementById('balanceRandomBtn');
  
  // Settings Modal elements
  const settingsModal = document.getElementById('settingsModal');
  const settingsModalBtn = document.getElementById('settingsModalBtn');
  const closeSettingsModal = document.getElementById('closeSettingsModal');
  const saveSettingsBtn = document.getElementById('saveSettingsBtn');
  const targetEmail = document.getElementById('targetEmail');
  const web3FormsKey = document.getElementById('web3FormsKey');
  const emailWarningBanner = document.getElementById('emailWarningBanner');
  const openSettingsQuickBtn = document.getElementById('openSettingsQuickBtn');
  const headerEmailLabel = document.getElementById('headerEmailLabel');

  // History Modal elements
  const historyModal = document.getElementById('historyModal');
  const historyModalBtn = document.getElementById('historyModalBtn');
  const closeHistoryModal = document.getElementById('closeHistoryModal');
  const closeHistoryBottomBtn = document.getElementById('closeHistoryBottomBtn');
  const historyListContainer = document.getElementById('historyListContainer');
  const emptyHistoryMsg = document.getElementById('emptyHistoryMsg');
  const clearAllHistoryBtn = document.getElementById('clearAllHistoryBtn');

  // Submit button
  const submitReportBtn = document.getElementById('submitReportBtn');
  const btnSpinner = document.getElementById('btnSpinner');
  const btnSubmitText = document.getElementById('btnSubmitText');
  const appToast = document.getElementById('appToast');

  // Categories IDs
  const categoryFieldIds = [
    'sleepHours',
    'workHours',
    'phoneHours',
    'foodHours',
    'familyHours',
    'learningHours',
    'exerciseHours',
    'entertainmentHours',
    'randomHours'
  ];

  // Initialize Date to Today
  const todayStr = new Date().toISOString().split('T')[0];
  if (auditDate) {
    auditDate.value = todayStr;
  }

  // Load Saved Settings from LocalStorage
  function loadSettings() {
    const savedEmail = localStorage.getItem('timeAudit_email') || '';
    const savedKey = localStorage.getItem('timeAudit_web3key') || '';
    
    if (targetEmail) targetEmail.value = savedEmail;
    if (web3FormsKey) web3FormsKey.value = savedKey;

    if (savedEmail) {
      if (headerEmailLabel) headerEmailLabel.textContent = savedEmail.split('@')[0];
      if (emailWarningBanner) emailWarningBanner.style.display = 'none';
    } else {
      if (headerEmailLabel) headerEmailLabel.textContent = 'Setup Email';
      if (emailWarningBanner) emailWarningBanner.style.display = 'flex';
    }
  }

  // Calculate Total 24h & Update Reality Gauge
  function calculateTotalHours() {
    let total = 0;
    categoryFieldIds.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        const val = parseFloat(el.value);
        if (!isNaN(val) && val >= 0) {
          total += val;
        }
      }
    });

    total = Math.round(total * 100) / 100;
    totalHoursCount.textContent = total.toFixed(1);

    const percentage = Math.min((total / 24) * 100, 100);
    gaugeMeter.style.width = `${percentage}%`;

    gaugeStatusText.classList.remove('balanced', 'over');
    if (Math.abs(total - 24.0) < 0.05) {
      gaugeStatusText.textContent = '✨ Exactly 24.0 hours accounted for (Reality Balanced)';
      gaugeStatusText.classList.add('balanced');
      gaugeMeter.style.background = 'linear-gradient(90deg, #10b981, #059669)';
    } else if (total > 24.0) {
      const over = (total - 24.0).toFixed(1);
      gaugeStatusText.textContent = `⚠️ Over by ${over} hrs — Don't manipulate the numbers!`;
      gaugeStatusText.classList.add('over');
      gaugeMeter.style.background = 'linear-gradient(90deg, #f59e0b, #f43f5e)';
    } else {
      const remaining = (24.0 - total).toFixed(1);
      gaugeStatusText.textContent = `${remaining} hours remaining to account for`;
      gaugeMeter.style.background = 'linear-gradient(90deg, #3b82f6, #06b6d4, #10b981)';
    }

    return total;
  }

  // Stepper Buttons (+ and -)
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
      calculateTotalHours();
    });
  });

  // Listen to manual changes in inputs
  categoryFieldIds.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
      el.addEventListener('input', calculateTotalHours);
      el.addEventListener('change', calculateTotalHours);
    }
  });

  // Balance Remaining Button
  if (balanceRandomBtn) {
    balanceRandomBtn.addEventListener('click', () => {
      let allocatedWithoutRandom = 0;
      categoryFieldIds.forEach(id => {
        if (id !== 'randomHours') {
          const el = document.getElementById(id);
          allocatedWithoutRandom += parseFloat(el?.value) || 0;
        }
      });

      const remaining = Math.max(0, Math.round((24.0 - allocatedWithoutRandom) * 10) / 10);
      const randomInput = document.getElementById('randomHours');
      if (randomInput) {
        randomInput.value = remaining;
        calculateTotalHours();
        showToast(`Random/Unplanned time set to ${remaining} hrs`);
      }
    });
  }

  // Gym Workout Split Chips
  const chips = document.querySelectorAll('.chip-item');
  const workoutSplitInput = document.getElementById('workoutSplit');
  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      chips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const val = chip.getAttribute('data-val');
      if (workoutSplitInput) {
        workoutSplitInput.value = val;
      }
    });
  });

  // Settings Modal Controls
  function openSettings() {
    if (settingsModal) settingsModal.style.display = 'flex';
  }
  function closeSettings() {
    if (settingsModal) settingsModal.style.display = 'none';
  }

  if (settingsModalBtn) settingsModalBtn.addEventListener('click', openSettings);
  if (openSettingsQuickBtn) openSettingsQuickBtn.addEventListener('click', openSettings);
  if (closeSettingsModal) closeSettingsModal.addEventListener('click', closeSettings);

  if (saveSettingsBtn) {
    saveSettingsBtn.addEventListener('click', () => {
      const emailVal = targetEmail.value.trim();
      const keyVal = web3FormsKey.value.trim();

      if (!emailVal || !emailVal.includes('@')) {
        alert('Please enter a valid email address.');
        return;
      }

      localStorage.setItem('timeAudit_email', emailVal);
      localStorage.setItem('timeAudit_web3key', keyVal);
      loadSettings();
      closeSettings();
      showToast('Settings saved successfully!', 'success');
    });
  }

  // History Modal Controls
  function openHistory() {
    renderHistory();
    if (historyModal) historyModal.style.display = 'flex';
  }
  function closeHistory() {
    if (historyModal) historyModal.style.display = 'none';
  }

  if (historyModalBtn) historyModalBtn.addEventListener('click', openHistory);
  if (closeHistoryModal) closeHistoryModal.addEventListener('click', closeHistory);
  if (closeHistoryBottomBtn) closeHistoryBottomBtn.addEventListener('click', closeHistory);

  if (clearAllHistoryBtn) {
    clearAllHistoryBtn.addEventListener('click', () => {
      if (confirm('Are you sure you want to clear all saved audit history?')) {
        localStorage.removeItem('timeAudit_history');
        renderHistory();
        showToast('History cleared.');
      }
    });
  }

  // Render Saved Audits
  function renderHistory() {
    const raw = localStorage.getItem('timeAudit_history');
    const logs = raw ? JSON.parse(raw) : [];

    if (!logs.length) {
      if (emptyHistoryMsg) emptyHistoryMsg.style.display = 'block';
      if (historyListContainer) historyListContainer.innerHTML = '';
      return;
    }

    if (emptyHistoryMsg) emptyHistoryMsg.style.display = 'none';
    if (historyListContainer) {
      historyListContainer.innerHTML = logs.map(entry => {
        return `
          <div class="history-card">
            <div class="history-header">
              <span>📅 ${entry.date}</span>
              <span class="history-total">${entry.totalHours} hrs</span>
            </div>
            <div class="history-pills">
              <span class="mini-pill">🛌 Sleep: ${entry.categories.sleep}h</span>
              <span class="mini-pill">💼 Work: ${entry.categories.work}h</span>
              <span class="mini-pill">📱 Phone: ${entry.categories.phone}h</span>
              <span class="mini-pill">🏋️ Ex: ${entry.categories.exercise}h</span>
              <span class="mini-pill">🥗 Food: ${entry.categories.food}h</span>
              <span class="mini-pill">👨‍👩‍👧 Family: ${entry.categories.family}h</span>
              <span class="mini-pill">📚 Learn: ${entry.categories.learning}h</span>
            </div>
            ${entry.workTasks ? `<div class="history-notes"><strong>Work:</strong> ${escapeHtml(entry.workTasks).slice(0, 100)}...</div>` : ''}
            ${entry.realityReflection ? `<div class="history-notes" style="border-color:#10b981; margin-top:4px;"><strong>Reality:</strong> ${escapeHtml(entry.realityReflection)}</div>` : ''}
          </div>
        `;
      }).join('');
    }
  }

  function escapeHtml(text) {
    return text.replace(/[&<>"']/g, function(m) {
      return ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
      })[m];
    });
  }

  // Toast Notification
  let toastTimer;
  function showToast(message, type = '') {
    if (!appToast) return;
    clearTimeout(toastTimer);
    appToast.textContent = message;
    appToast.className = `toast-popup visible ${type}`;
    toastTimer = setTimeout(() => {
      appToast.className = 'toast-popup';
    }, 4000);
  }

  // Handle Form Submission
  if (auditForm) {
    auditForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const userEmail = localStorage.getItem('timeAudit_email');
      const web3Key = localStorage.getItem('timeAudit_web3key');

      // Check if email configured
      if (!userEmail) {
        openSettings();
        showToast('Please set your email first.', 'error');
        return;
      }

      // Collect data
      const date = auditDate.value || todayStr;
      const totalHours = calculateTotalHours();

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

      const workoutSplit = workoutSplitInput?.value || 'N/A';
      const gymExercises = document.getElementById('gymExercises')?.value.trim() || 'No exercise notes';
      const gymIntensity = document.getElementById('gymIntensity')?.value || 'N/A';
      const waterIntake = document.getElementById('waterIntake')?.value || 'N/A';

      const workTasks = document.getElementById('workTasks')?.value.trim() || 'N/A';
      const workWins = document.getElementById('workWins')?.value.trim() || 'None logged';
      const tomorrowPlan = document.getElementById('tomorrowPlan')?.value.trim() || 'None logged';
      const realityReflection = document.getElementById('realityObservation')?.value.trim() || 'None logged';

      // Save to local history
      const newEntry = {
        id: Date.now(),
        date,
        totalHours,
        categories,
        workoutSplit,
        gymExercises,
        workTasks,
        realityReflection
      };

      const historyRaw = localStorage.getItem('timeAudit_history');
      const historyLogs = historyRaw ? JSON.parse(historyRaw) : [];
      historyLogs.unshift(newEntry);
      // Keep last 60 entries
      if (historyLogs.length > 60) historyLogs.pop();
      localStorage.setItem('timeAudit_history', JSON.stringify(historyLogs));

      // Construct Formatted Summary for Email
      const emailSubject = `Mission 1 Time Audit & Daily Report — ${date} [${totalHours}h / 24h]`;
      
      const emailMessage = `
=========================================
MISSION 1 — THE TIME AUDIT (${date})
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

🏋️ GYM & WORKOUT LOG:
• Split / Focus:   ${workoutSplit}
• Intensity:       ${gymIntensity}
• Water Intake:    ${waterIntake}
• Exercises & Sets:
${gymExercises}

💼 DAILY WORK & PRODUCTIVITY:
• Key Completed Tasks:
${workTasks}

• Wins & Highlights:
${workWins}

• Priorities for Tomorrow:
${tomorrowPlan}

👁️ OBSERVE REALITY (Daily Reflection):
${realityReflection}

=========================================
Sent from your Daily Pulse Time Audit Portal
      `.trim();

      // UI loading state
      btnSpinner.style.display = 'inline-block';
      btnSubmitText.textContent = 'Sending to Email...';
      submitReportBtn.disabled = true;

      try {
        if (web3Key) {
          // Send via Web3Forms API
          const response = await fetch('https://api.web3forms.com/submit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              access_key: web3Key,
              subject: emailSubject,
              from_name: 'Daily Pulse Tracker',
              replyto: userEmail,
              to_email: userEmail,
              message: emailMessage,
              date: date,
              total_hours: totalHours,
              ...categories
            })
          });

          const result = await response.json();
          if (result.success) {
            showToast('✅ Audit delivered to your email and saved!', 'success');
          } else {
            fallbackMailto(userEmail, emailSubject, emailMessage);
            showToast('Note: Dispatched via email client.', 'info');
          }
        } else {
          // Direct mailto fallback
          fallbackMailto(userEmail, emailSubject, emailMessage);
          showToast('Audit recorded and opened in your email app!', 'success');
        }
      } catch (err) {
        console.error(err);
        fallbackMailto(userEmail, emailSubject, emailMessage);
        showToast('Saved locally & opened email fallback.', 'info');
      } finally {
        btnSpinner.style.display = 'none';
        btnSubmitText.textContent = '🚀 Send Daily Audit to My Mail';
        submitReportBtn.disabled = false;
      }
    });
  }

  function fallbackMailto(email, subject, body) {
    const mailtoUrl = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
  }

  // Initial runs
  loadSettings();
  calculateTotalHours();
});
