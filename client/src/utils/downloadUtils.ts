export const downloadModelCard = (content: string, filename: string): Promise<boolean> => {
  return new Promise((resolve, reject) => {
    try {
      // Create blob with proper encoding
      const blob = new Blob([content], { 
        type: 'text/markdown;charset=utf-8' 
      });
      
      // Create download URL
      const url = URL.createObjectURL(blob);
      
      // Create temporary download link
      const link = document.createElement('a');
      link.href = url;
      link.download = filename;
      link.style.display = 'none';
      
      // Add to DOM and trigger download
      document.body.appendChild(link);
      link.click();
      
      // Clean up after download
      setTimeout(() => {
        try {
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
          resolve(true);
        } catch (cleanupError) {
          console.warn('Cleanup warning:', cleanupError);
          resolve(true); // Still consider successful if download worked
        }
      }, 100);
      
    } catch (error) {
      console.error('Download failed:', error);
      reject(error);
    }
  });
};

export const generateFileName = (modelName: string, extension: string = 'md'): string => {
  const timestamp = new Date().toISOString().split('T')[0];
  const sanitizedName = modelName.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
  return `${sanitizedName}-model-card-${timestamp}.${extension}`;
};

export const validateModelCardContent = (content: string): boolean => {
  try {
    // Basic validation to ensure the content is not empty and contains key sections
    if (!content || content.trim().length === 0) {
      return false;
    }
    
    // Check for essential sections
    const requiredSections = [
      '# Model Card:',
      '## Model Overview',
      '### Performance Metrics',
      '### Compliance Assessment'
    ];
    
    const hasRequiredSections = requiredSections.every(section => content.includes(section));
    
    // Check that there are no undefined values or error strings in the content
    const hasUndefinedValues = content.includes('undefined') || 
                              content.includes('NaN') || 
                              content.includes('[object Object]');
    
    return hasRequiredSections && !hasUndefinedValues;
  } catch (error) {
    console.error('Content validation error:', error);
    return false;
  }
};