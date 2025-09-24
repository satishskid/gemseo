import type { GeminiResults, StoredGrowthPlan } from '../types';

/**
 * Download data as JSON file
 */
export const downloadAsJSON = (data: any, filename: string): void => {
  try {
    const jsonStr = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${filename}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Cleanup
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Failed to download JSON:', error);
    throw new Error('Unable to download JSON file');
  }
};

/**
 * Download growth plan as formatted PDF
 */
export const downloadAsPDF = async (plan: StoredGrowthPlan): Promise<void> => {
  try {
    // Create a printable HTML document
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) {
      throw new Error('Popup blocked. Please allow popups for this site.');
    }

    const htmlContent = generatePrintableHTML(plan);
    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for content to load, then trigger print dialog
    setTimeout(() => {
      printWindow.print();
      // Optionally close the window after printing
      // printWindow.close();
    }, 250);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw new Error('Unable to generate PDF file');
  }
};

/**
 * Download publishing calendar as CSV
 */
export const downloadCalendarAsCSV = (results: GeminiResults): void => {
  try {
    const { publishingCalendar } = results;
    
    // CSV Header
    const headers = ['Week', 'Day', 'Platform', 'Title', 'Content', 'Notes'];
    const csvContent = [
      headers.join(','),
      ...publishingCalendar.map(item => 
        [
          `"${item.week}"`,
          `"${item.day}"`,
          `"${item.platform}"`,
          `"${item.title.replace(/"/g, '""')}"`,
          `"${item.content.replace(/"/g, '""')}"`,
          `"${item.notes.replace(/"/g, '""')}"`
        ].join(',')
      )
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `publishing-calendar-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    setTimeout(() => URL.revokeObjectURL(url), 100);
  } catch (error) {
    console.error('Failed to download CSV:', error);
    throw new Error('Unable to download CSV file');
  }
};

/**
 * Generate printable HTML content for PDF
 */
const generatePrintableHTML = (plan: StoredGrowthPlan): string => {
  const { results, formData, timestamp } = plan;
  const date = new Date(timestamp).toLocaleDateString();
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Growth Plan - ${plan.businessName}</title>
      <style>
        body { 
          font-family: Arial, sans-serif; 
          margin: 20px; 
          line-height: 1.6;
          color: #333;
        }
        .header { 
          text-align: center; 
          border-bottom: 2px solid #007acc; 
          padding-bottom: 20px; 
          margin-bottom: 30px;
        }
        .section { 
          margin-bottom: 30px; 
          page-break-inside: avoid;
        }
        .section h2 { 
          color: #007acc; 
          border-bottom: 1px solid #ddd; 
          padding-bottom: 5px;
        }
        .keyword-item, .post-item {
          background: #f5f5f5;
          padding: 10px;
          margin: 10px 0;
          border-radius: 5px;
        }
        .calendar-item {
          border: 1px solid #ddd;
          padding: 15px;
          margin: 10px 0;
          border-radius: 5px;
        }
        .checklist-item {
          margin: 5px 0;
        }
        .footer {
          text-align: center;
          margin-top: 50px;
          font-size: 12px;
          color: #666;
        }
        @media print {
          body { margin: 0; }
          .section { page-break-inside: avoid; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Growth Plan Report</h1>
        <h2>${plan.businessName}</h2>
        <p>Generated on ${date}</p>
      </div>

      <div class="section">
        <h2>Business Overview</h2>
        <p><strong>Business Name:</strong> ${formData.businessName}</p>
        <p><strong>Location:</strong> ${formData.pincode}</p>
        <p><strong>Target Audience:</strong> ${formData.targetAudience}</p>
        <p><strong>Description:</strong> ${formData.businessDescription}</p>
      </div>

      <div class="section">
        <h2>Keywords (${results.keywords.length})</h2>
        ${results.keywords.map(k => `
          <div class="keyword-item">
            <strong>${k.keyword}</strong> - ${k.intent}
            <br><em>${k.explanation}</em>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2>Pillar Content</h2>
        <div class="post-item">
          <h3>${results.pillarPost.title}</h3>
          <p>${results.pillarPost.content}</p>
        </div>
      </div>

      <div class="section">
        <h2>Blog Posts (${results.blogPosts.length})</h2>
        ${results.blogPosts.map(post => `
          <div class="post-item">
            <h4>${post.title}</h4>
            <p>${post.content}</p>
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2>Publishing Calendar (${results.publishingCalendar.length} items)</h2>
        ${results.publishingCalendar.map(item => `
          <div class="calendar-item">
            <strong>${item.week} - ${item.day}</strong>
            <br><strong>Platform:</strong> ${item.platform}
            <br><strong>Title:</strong> ${item.title}
            <br><strong>Content:</strong> ${item.content}
            ${item.notes ? `<br><strong>Notes:</strong> ${item.notes}` : ''}
          </div>
        `).join('')}
      </div>

      <div class="section">
        <h2>Quality Checklist (${results.qualityChecklist.length} items)</h2>
        ${results.qualityChecklist.map(item => `
          <div class="checklist-item">
            <strong>${item.task}</strong> - ${item.description}
          </div>
        `).join('')}
      </div>

      <div class="footer">
        <p>Generated by GemSEO - Powered by greybrain.ai</p>
      </div>
    </body>
    </html>
  `;
};

/**
 * Generate filename with timestamp
 */
export const generateFilename = (businessName: string, type: 'json' | 'pdf' | 'csv'): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitizedName = businessName.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  return `growth-plan-${sanitizedName}-${timestamp}`;
};