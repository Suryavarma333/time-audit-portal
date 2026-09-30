/**
 * Mission 1: The Time Audit & Daily Tracker
 * Mobile Logic, Ergonomic Presets, and Direct Email Dispatch
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

  // Modal Elements
  const targetEmailBadge = document.getElementById('targetEmailBadge');
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsBtn = document.getElementById('closeSettingsBtn');
  const customEmailInput = document.getElementById('customEmailInput');
  const saveEmailBtn = document.getElementById('saveEmailBtn');

  const historyModal = document.getElementById('historyModal');
  const historyModalBtn = document.getElementById('historyModalBtn');
  const closeHistoryBtn = document.getElementById('closeHistoryBtn');
  const closeHistoryBottom = document.getElementById('closeHistoryBottom');
  const historyContainer = document.getElementById('historyContainer');
  const historyEmptyState = document.getElementById('historyEmptyState');
  const clearAllHistory = document.getElementById('clearAllHistory');

  // Category Inputs
  const categoryIds = [
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
    if (btnSubmitText) btnSubmitText.textContent = `🚀 Send to ${userEmail.split('@')[0]}`;
  }
  updateEmailDisplay();

  // Set Today's Date
  const todayStr = new Date().toISOString().split('T')[0];
  if (auditDate) {
    auditDate.value = todayStr;
  }

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

      // Update active state among siblings
      const parentRow = chip.closest('.presets-row');
      if (parentRow) {
        parentRow.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
      }
      chip.classList.add('active');

      calculateTotal();
    });
  });

  // Stepper + and -
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

      // Sync preset chip if matches
      const card = btn.closest('.tap-card');
      if (card) {
        const matchingChip = card.querySelector(`.preset-chip[data-val="${currentVal}"]`);
        card.querySelectorAll('.preset-chip').forEach(c => c.classList.remove('active'));
        if (matchingChip) matchingChip.classList.add('active');
      }

      calculateTotal();
    });
  });

  // Manual input listener
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

  // Auto-Balance to Random/Unplanned Button
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
  // Split Selector
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

  // Quick Exercise Chips
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

  // Intensity Group
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

  // Water Presets
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

  // ================= SETTINGS MODAL =================
  if (targetEmailBadge) targetEmailBadge.addEventListener('click', () => settingsModal.style.display = 'flex');
  if (closeSettingsBtn) closeSettingsBtn.addEventListener('click', () => settingsModal.style.display = 'none');
  if (saveEmailBtn) {
    saveEmailBtn.addEventListener('click', () => {
      const val = customEmailInput.value.trim();
      if (val && val.includes('@')) {
        localStorage.setItem('timeAudit_email', val);
        updateEmailDisplay();
        settingsModal.style.display = 'none';
        showToast('Email address updated!', 'success');
      } else {
        alert('Please enter a valid email address.');
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
        <div class="h-card">
          <div class="h-header">
            <span>📅 ${entry.date}</span>
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

  // ================= SUBMISSION & EMAIL DISPATCH =================
  if (stickySubmitBtn) {
    stickySubmitBtn.addEventListener('click', async () => {
      const email = localStorage.getItem('timeAudit_email') || DEFAULT_EMAIL;
      const date = auditDate?.value || todayStr;
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
        workTasks,
        realityReflection
      };

      const savedList = JSON.parse(localStorage.getItem('timeAudit_history') || '[]');
      savedList.unshift(entry);
      if (savedList.length > 60) savedList.pop();
      localStorage.setItem('timeAudit_history', JSON.stringify(savedList));

      // Construct Formatted Email Body
      const emailSubject = `Mission 1 Time Audit & Daily Report — ${date} [${totalHours}h / 24h]`;
      const emailBody = `
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

      // UI Loading state
      btnSpinner.style.display = 'inline-block';
      btnSubmitText.textContent = 'Sending...';
      stickySubmitBtn.disabled = true;

      try {
        // Attempt sending via FormSubmit API directly to the user's email
        const response = await fetch(`https://formsubmit.co/ajax/${encodeURIComponent(email)}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            _subject: emailSubject,
            Date: date,
            TotalHours: `${totalHours} / 24.0 hrs`,
            Sleep_Hours: categories.sleep,
            Work_Hours: categories.work,
            Phone_Hours: categories.phone,
            Food_Hours: categories.food,
            Family_Hours: categories.family,
            Learning_Hours: categories.learning,
            Exercise_Hours: categories.exercise,
            Entertainment_Hours: categories.entertainment,
            Random_Unplanned_Hours: categories.random,
            Gym_Split: workoutSplit,
            Gym_Intensity: gymIntensity,
            Water_Intake: waterIntake,
            Gym_Exercises: gymExercises,
            Work_Completed: workTasks,
            Work_Wins: workWins,
            Tomorrow_Priorities: tomorrowPlan,
            Observe_Reality_Reflection: realityReflection,
            _template: 'table'
          })
        });

        if (response.ok) {
          showToast('✅ Daily Audit sent to your mail and saved!', 'success');
        } else {
          // Instant direct mailto fallback
          fallbackMailto(email, emailSubject, emailBody);
          showToast('Saved locally & opening in your email app!', 'success');
        }
      } catch (err) {
        console.warn('API submission fallback:', err);
        fallbackMailto(email, emailSubject, emailBody);
        showToast('Saved locally & opening in your email app!', 'success');
      } finally {
        btnSpinner.style.display = 'none';
        btnSubmitText.textContent = `🚀 Send to ${email.split('@')[0]}`;
        stickySubmitBtn.disabled = false;
      }
    });
  }

  function fallbackMailto(email, subject, body) {
    const mailto = `mailto:${encodeURIComponent(email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  }

  // Initial Calculation
  calculateTotal();
});
