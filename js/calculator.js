/* =========================================================
   Best Haryana Solar Energy - ROI Calculator
   Three editable inputs (Bill / System Size / System Cost):
     - Change Bill → derives Size (bill/800 rounded to 0.5, capped 1-10 kW)
                     and Cost (size × ₹65,000/kW). Recalculates.
     - Change Size → derives Cost (size × ₹65,000/kW). Bill stays put.
     - Change Cost → leaves Size/Bill alone. Recalculates only.
   Subsidy always derived from current Size value. Savings from Bill.
   ========================================================= */

(function () {
  'use strict';

  const billInput = document.getElementById('calcBill');
  const sizeInput = document.getElementById('calcSize');
  const costInput = document.getElementById('calcCost');

  if (!billInput || !sizeInput || !costInput) return;

  const out = {
    size:    document.getElementById('outSize'),
    cost:    document.getElementById('outCost'),
    subsidy: document.getElementById('outSubsidy'),
    net:     document.getElementById('outNet'),
    save:    document.getElementById('outSave'),
    payback: document.getElementById('outPayback'),
  };

  const ctaQuote = document.getElementById('calcCtaQuote');
  const COST_PER_KW = 65000;

  // ── Helpers ─────────────────────────────────────────────
  function fmtINR(n) {
    return '₹' + Math.round(n).toLocaleString('en-IN');
  }
  function subsidyFor(kW) {
    if (kW >= 3) return 78000;
    if (kW >= 2) return 60000;
    if (kW >= 1) return 30000;
    return Math.round(30000 * kW);
  }
  function roundHalf(x) { return Math.round(x * 2) / 2; }
  function sizeFromBill(bill) {
    return Math.max(1, Math.min(10, roundHalf(bill / 800)));
  }

  // ── Core recalc: reads current inputs, writes result tiles ─
  function recalc() {
    const bill = parseFloat(billInput.value) || 0;
    const size = parseFloat(sizeInput.value) || 0;
    const cost = parseFloat(costInput.value) || 0;

    const subsidy        = subsidyFor(size);
    const netCost        = Math.max(0, cost - subsidy);
    const monthlySavings = bill * 0.90;
    const annualSavings  = monthlySavings * 12;
    const payback        = annualSavings > 0 ? netCost / annualSavings : 0;
    const lifetime       = (annualSavings * 25) - netCost;

    if (out.size)    out.size.textContent    = size.toFixed(1) + ' kW';
    if (out.cost)    out.cost.textContent    = fmtINR(cost);
    if (out.subsidy) out.subsidy.textContent = fmtINR(subsidy);
    if (out.net)     out.net.textContent     = fmtINR(netCost);
    if (out.save)    out.save.textContent    = fmtINR(lifetime);
    if (out.payback) {
      out.payback.textContent = payback > 0
        ? 'Pays for itself in ~' + payback.toFixed(1) + ' years'
        : 'Enter values above to estimate payback';
    }
  }

  // ── Input handlers ───────────────────────────────────────
  // Bill changes → derive Size and Cost
  function onBillChange() {
    const bill = parseFloat(billInput.value) || 0;
    const size = sizeFromBill(bill);
    sizeInput.value = size.toFixed(1);
    costInput.value = Math.round(size * COST_PER_KW);
    recalc();
  }
  // Size changes → derive Cost from new size, leave Bill alone
  function onSizeChange() {
    const size = parseFloat(sizeInput.value) || 0;
    costInput.value = Math.round(size * COST_PER_KW);
    recalc();
  }
  // Cost changes → just recalc results
  function onCostChange() { recalc(); }

  billInput.addEventListener('input', onBillChange);
  sizeInput.addEventListener('input', onSizeChange);
  costInput.addEventListener('input', onCostChange);

  // ── CTA: scroll to contact form ──────────────────────────
  if (ctaQuote) {
    ctaQuote.addEventListener('click', function (e) {
      e.preventDefault();
      const contact = document.getElementById('contact');
      if (contact) contact.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // Initial render
  recalc();
})();
