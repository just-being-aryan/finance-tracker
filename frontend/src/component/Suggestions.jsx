// 'use client'

// import { useState } from 'react'
// import axios from '@/utils/axiosInstance'
// import { Button } from '@/components/ui/button'

// export default function Suggestions({ expenses }) {
//   const [suggestions, setSuggestions] = useState(null)
//   const [loading, setLoading] = useState(false)

//   const fetchSuggestions = async () => {
//     try {
//       setLoading(true)
//       const res = await axios.post('/api/smart-suggestions', { expenses })
//       setSuggestions(res.data)
//     } catch (err) {
//       alert('Failed to get suggestions')
//       console.error(err)
//     } finally {
//       setLoading(false)
//     }
//   }

//   return (
//     <div className="bg-white dark:bg-black p-6 rounded-2xl shadow-md border border-gray-200 dark:border-gray-700 mt-6">
//       <Button onClick={fetchSuggestions} disabled={loading}>
//         {loading ? 'Analyzing...' : 'Get Smart Suggestions'}
//       </Button>

//       {suggestions && (
//         <div className="mt-4 space-y-2 text-left">
//           <p className="text-lg font-semibold">💰 Total Spent: ₹{suggestions.total_spent}</p>
//           <p className="text-md">🔥 Top Category: {suggestions.top_category} (₹{suggestions.top_amount})</p>
//           <div className="mt-2">
//             <p className="font-medium">📊 Category Breakdown:</p>
//             <ul className="pl-4 list-disc">
//               {Object.entries(suggestions.category_breakdown).map(([category, amount]) => (
//                 <li key={category}>
//                   {category}: ₹{amount}
//                 </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//       )}
//     </div>
//   )
// }
