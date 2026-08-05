export const profiles = {
  steady: {
    label: 'Stable relationship',
    contract: 'two-year',
    tenure: 42,
    installationDelay: 2,
    supportTouches: 1,
    autopay: true,
    engagement: 82,
  },
  watch: {
    label: 'Early friction',
    contract: 'one-year',
    tenure: 8,
    installationDelay: 9,
    supportTouches: 3,
    autopay: false,
    engagement: 54,
  },
  priority: {
    label: 'Priority review',
    contract: 'month-to-month',
    tenure: 3,
    installationDelay: 18,
    supportTouches: 6,
    autopay: false,
    engagement: 28,
  },
}

export const distribution = [
  { score: 5, count: 8 }, { score: 10, count: 14 }, { score: 15, count: 21 },
  { score: 20, count: 30 }, { score: 25, count: 43 }, { score: 30, count: 52 },
  { score: 35, count: 57 }, { score: 40, count: 46 }, { score: 45, count: 34 },
  { score: 50, count: 24 }, { score: 55, count: 15 }, { score: 60, count: 9 },
  { score: 65, count: 4 }, { score: 70, count: 2 },
]

export const validation = [
  { label: 'ROC AUC', value: '0.76', note: 'Ranking quality' },
  { label: 'Recall', value: '75%', note: 'At 45% threshold' },
  { label: 'Precision', value: '37%', note: 'Queue quality' },
  { label: 'Brier score', value: '0.20', note: 'Calibration error' },
]

export const governance = [
  ['Scoring moment', 'Only pre-outcome features are eligible'],
  ['Human review', 'The score prioritizes attention, not decisions'],
  ['Fairness', 'Recall and calibration are checked by segment'],
  ['Monitoring', 'Drift and intervention outcomes are reviewed monthly'],
]

export const thresholdCurve = [
  { threshold: 30, queue: 205, recall: 91, precision: 28 },
  { threshold: 35, queue: 174, recall: 85, precision: 32 },
  { threshold: 40, queue: 142, recall: 79, precision: 36 },
  { threshold: 45, queue: 113, recall: 75, precision: 37 },
  { threshold: 50, queue: 88, recall: 66, precision: 47 },
  { threshold: 55, queue: 65, recall: 57, precision: 53 },
  { threshold: 60, queue: 43, recall: 46, precision: 60 },
  { threshold: 65, queue: 26, recall: 34, precision: 66 },
  { threshold: 70, queue: 14, recall: 23, precision: 71 },
]
