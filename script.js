const MASTER_NUMBERS = new Set([11, 22, 33]);
const LETTER_VALUES = {
  A: 1, B: 2, C: 3, D: 4, E: 5, F: 6, G: 7, H: 8, I: 9,
  J: 1, K: 2, L: 3, M: 4, N: 5, O: 6, P: 7, Q: 8, R: 9,
  S: 1, T: 2, U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

const INTERPRETATIONS = {
  1: 'Leadership and independence.',
  2: 'Harmony, sensitivity, and diplomacy.',
  3: 'Creativity, expression, and joy.',
  4: 'Practicality, discipline, and structure.',
  5: 'Freedom, change, and curiosity.',
  6: 'Care, responsibility, and service.',
  7: 'Reflection, analysis, and spirituality.',
  8: 'Ambition, achievement, and influence.',
  9: 'Compassion, wisdom, and completion.',
  11: 'Intuition and inspired vision (master number).',
  22: 'Master builder energy and grounded manifestation.',
  33: 'Compassionate teaching and healing (master number).'
};

const LUCKY_COLORS_BY_NUMBER = {
  1: ['Red', 'Orange'], 2: ['White', 'Silver'], 3: ['Yellow', 'Gold'],
  4: ['Blue', 'Grey'], 5: ['Green', 'Turquoise'], 6: ['Pink', 'Royal Blue'],
  7: ['Violet', 'Sea Green'], 8: ['Navy Blue', 'Black'], 9: ['Maroon', 'Crimson'],
  11: ['Electric Blue', 'Pearl White'], 22: ['Steel Blue', 'Emerald'], 33: ['Rose', 'Lavender']
};

const COMPATIBLE_NUMBERS = {
  1: [1, 2, 4, 7], 2: [2, 4, 6, 8], 3: [3, 6, 9], 4: [1, 2, 4, 8],
  5: [1, 5, 6, 7], 6: [2, 3, 6, 9], 7: [1, 5, 7], 8: [2, 4, 8], 9: [3, 6, 9],
  11: [2, 7, 11], 22: [4, 8, 22], 33: [3, 6, 9, 33]
};

const LUCKY_DAYS = {
  1: ['Sunday', 'Monday'], 2: ['Monday', 'Friday'], 3: ['Thursday'],
  4: ['Sunday', 'Saturday'], 5: ['Wednesday', 'Friday'], 6: ['Friday'],
  7: ['Monday', 'Thursday'], 8: ['Saturday'], 9: ['Tuesday', 'Sunday'],
  11: ['Monday', 'Thursday'], 22: ['Saturday', 'Sunday'], 33: ['Friday', 'Sunday']
};

const LUCKY_DIRECTION = {
  1: 'East', 2: 'North', 3: 'Northeast', 4: 'South', 5: 'Northwest',
  6: 'Southeast', 7: 'West', 8: 'Southwest', 9: 'South',
  11: 'East', 22: 'Southwest', 33: 'Northeast'
};

function reduceNumber(value) {
  let n = Number(value);
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = String(n).split('').reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
}

function sumDigits(text) {
  return (text.match(/\d/g) || []).reduce((sum, d) => sum + Number(d), 0);
}

function sumName(name, { vowelsOnly = false, consonantsOnly = false } = {}) {
  const letters = name.toUpperCase().match(/[A-Z]/g) || [];
  return letters.reduce((sum, letter) => {
    const isVowel = /[AEIOU]/.test(letter);
    if (vowelsOnly && !isVowel) return sum;
    if (consonantsOnly && isVowel) return sum;
    return sum + LETTER_VALUES[letter];
  }, 0);
}

function lifePathFromDate(dateText) {
  return reduceNumber(sumDigits(dateText));
}

function birthNumberFromDate(dateText) {
  const day = Number((dateText.split('-')[2] || '0'));
  return reduceNumber(day);
}

function getDobInsights(dateText) {
  const luckyNumber = lifePathFromDate(dateText);
  const birthNumber = birthNumberFromDate(dateText);
  const year = new Date().getFullYear();
  const [y, m, d] = dateText.split('-').map(Number);
  const personalYear = reduceNumber(sumDigits(String(m)) + sumDigits(String(d)) + sumDigits(String(year)));
  const currentYearNumber = reduceNumber(sumDigits(String(y)) + sumDigits(String(year)));
  const talentNumber = reduceNumber(sumDigits(dateText) + birthNumber);
  const nameNumberDob = reduceNumber(sumDigits(dateText) + luckyNumber);
  const compatibleNumbers = COMPATIBLE_NUMBERS[luckyNumber] || [luckyNumber];
  const incompatibleNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((n) => !compatibleNumbers.includes(n));

  return {
    luckyNumber,
    talentNumber,
    birthNumber,
    nameNumberDob,
    personalYear,
    currentYearNumber,
    compatibleNumbers,
    incompatibleNumbers,
    luckyColors: LUCKY_COLORS_BY_NUMBER[luckyNumber] || ['White'],
    luckyDays: LUCKY_DAYS[luckyNumber] || ['Sunday'],
    luckyDirection: LUCKY_DIRECTION[luckyNumber] || 'East'
  };
}

function getNameInsights(fullName) {
  const destinyNumber = reduceNumber(sumName(fullName));
  const heartNumber = reduceNumber(sumName(fullName, { vowelsOnly: true }));
  const personalityNumber = reduceNumber(sumName(fullName, { consonantsOnly: true }));
  const habitNumber = reduceNumber(destinyNumber + personalityNumber);

  return { destinyNumber, heartNumber, personalityNumber, habitNumber };
}

function buildSummary(lifePath) {
  return INTERPRETATIONS[lifePath] || 'A unique path with evolving lessons.';
}

document.getElementById('numerology-form').addEventListener('submit', (event) => {
  event.preventDefault();

  const fullName = document.getElementById('fullName').value.trim();
  const birthDate = document.getElementById('birthDate').value;
  if (!fullName || !birthDate) return;

  const lifePath = lifePathFromDate(birthDate);
  const nameInsights = getNameInsights(fullName);
  const dobInsights = getDobInsights(birthDate);
  const expression = nameInsights.destinyNumber;
  const soulUrge = nameInsights.heartNumber;
  const personality = nameInsights.personalityNumber;
  const ultimateNumber = reduceNumber(dobInsights.luckyNumber + nameInsights.destinyNumber);
  const bep = `${reduceNumber(dobInsights.birthNumber + 36)} / ${reduceNumber(dobInsights.birthNumber + 45)} / ${reduceNumber(dobInsights.birthNumber + 54)} / ${reduceNumber(dobInsights.birthNumber + 63)}`;

  document.getElementById('lifePath').textContent = lifePath;
  document.getElementById('luckyNumber').textContent = dobInsights.luckyNumber;
  document.getElementById('talentNumber').textContent = dobInsights.talentNumber;
  document.getElementById('birthNumber').textContent = dobInsights.birthNumber;
  document.getElementById('nameNumberDob').textContent = dobInsights.nameNumberDob;
  document.getElementById('personalYear').textContent = dobInsights.personalYear;
  document.getElementById('currentYearNumber').textContent = dobInsights.currentYearNumber;
  document.getElementById('compatibleNumbers').textContent = dobInsights.compatibleNumbers.join(', ');
  document.getElementById('incompatibleNumbers').textContent = dobInsights.incompatibleNumbers.join(', ');
  document.getElementById('luckyColors').textContent = dobInsights.luckyColors.join(', ');
  document.getElementById('luckyDays').textContent = dobInsights.luckyDays.join(', ');
  document.getElementById('luckyDirection').textContent = dobInsights.luckyDirection;

  document.getElementById('destinyNumber').textContent = nameInsights.destinyNumber;
  document.getElementById('heartNumber').textContent = nameInsights.heartNumber;
  document.getElementById('habitNumber').textContent = nameInsights.habitNumber;
  document.getElementById('personalityNumber').textContent = nameInsights.personalityNumber;
  document.getElementById('expression').textContent = expression;
  document.getElementById('soulUrge').textContent = soulUrge;
  document.getElementById('personality').textContent = personality;
  document.getElementById('ultimateNumber').textContent = ultimateNumber;
  document.getElementById('bep').textContent = bep;
  document.getElementById('summary').textContent = `Life Path ${lifePath}: ${buildSummary(lifePath)}`;

  document.getElementById('results').classList.remove('hidden');
});
