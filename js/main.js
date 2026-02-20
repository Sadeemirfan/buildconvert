// BuildConvert - Main JavaScript
'use strict';

// Mobile menu toggle
document.addEventListener('DOMContentLoaded', () => {
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');
  if (menuBtn) {
    menuBtn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const answer = btn.nextElementSibling;
      const icon = btn.querySelector('.faq-icon');
      answer.classList.toggle('active');
      if (icon) icon.textContent = answer.classList.contains('active') ? 'â' : '+';
    });
  });

  // Initialize converters if on a tool page
  initConverters();
});

// Conversion data
const conversions = {
  'feet-meters': { factor: 0.3048, fromUnit: 'Feet', toUnit: 'Meters', formula: 'meters = feet Ã 0.3048' },
  'meters-feet': { factor: 3.28084, fromUnit: 'Meters', toUnit: 'Feet', formula: 'feet = meters Ã 3.28084' },
  'inches-cm': { factor: 2.54, fromUnit: 'Inches', toUnit: 'Centimeters', formula: 'cm = inches Ã 2.54' },
  'cm-inches': { factor: 0.393701, fromUnit: 'Centimeters', toUnit: 'Inches', formula: 'inches = cm Ã 0.393701' },
  'sqft-sqm': { factor: 0.092903, fromUnit: 'Square Feet', toUnit: 'Square Meters', formula: 'sq m = sq ft Ã 0.092903' },
  'sqm-sqft': { factor: 10.7639, fromUnit: 'Square Meters', toUnit: 'Square Feet', formula: 'sq ft = sq m Ã 10.7639' },
  'lbs-kg': { factor: 0.453592, fromUnit: 'Pounds', toUnit: 'Kilograms', formula: 'kg = lbs Ã 0.453592' },
  'kg-lbs': { factor: 2.20462, fromUnit: 'Kilograms', toUnit: 'Pounds', formula: 'lbs = kg Ã 2.20462' },
  'gallons-liters': { factor: 3.78541, fromUnit: 'Gallons', toUnit: 'Liters', formula: 'liters = gallons Ã 3.78541' },
  'liters-gallons': { factor: 0.264172, fromUnit: 'Liters', toUnit: 'Gallons', formula: 'gallons = liters Ã 0.264172' },
  'cuft-cum': { factor: 0.0283168, fromUnit: 'Cubic Feet', toUnit: 'Cubic Meters', formula: 'cu m = cu ft Ã 0.0283168' },
  'cum-cuft': { factor: 35.3147, fromUnit: 'Cubic Meters', toUnit: 'Cubic Feet', formula: 'cu ft = cu m Ã 35.3147' },
  'bar-psi': { factor: 14.5038, fromUnit: 'Bar', toUnit: 'PSI', formula: 'PSI = Bar Ã 14.5038' },
  'psi-bar': { factor: 0.0689476, fromUnit: 'PSI', toUnit: 'Bar', formula: 'Bar = PSI Ã 0.0689476' },
  'btu-watts': { factor: 0.293071, fromUnit: 'BTU/hr', toUnit: 'Watts', formula: 'Watts = BTU/hr Ã 0.293071' },
  'watts-btu': { factor: 3.41214, fromUnit: 'Watts', toUnit: 'BTU/hr', formula: 'BTU/hr = Watts Ã 3.41214' },
  'miles-km': { factor: 1.60934, fromUnit: 'Miles', toUnit: 'Kilometers', formula: 'km = miles Ã 1.60934' },
  'km-miles': { factor: 0.621371, fromUnit: 'Kilometers', toUnit: 'Miles', formula: 'miles = km Ã 0.621371' },
  'oz-grams': { factor: 28.3495, fromUnit: 'Ounces', toUnit: 'Grams', formula: 'grams = oz Ã 28.3495' },
  'grams-oz': { factor: 0.035274, fromUnit: 'Grams', toUnit: 'Ounces', formula: 'oz = grams Ã 0.035274' },
  'ftlbs-nm': { factor: 1.35582, fromUnit: 'Foot-Pounds', toUnit: 'Newton-Meters', formula: 'NÂ·m = ftÂ·lbs Ã 1.35582' },
  'nm-ftlbs': { factor: 0.737562, fromUnit: 'Newton-Meters', toUnit: 'Foot-Pounds', formula: 'ftÂ·lbs = NÂ·m Ã 0.737562' },
  'celsius-fahrenheit': { factor: null, fromUnit: 'Â°C', toUnit: 'Â°F', formula: 'Â°F = (Â°C Ã 9/5) + 32', custom: v => (v * 9/5) + 32 },
  'fahrenheit-celsius': { factor: null, fromUnit: 'Â°F', toUnit: 'Â°C', formula: 'Â°C = (Â°F â 32) Ã 5/9', custom: v => (v - 32) * 5/9 }
};

