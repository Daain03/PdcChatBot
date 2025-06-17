const admissionData = require('../data/iqra_admission.json');
const gradingData = require('../data/iqra_grading.json');

class JsonRAGRetriever {
  // Enhanced policy question detection
  isPolicyQuestion(query) {
    const policyKeywords = [
      'iqra', 'admission', 'grading', 'cgpa', 'credit',
      'transfer', 'bba', 'engineering', 'requirements',
      'policy', 'criteria', 'rules', 'regulation'
    ];
    return policyKeywords.some(keyword => 
      query.toLowerCase().includes(keyword)
    );
  }

  // Retrieve relevant policy with source
  retrieve(query) {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('admission') || 
        lowerQuery.includes('eligibility') ||
        lowerQuery.includes('require')) {
      return {
        text: JSON.stringify(admissionData),
        source: 'iqra_admission.json'
      };
    }
    
    if (lowerQuery.includes('grading') || 
        lowerQuery.includes('cgpa') ||
        lowerQuery.includes('grade')) {
      return {
        text: JSON.stringify(gradingData),
        source: 'iqra_grading.json'
      };
    }

    return null; // No relevant policy found
  }
}

module.exports = new JsonRAGRetriever();