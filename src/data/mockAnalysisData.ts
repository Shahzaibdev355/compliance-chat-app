export interface Flag {
  id: string;
  title: string;
  reason: string;
  color: 'red' | 'yellow' | 'green' | 'blue';
  severity: number;
  confidence: number;
  page: number;
  x: number;
  y: number;
  summary: string;
  recommendation: string;
  textSnippet: string;
  lineNumber: number;
  resolved: boolean;
}

export interface AnalysisData {
  documentTitle: string;
  timestamp: string;
  additionalQuery?: string;
  annotatedPdfUrl: string;
  originalPdfUrl: string;
  initialAnswer?: string;
  flags: Flag[];
  recommendations: {
    [key: string]: {
      title: string;
      items: string[];
      resolved: boolean;
    };
  };
}

export const mockAnalysisData: AnalysisData = {
  documentTitle: 'Tax_Compliance_Report_2024.pdf',
  timestamp: 'Jan 15, 2025 at 2:45 PM',
  additionalQuery: localStorage.getItem('additionalQuery') || undefined,
  annotatedPdfUrl: '/sample.pdf',
  originalPdfUrl: '/sample.pdf',
  flags: [
    {
      id: 'flag-1',
      title: 'Missing GST Registration Certificate',
      color: 'red',
      severity: 1,
      confidence: 95,
      page: 1,
      x: 120,
      y: 200,
      summary: 'The document lacks a valid GST registration certificate which is mandatory for claiming input tax credits.',
      recommendation: 'Obtain and attach GST registration certificate from relevant tax authority within 30 days.',
      textSnippet: 'Input tax credit claimed: Rs. 45,000 without GST registration proof',
      lineNumber: 15,
      resolved: false,
    },
    {
      id: 'flag-2',
      title: 'Incomplete Deduction Documentation',
      color: 'red',
      severity: 2,
      confidence: 88,
      page: 2,
      x: 300,
      y: 150,
      summary: 'Claimed deductions under Section 80C lack supporting documentation and receipts.',
      recommendation: 'Provide original receipts and investment certificates for all claimed deductions.',
      textSnippet: 'Section 80C deductions: Rs. 1,50,000 - supporting documents pending',
      lineNumber: 23,
      resolved: false,
    },
    {
      id: 'flag-3',
      title: 'TDS Certificate Discrepancy',
      color: 'yellow',
      severity: 3,
      confidence: 76,
      page: 3,
      x: 200,
      y: 300,
      summary: 'TDS amounts in Form 16 do not match with the amounts shown in annual return.',
      recommendation: 'Cross-verify TDS certificates with salary slips and rectify any discrepancies.',
      textSnippet: 'Form 16 TDS: Rs. 25,000 vs Return TDS: Rs. 28,000',
      lineNumber: 34,
      resolved: false,
    },
    {
      id: 'flag-4',
      title: 'Proper HRA Documentation',
      color: 'yellow',
      severity: 4,
      confidence: 82,
      page: 1,
      x: 400,
      y: 400,
      summary: 'HRA receipts are available but need to be cross-verified with actual rent payments.',
      recommendation: 'Verify rent receipts with bank statements showing actual rent payments.',
      textSnippet: 'HRA claimed: Rs. 2,40,000 with rental receipts attached',
      lineNumber: 18,
      resolved: false,
    },
    {
      id: 'flag-5',
      title: 'Compliant Investment Declarations',
      color: 'green',
      severity: 5,
      confidence: 92,
      page: 4,
      x: 150,
      y: 100,
      summary: 'All investment declarations under Section 80C are properly documented with valid certificates.',
      recommendation: 'Continue maintaining proper documentation for future assessments.',
      textSnippet: 'ELSS investments: Rs. 50,000 with proper AMC certificates',
      lineNumber: 42,
      resolved: false,
    },
    {
      id: 'flag-6',
      title: 'Complete Salary Structure',
      color: 'green',
      severity: 6,
      confidence: 96,
      page: 2,
      x: 350,
      y: 250,
      summary: 'Salary structure and components are clearly defined and compliant with tax regulations.',
      recommendation: 'No action required. Documentation is comprehensive.',
      textSnippet: 'Basic salary: Rs. 8,00,000, HRA: Rs. 2,40,000, Special allowance: Rs. 1,60,000',
      lineNumber: 28,
      resolved: false,
    },
  ],
  recommendations: {
    red: {
      title: 'Critical Issues',
      items: [
        'Obtain GST registration certificate immediately',
        'Collect all missing deduction receipts and certificates',
        'File revised returns if necessary after documentation'
      ],
      resolved: false,
    },
    yellow: {
      title: 'Attention Required',
      items: [
        'Cross-verify all TDS certificates with Form 16',
        'Match HRA receipts with actual bank payments',
        'Review calculation methods for accuracy'
      ],
      resolved: false,
    },
    green: {
      title: 'Compliant Items',
      items: [
        'Continue current documentation practices',
        'Maintain organized records for future assessments',
        'Regular compliance checks recommended'
      ],
      resolved: false,
    },
  },
};