// Lumber dimension data (nominal to actual)
const lumberSizes = {
  '1x2': { imperial: '0.75" Ã 1.5"', metric: '19mm Ã 38mm' },
  '1x4': { imperial: '0.75" Ã 3.5"', metric: '19mm Ã 89mm' },
  '1x6': { imperial: '0.75" Ã 5.5"', metric: '19mm Ã 140mm' },
  '2x4': { imperial: '1.5" Ã 3.5"', metric: '38mm Ã 89mm' },
  '2x6': { imperial: '1.5" Ã 5.5"', metric: '38mm Ã 140mm' },
  '2x8': { imperial: '1.5" Ã 7.25"', metric: '38mm Ã 184mm' },
  '2x10': { imperial: '1.5" Ã 9.25"', metric: '38mm Ã 235mm' },
  '2x12': { imperial: '1.5" Ã 11.25"', metric: '38mm Ã 286mm' },
  '4x4': { imperial: '3.5" Ã 3.5"', metric: '89mm Ã 89mm' },
  '6x6': { imperial: '5.5" Ã 5.5"', metric: '140mm Ã 140mm' }
};

// Wire gauge data (AWG to mm)
const wireGauges = {
  '0000': 11.684, '000': 10.405, '00': 9.266, '0': 8.251,
  '1': 7.348, '2': 6.544, '4': 5.189, '6': 4.115,
  '8': 3.264, '10': 2.588, '12': 2.053, '14': 1.628,
  '16': 1.291, '18': 1.024, '20': 0.812, '22': 0.644
};

// Pipe sizes (inches to mm)
const pipeSizes = {
  '1/8': 6.35, '1/4': 8.0, '3/8': 12.7, '1/2': 15.0,
  '3/4': 20.0, '1': 25.0, '1-1/4': 32.0, '1-1/2': 40.0,
  '2': 50.0, '2-1/2': 65.0, '3': 80.0, '4': 100.0,
  '6': 150.0, '8': 200.0
};

function initConverters() {
  const converterEl = document.getElementById('converter');
  if (!converterEl) return;

  const type = converterEl.dataset.type;
  const inputEl = document.getElementById('conv-input');
  const resultEl = document.getElementById('conv-result');
  const swapBtn = document.getElementById('swap-btn');

  if (!inputEl || !resultEl) return;

  let currentType = type;

  function convert() {
    const val = parseFloat(inputEl.value);
    if (isNaN(val)) { resultEl.textContent = 'Enter a number'; return; }
    const conv = conversions[currentType];
    if (!conv) return;
    let result;
    if (conv.custom) {
      result = conv.custom(val);
    } else {
      result = val * conv.factor;
    }
    resultEl.textContent = val.toLocaleString() + ' ' + conv.fromUnit + ' = ' + result.toFixed(4).replace(/\.?0+$/, '') + ' ' + conv.toUnit;
  }

  inputEl.addEventListener('input', convert);

  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      const parts = currentType.split('-');
      if (parts.length === 2) {
        currentType = parts[1] + '-' + parts[0];
        convert();
      }
    });
  }

  // Concrete calculator
  const concreteBtn = document.getElementById('calc-concrete');
  if (concreteBtn) {
    concreteBtn.addEventListener('click', () => {
      const l = parseFloat(document.getElementById('c-length').value);
      const w = parseFloat(document.getElementById('c-width').value);
      const d = parseFloat(document.getElementById('c-depth').value);
      if (isNaN(l) || isNaN(w) || isNaN(d)) { resultEl.textContent = 'Enter all dimensions'; return; }
      const cuFt = l * w * (d / 12);
      const cuYd = cuFt / 27;
      const cuM = cuFt * 0.0283168;
      resultEl.innerHTML = 'Volume: ' + cuFt.toFixed(2) + ' cu ft = ' + cuYd.toFixed(2) + ' cu yd = ' + cuM.toFixed(2) + ' cu m<br>Recommended order (10% extra): ' + (cuYd * 1.1).toFixed(2) + ' cu yd';
    });
  }
}

// Lazy load images
if ('IntersectionObserver' in window) {
  const imgObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
        }
        imgObserver.unobserve(img);
      }
    });
  });
  document.querySelectorAll('img[data-src]').forEach(img => imgObserver.observe(img));
}
