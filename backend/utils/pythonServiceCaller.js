const axios = require('axios');

const callPythonAnalyzer = async (expenses) => {
  try {
    const response = await axios.post('http://localhost:5000/analyze', {
      expenses,
    });
    return response.data;
  } catch (error) {
    console.error('Error calling Python service:', error.message);
    return null;
  }
};

module.exports = callPythonAnalyzer;
