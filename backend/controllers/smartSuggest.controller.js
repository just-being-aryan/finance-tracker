// import axios from 'axios';
// import { asyncHandler } from '../utils/asyncHandler.js'

// export const generateSmartSuggestions = asyncHandler(async (req, res) => {
//   const { expenses } = req.body;


//   console.log("Incoming expenses from frontend:", expenses)

//   if (!expenses || !Array.isArray(expenses)) {
//     return res.status(400).json({ message: 'Expenses data is required' });
//   }

//   try {
//     // const pythonServiceURL = process.env.PYTHON_SERVICE_URL || 'http://localhost:5000';
//     const pythonServiceURL = 'http://localhost:5000'; 
//     const response = await axios.post(`${pythonServiceURL}/analyze`, {
//       expenses,
//     });

//     res.status(200).json(response.data);
//   } catch (error) {
//     console.error('Python service error:', error.message);
//     res.status(500).json({ message: 'Failed to get suggestions from Python service' });
//   }
// });


// //NOT IMPLEMENTED IN FRONTEND