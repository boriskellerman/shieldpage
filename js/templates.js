/**
 * ShieldPage — Legal Document Template Engine
 * Generates privacy policies, terms of service, cookie policies, 
 * disclaimers, and refund policies from user inputs.
 * 
 * All generation is client-side. No data leaves the browser.
 */

const ShieldTemplates = {
  
  /**
   * Generate a Privacy Policy
   */
  privacyPolicy(config) {
    const {
      businessName, websiteUrl, businessType, email,
      collectsEmail, collectsName, collectsPhone, collectsAddress,
      collectsPayment, collectsUsageData, collectsCookies,
      collectsLocation, collectsDeviceInfo,
      usesAnalytics, analyticsProvider,
      usesAds, adsProvider,
      usesThirdPartyLogin, loginProviders,
      sellsData, sharesWithThirdParties, thirdPartyNames,
      hasUserAccounts, allowsUserContent,
      targetRegions, // ['us', 'eu', 'ca', 'uk', 'au']
      childrenUnder13,
      lastUpdated
    } = config;

    const date = lastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const dataCollected = [];
    if (collectsName) dataCollected.push('Name');
    if (collectsEmail) dataCollected.push('Email address');
    if (collectsPhone) dataCollected.push('Phone number');
    if (collectsAddress) dataCollected.push('Mailing address');
    if (collectsPayment) dataCollected.push('Payment information (credit card, billing address)');
    if (collectsUsageData) dataCollected.push('Usage data (pages visited, time spent, clicks)');
    if (collectsCookies) dataCollected.push('Cookies and tracking technologies');
    if (collectsLocation) dataCollected.push('Location data');
    if (collectsDeviceInfo) dataCollected.push('Device information (browser type, operating system, IP address)');

    const includeGDPR = targetRegions?.includes('eu') || targetRegions?.includes('uk');
    const includeCCPA = targetRegions?.includes('us');
    const includePIPEDA = targetRegions?.includes('ca');

    let doc = `# Privacy Policy

**Last Updated:** ${date}

## Introduction

${businessName} ("we," "us," or "our") operates ${websiteUrl} (the "Site"). This Privacy Policy explains how we collect, use, disclose, and protect your personal information when you visit our Site${hasUserAccounts ? ' or create an account with us' : ''}.

By using our Site, you agree to the collection and use of information as described in this policy. If you do not agree, please do not use our Site.

## Information We Collect

### Personal Information You Provide

When you ${hasUserAccounts ? 'create an account, ' : ''}use our services, or contact us, we may collect the following:

${dataCollected.map(d => `- ${d}`).join('\n')}

`;

    if (allowsUserContent) {
      doc += `### User-Generated Content

If you post, upload, or share content through our Site, we collect that content and any metadata associated with it.

`;
    }

    if (collectsUsageData || collectsCookies) {
      doc += `### Automatically Collected Information

When you visit our Site, we automatically collect certain information, including:

- Your IP address
- Browser type and version
- Operating system
- Pages you visit and actions you take
- Date and time of your visit
- Referring website
${collectsCookies ? '- Cookie data and similar tracking technologies' : ''}
${collectsLocation ? '- Approximate geographic location based on IP address' : ''}

`;
    }

    doc += `## How We Use Your Information

We use the information we collect for the following purposes:

- To provide, maintain, and improve our services
- To communicate with you, including responding to inquiries
${hasUserAccounts ? '- To manage your account and provide customer support\n' : ''}${collectsPayment ? '- To process transactions and send related information\n' : ''}${usesAnalytics ? '- To analyze usage patterns and improve our Site\n' : ''}- To protect against fraud, unauthorized access, and other illegal activities
- To comply with legal obligations

`;

    // Third-party sharing
    doc += `## How We Share Your Information

${sellsData ? '**We may sell or share your personal information** with third parties for commercial purposes.' : '**We do not sell your personal information.**'}

We may share your information in the following circumstances:

- **Service Providers:** We share information with vendors who help us operate our business (e.g., hosting, payment processing${usesAnalytics ? ', analytics' : ''}).
${sharesWithThirdParties ? `- **Third-Party Partners:** We may share information with ${thirdPartyNames || 'select partners'} to enhance our services.\n` : ''}- **Legal Requirements:** We may disclose information when required by law, court order, or governmental request.
- **Business Transfers:** In the event of a merger, acquisition, or sale of assets, your information may be transferred.
- **With Your Consent:** We may share information for other purposes with your explicit consent.

`;

    // Analytics & Ads
    if (usesAnalytics || usesAds) {
      doc += `## Analytics and Advertising

`;
      if (usesAnalytics) {
        doc += `We use ${analyticsProvider || 'analytics services'} to understand how visitors interact with our Site. These services may collect information about your online activities over time and across different websites.

`;
      }
      if (usesAds) {
        doc += `We use ${adsProvider || 'advertising services'} to display relevant advertisements. These services may use cookies and similar technologies to serve ads based on your browsing activity.

`;
      }
    }

    // Cookies
    if (collectsCookies) {
      doc += `## Cookies and Tracking

We use cookies and similar tracking technologies to collect information and improve our Site. Types of cookies we use:

- **Essential Cookies:** Required for the Site to function properly.
- **Analytics Cookies:** Help us understand how visitors use our Site.
${usesAds ? '- **Advertising Cookies:** Used to deliver relevant advertisements.\n' : ''}- **Preference Cookies:** Remember your settings and preferences.

You can manage cookie preferences through your browser settings. Note that disabling cookies may affect Site functionality.

`;
    }

    // Data retention
    doc += `## Data Retention

We retain your personal information for as long as necessary to fulfill the purposes described in this policy, unless a longer retention period is required by law. When we no longer need your information, we will securely delete or anonymize it.

`;

    // Security
    doc += `## Data Security

We implement reasonable technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.

`;

    // User rights
    doc += `## Your Rights

Depending on your location, you may have the following rights regarding your personal information:

- **Access:** Request a copy of the personal information we hold about you.
- **Correction:** Request correction of inaccurate or incomplete information.
- **Deletion:** Request deletion of your personal information.
- **Opt-Out:** Opt out of marketing communications at any time.
${hasUserAccounts ? '- **Account Deletion:** Request deletion of your account and associated data.\n' : ''}
To exercise any of these rights, contact us at ${email}.

`;

    // GDPR
    if (includeGDPR) {
      doc += `## European Privacy Rights (GDPR)

If you are located in the European Economic Area (EEA) or the United Kingdom, you have additional rights under the General Data Protection Regulation (GDPR):

- **Legal Basis:** We process your data based on consent, contractual necessity, legitimate interests, or legal obligations.
- **Data Portability:** You may request your data in a structured, machine-readable format.
- **Right to Object:** You may object to processing based on legitimate interests.
- **Right to Restrict Processing:** You may request restriction of processing in certain circumstances.
- **Withdraw Consent:** Where processing is based on consent, you may withdraw it at any time.
- **Complaint:** You have the right to lodge a complaint with a supervisory authority in your jurisdiction.

**Data Controller:** ${businessName}, ${email}

`;
    }

    // CCPA
    if (includeCCPA) {
      doc += `## California Privacy Rights (CCPA/CPRA)

If you are a California resident, you have the following rights under the California Consumer Privacy Act and California Privacy Rights Act:

- **Right to Know:** You may request details about the categories and specific pieces of personal information we have collected.
- **Right to Delete:** You may request deletion of your personal information, subject to certain exceptions.
- **Right to Opt-Out:** You may opt out of the sale or sharing of your personal information.
- **Right to Non-Discrimination:** We will not discriminate against you for exercising your privacy rights.
${sellsData ? '\n**To opt out of the sale of your personal information,** contact us at ' + email + ' or use the "Do Not Sell My Personal Information" link on our Site.\n' : '\nWe do not sell personal information as defined by the CCPA.\n'}
`;
    }

    // PIPEDA
    if (includePIPEDA) {
      doc += `## Canadian Privacy Rights (PIPEDA)

If you are a Canadian resident, you have rights under the Personal Information Protection and Electronic Documents Act (PIPEDA):

- We obtain meaningful consent for the collection, use, and disclosure of personal information.
- We limit collection to what is necessary for identified purposes.
- You may access and challenge the accuracy of your personal information.
- We are transparent about our privacy practices and policies.

To exercise your rights, contact our Privacy Officer at ${email}.

`;
    }

    // Children
    if (childrenUnder13) {
      doc += `## Children's Privacy

Our Site is not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you believe we have collected information from a child under 13, please contact us at ${email}, and we will promptly delete it.

`;
    } else {
      doc += `## Children's Privacy

Our Site is not directed to individuals under the age of 13, and we do not knowingly collect personal information from children under 13. If we become aware that we have collected information from a child under 13, we will take steps to delete it promptly.

`;
    }

    // Contact
    doc += `## Changes to This Privacy Policy

We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.

## Contact Us

If you have questions or concerns about this Privacy Policy, please contact us:

- **Email:** ${email}
- **Website:** ${websiteUrl}
${businessName ? `- **Business:** ${businessName}\n` : ''}
`;

    return doc;
  },

  /**
   * Generate Terms of Service
   */
  termsOfService(config) {
    const {
      businessName, websiteUrl, email,
      hasUserAccounts, allowsUserContent,
      collectsPayment, offersSubscription,
      refundPolicy, // 'full', 'partial', 'none', 'custom'
      governingLaw, // US state or country
      hasArbitration,
      limitOfLiability,
      lastUpdated
    } = config;

    const date = lastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    let doc = `# Terms of Service

**Last Updated:** ${date}

## Agreement to Terms

By accessing or using ${websiteUrl} (the "Site") operated by ${businessName} ("we," "us," or "our"), you agree to be bound by these Terms of Service ("Terms"). If you do not agree to these Terms, do not use our Site.

## Use of Our Site

### Eligibility

You must be at least 18 years old (or the age of majority in your jurisdiction) to use our Site. By using the Site, you represent and warrant that you meet this requirement.

### Acceptable Use

You agree not to:

- Use the Site for any unlawful purpose or in violation of any applicable laws
- Interfere with or disrupt the Site's infrastructure or security
- Attempt to gain unauthorized access to any part of the Site
- Use automated tools (bots, scrapers) without our written permission
- Transmit viruses, malware, or other harmful code
- Harass, abuse, or harm another person through the Site
- Impersonate any person or entity
- Use the Site to send unsolicited communications (spam)

We reserve the right to terminate or suspend your access for violations of these Terms.

`;

    if (hasUserAccounts) {
      doc += `## User Accounts

### Account Creation

To access certain features, you may need to create an account. You agree to:

- Provide accurate, current, and complete information
- Maintain the security of your password and account
- Promptly update any changes to your information
- Accept responsibility for all activity under your account

### Account Termination

We may suspend or terminate your account at our discretion, with or without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties.

You may delete your account at any time by contacting us at ${email}.

`;
    }

    if (allowsUserContent) {
      doc += `## User Content

### Your Responsibilities

You are solely responsible for any content you post, upload, or share through the Site ("User Content"). You represent that:

- You own or have the necessary rights to post the content
- The content does not infringe on any third party's intellectual property rights
- The content is not illegal, obscene, defamatory, or otherwise objectionable

### License Grant

By posting User Content, you grant us a non-exclusive, worldwide, royalty-free license to use, reproduce, modify, and display your content in connection with operating the Site. This license ends when you delete your content, except where it has been shared with others who have not deleted it.

### Content Moderation

We reserve the right, but have no obligation, to monitor, edit, or remove User Content at our sole discretion.

`;
    }

    doc += `## Intellectual Property

### Our Content

The Site and its original content (excluding User Content), features, and functionality are owned by ${businessName} and are protected by copyright, trademark, and other intellectual property laws. You may not reproduce, distribute, or create derivative works from our content without our express written permission.

### Trademarks

Our name, logo, and all related names, logos, and slogans are our trademarks. You may not use these without our prior written consent.

`;

    if (collectsPayment) {
      doc += `## Payments and Billing

### Payment Terms

${offersSubscription ? 'Subscriptions are billed on a recurring basis. By subscribing, you authorize us to charge your payment method at the applicable rate.' : 'All purchases are subject to the prices listed at the time of purchase.'}

- All prices are in USD unless otherwise stated
- You are responsible for any applicable taxes
- We use third-party payment processors and do not store your full payment information

${offersSubscription ? `### Subscription Cancellation

You may cancel your subscription at any time. Cancellation takes effect at the end of the current billing period. No refunds are provided for partial billing periods.

` : ''}`;

      // Refund section
      if (refundPolicy === 'full') {
        doc += `### Refunds

We offer full refunds within 30 days of purchase, no questions asked. To request a refund, contact us at ${email}.

`;
      } else if (refundPolicy === 'partial') {
        doc += `### Refunds

Refund requests are evaluated on a case-by-case basis. Please contact us at ${email} within 14 days of purchase to request a refund.

`;
      } else if (refundPolicy === 'none') {
        doc += `### Refunds

All sales are final. We do not offer refunds except as required by applicable law.

`;
      }
    }

    doc += `## Disclaimers

The Site and its content are provided on an "AS IS" and "AS AVAILABLE" basis. We make no warranties, express or implied, including but not limited to:

- Merchantability or fitness for a particular purpose
- Accuracy, reliability, or completeness of any content
- Uninterrupted or error-free operation of the Site
- Security of data transmitted through the Site

Your use of the Site is at your sole risk.

## Limitation of Liability

${limitOfLiability ? `To the maximum extent permitted by law, ${businessName} shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly. Our total liability for any claim arising from these Terms shall not exceed the amount you paid us in the 12 months preceding the claim, or $100, whichever is greater.` : `To the maximum extent permitted by law, ${businessName} and its officers, directors, employees, and agents shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the Site.`}

## Indemnification

You agree to indemnify and hold harmless ${businessName}, its officers, directors, employees, and agents from any claims, losses, damages, liabilities, and expenses (including attorneys' fees) arising from your use of the Site, violation of these Terms, or infringement of any third party's rights.

`;

    if (hasArbitration) {
      doc += `## Dispute Resolution

### Arbitration

Any disputes arising from these Terms or your use of the Site shall be resolved through binding arbitration in accordance with the rules of the American Arbitration Association. Arbitration shall take place in ${governingLaw || 'the United States'}, and the arbitrator's decision shall be final and binding.

### Class Action Waiver

You agree to resolve disputes individually and waive any right to participate in a class action lawsuit or class-wide arbitration.

`;
    }

    doc += `## Governing Law

These Terms shall be governed by and construed in accordance with the laws of ${governingLaw || 'the United States'}, without regard to its conflict of law provisions.

## Changes to These Terms

We reserve the right to modify these Terms at any time. We will notify users of material changes by posting the revised Terms on this page and updating the "Last Updated" date. Your continued use of the Site after changes constitutes acceptance of the new Terms.

## Severability

If any provision of these Terms is found to be invalid or unenforceable, the remaining provisions shall continue in full force and effect.

## Contact Us

If you have questions about these Terms, please contact us:

- **Email:** ${email}
- **Website:** ${websiteUrl}
${businessName ? `- **Business:** ${businessName}\n` : ''}
`;

    return doc;
  },

  /**
   * Generate Cookie Policy
   */
  cookiePolicy(config) {
    const {
      businessName, websiteUrl, email,
      usesAnalytics, analyticsProvider,
      usesAds, adsProvider,
      usesThirdPartyLogin, loginProviders,
      targetRegions,
      lastUpdated
    } = config;

    const date = lastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const includeGDPR = targetRegions?.includes('eu') || targetRegions?.includes('uk');

    let doc = `# Cookie Policy

**Last Updated:** ${date}

## What Are Cookies?

Cookies are small text files stored on your device (computer, tablet, or mobile) when you visit a website. They help the website remember your preferences and understand how you interact with it.

## How ${businessName} Uses Cookies

We use cookies and similar technologies on ${websiteUrl} for the following purposes:

### Essential Cookies

These cookies are necessary for the Site to function properly. They enable core features like security, network management, and accessibility. You cannot opt out of these cookies.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| session_id | Maintains your session | Session |
| csrf_token | Security protection | Session |
| cookie_consent | Remembers your cookie preference | 1 year |

### Functional Cookies

These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| language | Remembers your language preference | 1 year |
| theme | Remembers your display preferences | 1 year |

`;

    if (usesAnalytics) {
      doc += `### Analytics Cookies

We use ${analyticsProvider || 'analytics services'} to understand how visitors use our Site. These cookies collect information in an anonymous form.

| Cookie | Purpose | Duration |
|--------|---------|----------|
${analyticsProvider === 'Google Analytics' ? '| _ga | Distinguishes users | 2 years |\n| _gid | Distinguishes users | 24 hours |\n| _gat | Throttles request rate | 1 minute |' : '| analytics_id | Tracks anonymous usage | 1 year |'}

`;
    }

    if (usesAds) {
      doc += `### Advertising Cookies

${adsProvider || 'Advertising services'} may set cookies to deliver relevant advertisements and measure their effectiveness.

| Cookie | Purpose | Duration |
|--------|---------|----------|
| ad_id | Serves relevant ads | 90 days |
| conversion | Tracks ad effectiveness | 30 days |

`;
    }

    if (usesThirdPartyLogin) {
      doc += `### Third-Party Login Cookies

If you sign in using ${loginProviders || 'a third-party service'}, additional cookies may be set by that provider to manage your authentication.

`;
    }

    doc += `## Managing Cookies

### Browser Settings

Most web browsers allow you to manage cookies through their settings. You can:

- **Block all cookies:** This may affect Site functionality
- **Delete existing cookies:** Removes stored preferences
- **Allow only first-party cookies:** Blocks third-party tracking

### Browser-Specific Instructions

- **Chrome:** Settings → Privacy and Security → Cookies
- **Firefox:** Settings → Privacy & Security → Cookies
- **Safari:** Preferences → Privacy → Cookies
- **Edge:** Settings → Cookies and site permissions

### Opt-Out Tools

${usesAnalytics && analyticsProvider === 'Google Analytics' ? '- **Google Analytics:** Install the [Google Analytics Opt-Out Browser Add-on](https://tools.google.com/dlpage/gaoptout)\n' : ''}- **General:** Visit [Your Online Choices](https://www.youronlinechoices.com/) or [NAI Opt-Out](https://optout.networkadvertising.org/)

`;

    if (includeGDPR) {
      doc += `## Consent (EU/UK Visitors)

Under the GDPR and ePrivacy Directive, we require your consent before placing non-essential cookies on your device. When you first visit our Site, you will see a cookie consent banner where you can accept or decline optional cookies.

You can change your cookie preferences at any time by clearing your cookies and revisiting the Site.

`;
    }

    doc += `## Changes to This Cookie Policy

We may update this Cookie Policy periodically. Changes will be posted on this page with an updated "Last Updated" date.

## Contact Us

If you have questions about our use of cookies, please contact us:

- **Email:** ${email}
- **Website:** ${websiteUrl}

`;

    return doc;
  },

  /**
   * Generate Disclaimer
   */
  disclaimer(config) {
    const {
      businessName, websiteUrl, email,
      businessType, // 'blog', 'ecommerce', 'saas', 'consulting', 'education', 'health', 'finance', 'legal'
      hasAffiliateLinks,
      providesAdvice,
      lastUpdated
    } = config;

    const date = lastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

    let doc = `# Disclaimer

**Last Updated:** ${date}

## General Disclaimer

The information provided on ${websiteUrl} (the "Site") by ${businessName} is for general informational purposes only. All information on the Site is provided in good faith. However, we make no representation or warranty of any kind, express or implied, regarding the accuracy, adequacy, validity, reliability, availability, or completeness of any information on the Site.

Under no circumstance shall we have any liability to you for any loss or damage of any kind incurred as a result of the use of the Site or reliance on any information provided on the Site. Your use of the Site and your reliance on any information on the Site is solely at your own risk.

`;

    if (providesAdvice || ['health', 'finance', 'legal', 'education'].includes(businessType)) {
      doc += `## Professional Disclaimer

The Site does not provide ${businessType === 'health' ? 'medical' : businessType === 'finance' ? 'financial' : businessType === 'legal' ? 'legal' : 'professional'} advice. The content is not intended to be a substitute for professional ${businessType === 'health' ? 'medical advice, diagnosis, or treatment' : businessType === 'finance' ? 'financial advice from a qualified advisor' : businessType === 'legal' ? 'legal advice from a licensed attorney' : 'advice from a qualified professional'}.

Always seek the advice of a qualified professional with any questions you may have. Never disregard professional advice or delay seeking it because of something you read on this Site.

`;
    }

    doc += `## External Links Disclaimer

The Site may contain links to third-party websites or services that are not owned or controlled by ${businessName}. We have no control over, and assume no responsibility for, the content, privacy policies, or practices of any third-party websites or services.

We strongly advise you to read the terms and conditions and privacy policies of any third-party websites that you visit.

`;

    if (hasAffiliateLinks) {
      doc += `## Affiliate Disclosure

Some of the links on this Site are affiliate links. This means if you click on the link and purchase an item, we may receive an affiliate commission at no additional cost to you. We only recommend products or services that we believe will add value to our readers.

This affiliate disclosure is provided in accordance with the Federal Trade Commission's guidelines on endorsements and testimonials.

`;
    }

    doc += `## Testimonials Disclaimer

The Site may contain testimonials from users of our products and/or services. These testimonials reflect the real-life experiences and opinions of those users. However, the experiences are personal and may not be representative of all users. We do not claim, and you should not assume, that all users will have the same experiences.

## "Use at Your Own Risk" Disclaimer

All information on the Site is provided "as is," with no guarantee of completeness, accuracy, timeliness, or of the results obtained from the use of this information, and without warranty of any kind, express or implied.

## Errors and Omissions Disclaimer

While we strive to ensure the information on the Site is correct, we are not responsible for errors or omissions, or for the results obtained from the use of this information. All information on the Site is provided with no guarantee of completeness, accuracy, or timeliness.

## Contact Us

If you have questions about this Disclaimer, please contact us:

- **Email:** ${email}
- **Website:** ${websiteUrl}

`;

    return doc;
  },

  /**
   * Generate Refund Policy
   */
  refundPolicy(config) {
    const {
      businessName, websiteUrl, email,
      businessType, // 'digital', 'physical', 'saas', 'service'
      refundWindow, // days
      refundType, // 'full', 'partial', 'store-credit', 'none'
      conditions, // array of conditions
      lastUpdated
    } = config;

    const date = lastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    const windowDays = refundWindow || 30;

    let doc = `# Refund Policy

**Last Updated:** ${date}

## Overview

At ${businessName}, we want you to be satisfied with your purchase. This Refund Policy outlines the terms and conditions for requesting a refund.

`;

    if (refundType === 'full') {
      doc += `## Our Guarantee

We offer a **${windowDays}-day money-back guarantee** on all purchases. If you are not completely satisfied, you may request a full refund within ${windowDays} days of your purchase — no questions asked.

`;
    } else if (refundType === 'partial') {
      doc += `## Refund Terms

Refund requests are considered on a case-by-case basis within **${windowDays} days** of purchase. Refunds may be issued in full or partial amount depending on the circumstances.

`;
    } else if (refundType === 'store-credit') {
      doc += `## Refund Terms

We offer **store credit** for eligible returns within **${windowDays} days** of purchase. Store credit does not expire and can be applied to any future purchase.

`;
    } else {
      doc += `## Refund Terms

All sales are final. We do not offer refunds except as required by applicable law.

`;
    }

    if (businessType === 'digital') {
      doc += `## Digital Products

Due to the nature of digital products, refunds are handled as follows:

- Refund requests must be made within ${windowDays} days of purchase
- We may ask for a brief explanation to help us improve our products
- Refunds are processed to the original payment method
- Processing time is typically 5-10 business days

`;
    } else if (businessType === 'saas') {
      doc += `## Subscription Services

- You may cancel your subscription at any time
- Cancellation takes effect at the end of the current billing period
- No refunds are provided for partial billing periods
- Annual subscriptions may be eligible for a prorated refund within the first ${windowDays} days
- Free trial periods do not require payment and no refund is applicable

`;
    } else if (businessType === 'physical') {
      doc += `## Physical Products

### Eligible Returns

To be eligible for a return:

- Items must be returned within ${windowDays} days of delivery
- Items must be in original condition, unused, and in original packaging
- You must provide proof of purchase (receipt or order confirmation)

### Return Shipping

- Return shipping costs are the responsibility of the customer
- We recommend using a trackable shipping method
- We are not responsible for items lost in return transit

### Damaged or Defective Items

If you receive a damaged or defective item, please contact us within 48 hours of delivery. We will provide a prepaid return label and full refund or replacement.

`;
    }

    doc += `## How to Request a Refund

To request a refund:

1. Email us at ${email} with your order details
2. Include your order number and reason for the refund request
3. We will respond within 2 business days with next steps

## Processing Time

Approved refunds are processed within 5-10 business days. The time for the refund to appear in your account depends on your payment provider.

## Exceptions

We reserve the right to refuse a refund if:

- The request falls outside the ${windowDays}-day window
- There is evidence of fraud or abuse
- The product was substantially used or consumed${businessType === 'digital' ? '\n- The digital product was downloaded and used extensively' : ''}

## Contact Us

For refund inquiries, please contact:

- **Email:** ${email}
- **Website:** ${websiteUrl}

`;

    return doc;
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.ShieldTemplates = ShieldTemplates;
}
if (typeof module !== 'undefined') {
  module.exports = ShieldTemplates;
}
