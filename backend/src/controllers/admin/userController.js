const User = require("../../models/userModel");

const getUsers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    const fifteenMinutesAgo = new Date(Date.now() - 15 * 60 * 1000);

    // Using MongoDB Aggregation instead of fetching all docs and using JS .map()
    // This calculates the 'isOnline' status and stringifies the ID at the database level.
    const users = await User.aggregate([
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: limit },
      {
        $addFields: {
          id: { $toString: "$_id" },
          isOnline: {
            $and: [
              "$isOnline",
              { $gte: ["$lastActive", fifteenMinutesAgo] }
            ]
          }
        }
      },
      {
        $project: {
          password: 0, // Strip password for security
          __v: 0
        }
      }
    ]);

    const total = await User.countDocuments({});

    res.set('X-Total-Count', total);
    res.set('X-Total-Pages', Math.ceil(total / limit));
    res.set('X-Current-Page', page);
    
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { getUsers };
