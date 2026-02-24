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

function reduceNumber(value) {
  let n = Number(value);
  while (n > 9 && !MASTER_NUMBERS.has(n)) {
    n = String(n)
      .split('')
      .reduce((sum, digit) => sum + Number(digit), 0);
  }
  return n;
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
  const digits = dateText.replace(/\D/g, '');
  const total = digits.split('').reduce((sum, d) => sum + Number(d), 0);
  return reduceNumber(total);
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
  const expression = reduceNumber(sumName(fullName));
  const soulUrge = reduceNumber(sumName(fullName, { vowelsOnly: true }));
  const personality = reduceNumber(sumName(fullName, { consonantsOnly: true }));

  document.getElementById('lifePath').textContent = lifePath;
  document.getElementById('expression').textContent = expression;
  document.getElementById('soulUrge').textContent = soulUrge;
  document.getElementById('personality').textContent = personality;
  document.getElementById('summary').textContent = `Life Path ${lifePath}: ${buildSummary(lifePath)}`;

  document.getElementById('results').classList.remove('hidden');
});
