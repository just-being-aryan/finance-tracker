import { Expense } from "../models/expense.model.js";
import { User } from "../models/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAllUsersSpending = asyncHandler(async (req, res) => {
    const spending = await Expense.aggregate([
        {
            $group: {
                _id: '$user',
                totalSpent: { $sum: '$amount' },
            },
        },
        {
            $lookup: {
                from: 'users',
                localField: '_id',
                foreignField: '_id',
                as: 'userDetails',
            },
        },
        {
            $unwind: '$userDetails',
        },
        {
            $project: {
                _id: 0,
                userId: '$userDetails._id',
                username: '$userDetails.username',
                email: '$userDetails.email',
                totalSpent: 1,
            },
        },
    ]);

    res.status(200).json({
        success: true,
        data: spending,
    });
});
