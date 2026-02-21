/**
 * ShieldPage — Generator App Logic
 * Wizard navigation, form handling, preview, export
 */

(function() {
  'use strict';

  // --- STATE ---
  let currentStep = 1;
  const totalSteps = 6;
  let isPremium = false;

  // Check premium status
  function checkPremium() {
    if (localStorage.getItem('shieldpage_premium') === 'true') {
      isPremium = true;
      return;
    }
    const params = new URLSearchParams(window.location.search);
    if (params.get('premium') === 'true' || params.get('success') === 'true') {
      isPremium = true;
      localStorage.setItem('shieldpage_premium', 'true');
      // Clean URL
      window.history.replaceState({}, '', 'generator.html');
    }
  }

  // --- FORM DATA ---
  function getFormData() {
    const get = (id) => {
      const el = document.getElementById(id);
      return el ? el.value.trim() : '';
    };
    const checked = (id) => {
      const el = document.getElementById(id);
      return el ? el.checked : false;
    };

    const regions = [];
    if (checked('region-us')) regions.push('us');
    if (checked('region-eu')) regions.push('eu');
    if (checked('region-ca')) regions.push('ca');
    if (checked('region-uk')) regions.push('uk');
    if (checked('region-au')) regions.push('au');

    return {
      businessName: get('businessName'),
      websiteUrl: get('websiteUrl'),
      email: get('contactEmail'),
      businessType: get('businessType'),
      collectsEmail: checked('collect-email'),
      collectsName: checked('collect-name'),
      collectsPhone: checked('collect-phone'),
      collectsAddress: checked('collect-address'),
      collectsPayment: checked('collect-payment'),
      collectsUsageData: checked('collect-usage'),
      collectsCookies: checked('collect-cookies'),
      collectsLocation: checked('collect-location'),
      collectsDeviceInfo: checked('collect-device'),
      usesAnalytics: checked('uses-analytics'),
      analyticsProvider: get('analyticsProvider'),
      usesAds: checked('uses-ads'),
      adsProvider: get('adsProvider'),
      usesThirdPartyLogin: checked('uses-social-login'),
      loginProviders: get('loginProviders'),
      sellsData: checked('sells-data'),
      sharesWithThirdParties: checked('shares-data'),
      thirdPartyNames: get('thirdPartyNames'),
      hasUserAccounts: checked('has-accounts'),
      allowsUserContent: checked('allows-ugc'),
      hasAffiliateLinks: checked('has-affiliates'),
      targetRegions: regions,
      childrenUnder13: checked('children-under-13'),
      // ToS specific
      offersSubscription: checked('offers-subscription'),
      refundPolicy: get('refundType'),
      governingLaw: get('governingLaw'),
      hasArbitration: checked('has-arbitration'),
      limitOfLiability: true,
      // Disclaimer
      providesAdvice: checked('provides-advice'),
      // Refund
      refundWindow: parseInt(get('refundWindow')) || 30,
      refundType: get('refundType') || 'full',
      lastUpdated: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
    };
  }

  function saveFormData() {
    try {
      const formEls = document.querySelectorAll('input, select, textarea');
      const data = {};
      formEls.forEach(el => {
        if (!el.id) return;
        if (el.type === 'checkbox') data[el.id] = el.checked;
        else data[el.id] = el.value;
      });
      localStorage.setItem('shieldpage_form', JSON.stringify(data));
    } catch(e) {}
  }

  function loadFormData() {
    try {
      const saved = JSON.parse(localStorage.getItem('shieldpage_form'));
      if (!saved) return;
      Object.keys(saved).forEach(id => {
        const el = document.getElementById(id);
        if (!el) return;
        if (el.type === 'checkbox') el.checked = saved[id];
        else el.value = saved[id];
      });
      // Update checkbox visuals
      document.querySelectorAll('.checkbox-item input[type="checkbox"]').forEach(cb => {
        cb.closest('.checkbox-item').classList.toggle('checked', cb.checked);
      });
    } catch(e) {}
  }

  // --- WIZARD NAVIGATION ---
  function showStep(step) {
    currentStep = step;
    // Update form steps
    document.querySelectorAll('.form-step').forEach((s, i) => {
      s.classList.toggle('active', i + 1 === step);
    });
    // Update progress
    document.querySelectorAll('.progress-step').forEach((s, i) => {
      s.classList.remove('active', 'done');
      if (i + 1 === step) s.classList.add('active');
      else if (i + 1 < step) s.classList.add('done');
    });
    document.querySelectorAll('.progress-line').forEach((l, i) => {
      l.classList.toggle('filled', i + 1 < step);
    });
    // If preview step, generate preview
    if (step === totalSteps) {
      generatePreview();
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function nextStep() {
    if (currentStep === 1) {
      // Validate required fields
      const name = document.getElementById('businessName').value.trim();
      const url = document.getElementById('websiteUrl').value.trim();
      const email = document.getElementById('contactEmail').value.trim();
      if (!name || !url || !email) {
        showToast('Please fill in all required fields');
        return;
      }
    }
    saveFormData();
    if (currentStep < totalSteps) showStep(currentStep + 1);
  }

  function prevStep() {
    saveFormData();
    if (currentStep > 1) showStep(currentStep - 1);
  }

  // --- MARKDOWN TO HTML --- 
  function mdToHtml(md) {
    let html = md
      // Headers
      .replace(/^### (.+)$/gm, '<h3>$1</h3>')
      .replace(/^## (.+)$/gm, '<h2>$1</h2>')
      .replace(/^# (.+)$/gm, '<h1>$1</h1>')
      // Bold
      .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
      // Italic
      .replace(/\*(.+?)\*/g, '<em>$1</em>')
      // Links
      .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
      // Unordered lists
      .replace(/^- (.+)$/gm, '<li>$1</li>')
      // Ordered lists
      .replace(/^\d+\. (.+)$/gm, '<li>$1</li>');

    // Wrap consecutive <li> in <ul>
    html = html.replace(/((?:<li>.*<\/li>\n?)+)/g, '<ul>$1</ul>');

    // Tables
    html = html.replace(/^\|(.+)\|$/gm, (match) => {
      const cells = match.split('|').filter(c => c.trim());
      return '<tr>' + cells.map(c => {
        const trimmed = c.trim();
        if (trimmed.match(/^[-:]+$/)) return null;
        return '<td>' + trimmed + '</td>';
      }).filter(Boolean).join('') + '</tr>';
    });
    // Remove separator rows
    html = html.replace(/<tr>(<td>[-:]+<\/td>)+<\/tr>/g, '');
    // Wrap consecutive <tr> in <table>
    html = html.replace(/((?:<tr>.*<\/tr>\n?)+)/g, (match) => {
      // Make first row headers
      return '<table>' + match.replace(/<tr>(.*?)<\/tr>/, (m, inner) => {
        return '<tr>' + inner.replace(/<td>/g, '<th>').replace(/<\/td>/g, '</th>') + '</tr>';
      }) + '</table>';
    });

    // Paragraphs — wrap remaining lines
    html = html.split('\n\n').map(block => {
      block = block.trim();
      if (!block) return '';
      if (block.startsWith('<h') || block.startsWith('<ul') || block.startsWith('<table') || block.startsWith('<tr')) return block;
      // Don't wrap if already block-level
      if (block.match(/^<(h[1-6]|ul|ol|table|div|blockquote)/)) return block;
      return '<p>' + block.replace(/\n/g, '<br>') + '</p>';
    }).join('\n');

    return html;
  }

  // --- PREVIEW ---
  let activeTab = 'privacy';
  const docTypes = {
    privacy: { label: 'Privacy Policy', free: true },
    terms: { label: 'Terms of Service', free: false },
    cookies: { label: 'Cookie Policy', free: false },
    disclaimer: { label: 'Disclaimer', free: false },
    refund: { label: 'Refund Policy', free: false }
  };

  let generatedDocs = {};

  function generatePreview() {
    const config = getFormData();
    generatedDocs = {};

    // Always generate privacy policy
    generatedDocs.privacy = ShieldTemplates.privacyPolicy(config);

    if (isPremium) {
      generatedDocs.terms = ShieldTemplates.termsOfService(config);
      generatedDocs.cookies = ShieldTemplates.cookiePolicy(config);
      generatedDocs.disclaimer = ShieldTemplates.disclaimer(config);
      generatedDocs.refund = ShieldTemplates.refundPolicy(config);
    }

    renderTabs();
    showDoc(activeTab);
  }

  function renderTabs() {
    const tabsEl = document.getElementById('preview-tabs');
    if (!tabsEl) return;
    tabsEl.innerHTML = '';
    Object.keys(docTypes).forEach(key => {
      const dt = docTypes[key];
      const btn = document.createElement('button');
      btn.className = 'preview-tab' + (key === activeTab ? ' active' : '') + (!dt.free && !isPremium ? ' locked' : '');
      btn.textContent = dt.label;
      if (!dt.free && !isPremium) {
        btn.addEventListener('click', () => showUpgradePrompt());
      } else {
        btn.addEventListener('click', () => showDoc(key));
      }
      tabsEl.appendChild(btn);
    });
  }

  function showDoc(key) {
    if (!docTypes[key].free && !isPremium) {
      showUpgradePrompt();
      return;
    }
    activeTab = key;
    renderTabs();
    const contentEl = document.getElementById('preview-content');
    if (!contentEl) return;
    if (generatedDocs[key]) {
      contentEl.innerHTML = mdToHtml(generatedDocs[key]);
    } else {
      showUpgradePrompt();
    }
  }

  function showUpgradePrompt() {
    const contentEl = document.getElementById('preview-content');
    if (!contentEl) return;
    contentEl.innerHTML = `
      <div class="unlock-prompt">
        <h3>🔒 Premium Document</h3>
        <p>Unlock all 5 document types + GDPR, CCPA, and PIPEDA compliance sections for a one-time $9.99 purchase.</p>
        <a href="#" class="btn btn-accent" onclick="handlePurchase(); return false;">Unlock Premium — $9.99 →</a>
        <p style="margin-top:16px;font-size:13px;color:var(--text-lighter);">30-day money-back guarantee</p>
      </div>
    `;
  }

  // --- EXPORT ---
  function copyToClipboard() {
    const doc = generatedDocs[activeTab];
    if (!doc) return;
    navigator.clipboard.writeText(doc).then(() => {
      showToast('Copied to clipboard!');
    }).catch(() => {
      // Fallback
      const ta = document.createElement('textarea');
      ta.value = doc;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      showToast('Copied to clipboard!');
    });
  }

  function downloadMarkdown() {
    const doc = generatedDocs[activeTab];
    if (!doc) return;
    const name = docTypes[activeTab].label.toLowerCase().replace(/\s+/g, '-');
    downloadFile(doc, `${name}.md`, 'text/markdown');
    showToast('Downloaded as Markdown!');
  }

  function downloadHTML() {
    const doc = generatedDocs[activeTab];
    if (!doc) return;
    const name = docTypes[activeTab].label.toLowerCase().replace(/\s+/g, '-');
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${docTypes[activeTab].label}</title>
<style>
body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 0 20px; color: #1f2937; line-height: 1.7; }
h1 { font-size: 28px; margin-bottom: 8px; }
h2 { font-size: 22px; margin: 32px 0 12px; color: #1e40af; }
h3 { font-size: 18px; margin: 20px 0 8px; }
p { margin-bottom: 12px; }
ul { margin-bottom: 12px; padding-left: 24px; }
li { margin-bottom: 4px; }
table { width: 100%; border-collapse: collapse; margin: 16px 0; }
th, td { padding: 10px 14px; border: 1px solid #e5e7eb; text-align: left; font-size: 14px; }
th { background: #f3f4f6; font-weight: 600; }
strong { font-weight: 600; }
a { color: #2563eb; }
</style>
</head>
<body>
${mdToHtml(doc)}
</body>
</html>`;
    downloadFile(html, `${name}.html`, 'text/html');
    showToast('Downloaded as HTML!');
  }

  function downloadFile(content, filename, type) {
    const blob = new Blob([content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  function downloadAll() {
    if (!isPremium) {
      showUpgradePrompt();
      return;
    }
    const config = getFormData();
    // Generate all docs
    const docs = {
      'privacy-policy.md': ShieldTemplates.privacyPolicy(config),
      'terms-of-service.md': ShieldTemplates.termsOfService(config),
      'cookie-policy.md': ShieldTemplates.cookiePolicy(config),
      'disclaimer.md': ShieldTemplates.disclaimer(config),
      'refund-policy.md': ShieldTemplates.refundPolicy(config)
    };
    // Download each
    Object.entries(docs).forEach(([name, content]) => {
      setTimeout(() => downloadFile(content, name, 'text/markdown'), 100);
    });
    showToast('Downloading all documents!');
  }

  // --- PURCHASE ---
  window.handlePurchase = function() {
    // Stripe Checkout redirect will go here
    // For now, show a message
    const stripeUrl = window.STRIPE_CHECKOUT_URL;
    if (stripeUrl) {
      window.location.href = stripeUrl;
    } else {
      showToast('Payment coming soon! Use code LAUNCH for free premium access.');
      // Temporary: unlock for early users
      isPremium = true;
      localStorage.setItem('shieldpage_premium', 'true');
      generatePreview();
    }
  };

  // --- TOAST ---
  function showToast(msg) {
    let toast = document.getElementById('toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'toast';
      toast.className = 'toast';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 3000);
  }

  // --- CONDITIONAL FIELDS ---
  function setupConditionalFields() {
    const toggleMap = {
      'uses-analytics': 'analyticsProviderGroup',
      'uses-ads': 'adsProviderGroup',
      'uses-social-login': 'loginProvidersGroup',
      'shares-data': 'thirdPartyNamesGroup'
    };
    Object.entries(toggleMap).forEach(([checkId, groupId]) => {
      const cb = document.getElementById(checkId);
      const group = document.getElementById(groupId);
      if (cb && group) {
        const update = () => { group.style.display = cb.checked ? 'block' : 'none'; };
        cb.addEventListener('change', update);
        update();
      }
    });
  }

  // --- CHECKBOX UI ---
  function setupCheckboxes() {
    document.querySelectorAll('.checkbox-item').forEach(item => {
      const cb = item.querySelector('input[type="checkbox"]');
      if (!cb) return;
      item.addEventListener('click', (e) => {
        if (e.target === cb) return;
        cb.checked = !cb.checked;
        cb.dispatchEvent(new Event('change'));
        item.classList.toggle('checked', cb.checked);
      });
      cb.addEventListener('change', () => {
        item.classList.toggle('checked', cb.checked);
      });
    });
  }

  // --- INIT ---
  function init() {
    checkPremium();
    loadFormData();
    setupCheckboxes();
    setupConditionalFields();
    showStep(1);

    // Wire up navigation buttons
    document.querySelectorAll('[data-action="next"]').forEach(btn => {
      btn.addEventListener('click', nextStep);
    });
    document.querySelectorAll('[data-action="prev"]').forEach(btn => {
      btn.addEventListener('click', prevStep);
    });

    // Wire up export buttons
    const copyBtn = document.getElementById('btn-copy');
    const dlMdBtn = document.getElementById('btn-download-md');
    const dlHtmlBtn = document.getElementById('btn-download-html');
    const dlAllBtn = document.getElementById('btn-download-all');
    if (copyBtn) copyBtn.addEventListener('click', copyToClipboard);
    if (dlMdBtn) dlMdBtn.addEventListener('click', downloadMarkdown);
    if (dlHtmlBtn) dlHtmlBtn.addEventListener('click', downloadHTML);
    if (dlAllBtn) dlAllBtn.addEventListener('click', downloadAll);

    // Auto-save form on change
    document.querySelectorAll('input, select, textarea').forEach(el => {
      el.addEventListener('change', saveFormData);
      el.addEventListener('input', saveFormData);
    });

    // Show premium badge if premium
    if (isPremium) {
      const badge = document.getElementById('premium-badge');
      if (badge) badge.style.display = 'inline-flex';
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
