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
  9: 'Agression and Humanitarian.',
  11: 'Intuition and inspired vision (master number).',
  22: 'Master builder energy and grounded manifestation.',
  33: 'Compassionate teaching and healing (master number).'
};

const LUCKY_COLORS_BY_NUMBER = {
  1: ['Red', 'Orange'], 2: ['White', 'Silver'], 3: ['Yellow', 'Gold'],
  4: ['Blue', 'Grey'], 5: ['Green', 'Turquoise'], 6: ['Pink'],
  7: ['Black&White'], 8: ['Navy Blue', 'Black'], 9: ['Maroon', 'Crimson']
};

const COMPATIBLE_NUMBERS = {
  1: [2, 3, 9], 2: [1, 5], 3: [1, 2, 9], 4: [6, 8],
  5: [1, 6], 6: [4, 5, 7, 8], 7: [6, 9], 8: [4, 5, 6], 9: [1, 2, 3, 7]
};

const LUCKY_DAYS = {
  1: ['Sunday', 'Monday', 'Tuesday', 'Thursday'], 2: ['Sunday', 'Monday', 'Wednesday'], 3: ['Sunday', 'Monday', 'Tuesday', 'Thursday'],
  4: ['Friday', 'Saturday'], 5: ['Wednesday', 'Friday', 'Sunday'], 6: ['Wednesday', 'Friday', 'Saturday'],
  7: ['Wednesday', 'Thursday', 'Friday'], 8: ['Wednesday', 'Friday', 'Saturday'], 9: ['Sunday', 'Monday', 'Tuesday', 'Thursday']
};

const LUCKY_DIRECTION = {
  1: 'East', 2: 'Northwest', 3: 'Northeast', 4: 'Southwest', 5: 'North',
  6: 'Southeast', 7: 'Northest', 8: 'West', 9: 'South'
};

function reduceNumber(value) {
  let n = Math.abs(Number(value));
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

function kuaNumberFromDate(dateText) {
  const [year] = dateText.split('-').map(Number);
  const reducedYear = reduceNumber(sumDigits(String(year)));
  let kua = 11 - reducedYear;
  while (kua <= 0) kua += 9;
  return reduceNumber(kua);
}

function firstAlphabetFromName(fullName) {
  const firstLetter = (fullName.toUpperCase().match(/[A-Z]/) || [null])[0];
  return firstLetter ? `${firstLetter} (${LETTER_VALUES[firstLetter]})` : '-';
}

function firstVowelFromName(fullName) {
  const firstVowel = (fullName.toUpperCase().match(/[AEIOU]/) || [null])[0];
  return firstVowel ? `${firstVowel} (${LETTER_VALUES[firstVowel]})` : '-';
}

function getPinnaclesFromDate(dateText) {
  const [year, month, day] = dateText.split('-').map(Number);
  const m = reduceNumber(month);
  const d = reduceNumber(day);
  const y = reduceNumber(year);

  const p1 = reduceNumber(m + d);
  const p2 = reduceNumber(d + y);
  const p3 = reduceNumber(p1 + p2);
  const p4 = reduceNumber(m + y);

  return [p1, p2, p3, p4];
}

function getChallengesFromDate(dateText) {
  const [year, month, day] = dateText.split('-').map(Number);
  const m = reduceNumber(month);
  const d = reduceNumber(day);
  const y = reduceNumber(year);

  const c1 = reduceNumber(Math.abs(d - m));
  const c2 = reduceNumber(Math.abs(d - y));
  const c3 = reduceNumber(Math.abs(c1 - c2));
  const c4 = reduceNumber(Math.abs(m - y));

  return [c1, c2, c3, c4];
}

function getPlanesFromName(fullName) {
  const letters = fullName.toUpperCase().match(/[A-Z]/g) || [];
  const countsByValue = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0, 6: 0, 7: 0, 8: 0, 9: 0 };

  letters.forEach((letter) => {
    const value = LETTER_VALUES[letter];
    countsByValue[value] += 1;
  });

  const plane1 = countsByValue[1] + countsByValue[8]; // mental
  const plane2 = countsByValue[4] + countsByValue[5]; // physical
  const plane3 = countsByValue[2] + countsByValue[3] + countsByValue[6]; // emotional
  const plane4 = countsByValue[7] + countsByValue[9]; // intuitive

  return [plane1, plane2, plane3, plane4];
}

function getDobInsights(dateText) {
  const luckyNumber = lifePathFromDate(dateText);
  const birthNumber = birthNumberFromDate(dateText);
  const kuaNumber = kuaNumberFromDate(dateText);
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
    kuaNumber,
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

  return {
    destinyNumber,
    heartNumber,
    personalityNumber,
    habitNumber,
    firstAlphabet: firstAlphabetFromName(fullName),
    firstVowel: firstVowelFromName(fullName)
  };
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
  const bef = getPinnaclesFromDate(birthDate).join(' / ');
  const pinnacles = getPinnaclesFromDate(birthDate);
  const challenges = getChallengesFromDate(birthDate);
  const planes = getPlanesFromName(fullName);
  const specialFrequency = reduceNumber(dobInsights.luckyNumber + dobInsights.personalYear + nameInsights.destinyNumber + dobInsights.kuaNumber);

  document.getElementById('lifePath').textContent = lifePath;
  document.getElementById('luckyNumber').textContent = dobInsights.luckyNumber;
  document.getElementById('kuaNumber').textContent = dobInsights.kuaNumber;
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
  document.getElementById('firstAlphabet').textContent = nameInsights.firstAlphabet;
  document.getElementById('firstVowel').textContent = nameInsights.firstVowel;
  document.getElementById('expression').textContent = expression;
  document.getElementById('soulUrge').textContent = soulUrge;
  document.getElementById('personality').textContent = personality;
  document.getElementById('ultimateNumber').textContent = ultimateNumber;
  document.getElementById('bef').textContent = bef;
  document.getElementById('specialFrequency').textContent = specialFrequency;

  document.getElementById('pinnacle1').textContent = pinnacles[0];
  document.getElementById('pinnacle2').textContent = pinnacles[1];
  document.getElementById('pinnacle3').textContent = pinnacles[2];
  document.getElementById('pinnacle4').textContent = pinnacles[3];

  document.getElementById('challenge1').textContent = challenges[0];
  document.getElementById('challenge2').textContent = challenges[1];
  document.getElementById('challenge3').textContent = challenges[2];
  document.getElementById('challenge4').textContent = challenges[3];

  document.getElementById('plane1').textContent = planes[0];
  document.getElementById('plane2').textContent = planes[1];
  document.getElementById('plane3').textContent = planes[2];
  document.getElementById('plane4').textContent = planes[3];

  document.getElementById('summary').textContent = `Life Path ${lifePath}: ${buildSummary(lifePath)}`;
  document.getElementById('results').classList.remove('hidden');
});
