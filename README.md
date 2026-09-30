# Mission 1 — The Time Audit & Daily Tracker

> *"Don't manipulate the numbers. Observe reality."*

A lightweight, mobile-first web portal for tracking your daily 24 hours across the 9 core categories, plus deep-dive logs for Gym and Work, with instant daily email delivery.

---

## 🎯 The 9 Time Audit Categories

Every day consists of exactly 24 hours. The portal features a **24-Hour Reality Gauge** that tracks your hours in real-time across:

1. **Sleep** (Night sleep + naps)
2. **Work** (Deep work + meetings + shallow work)
3. **Phone / Social Media** (Screen time & scrolling)
4. **Food** (Cooking, eating, grocery prep)
5. **Family** (Quality and dedicated time)
6. **Learning** (Reading, courses, upskilling)
7. **Exercise** (Gym, workouts, sports, walking)
8. **Entertainment** (Movies, gaming, leisure)
9. **Random / Unplanned Time** (Waiting, commuting, lost time)

---

## 🏋️ Daily Gym & Work Sections

- **Gym Log:** Workout split chips (Push, Pull, Legs, Shoulders, Cardio, Full Body, Rest), exercises & weights, workout intensity, and water intake.
- **Work Log:** Key deliverables & tasks completed, major wins, and top priorities for tomorrow.
- **Observe Reality:** An honest reflection on where your time went and what surprised you today.

---

## 📧 Daily Email Forwarding

When you tap **🚀 Send Daily Audit to My Mail**:
- The portal formats your complete breakdown (24h time distribution, Gym details, Work summary, and Reflections).
- It delivers it directly to your email inbox.
- It also archives the entry locally on your phone so you can view past entries in the **History** tab anytime.

### Setup (Takes 30 seconds):
1. Tap the **Email / Settings** icon in the top right.
2. Enter your email address.
3. *(Recommended)* Enter a free [Web3Forms Access Key](https://web3forms.com) (free, unlimited, delivered instantly to your email) for seamless 1-tap submission directly from your phone.

---

## 🚀 How to Host It Online for Mobile Access (100% Free)

### Option 1: GitHub Pages (Instant)
```bash
cd /Users/chirukuri.suryava/Desktop/portal
git init
git add .
git commit -m "Initial commit of Time Audit Web Portal"
gh repo create time-audit-portal --public --source=. --push
gh browse # Enable GitHub Pages under Settings > Pages (main branch / root)
```
Your portal will be live at `https://<your-username>.github.io/time-audit-portal/`.

### Option 2: Vercel (1-Click Deployment)
```bash
npx vercel
```
This gives you an instant `https://time-audit-portal.vercel.app` URL to open on your phone.
