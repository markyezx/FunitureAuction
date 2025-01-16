const Auction = require("../schemas/v1/auction.schema");

// Create a new auction
const createAuction = async (req, res) => {
  try {
    const auction = new Auction(req.body);
    await auction.save();
    res.status(201).json(auction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read all auctions
const getAllAuctions = async (req, res) => {
  try {
    const auctions = await Auction.find();
    res.json(auctions);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Read an auction by ID
const getAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }
    res.json(auction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Update an auction by ID
const updateAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }
    res.json(auction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Delete an auction by ID
const deleteAuctionById = async (req, res) => {
  try {
    const auction = await Auction.findByIdAndDelete(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }
    res.json({ message: "Auction deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Place a bid on an auction
const placeBid = async (req, res) => {
  try {
    const auction = await Auction.findById(req.params.id);
    if (!auction) {
      return res.status(404).json({ error: "Auction not found" });
    }

    const { bidderName, bidAmount, duration } = req.body;

    if (bidAmount <= auction.currentBid) {
      return res
        .status(400)
        .json({ error: "Bid amount must be higher than the current bid" });
    }

    // Validate and set the auction end time
    let endTime;
    if (duration) {
      const { value, unit } = duration;
      if (unit === "minutes") {
        endTime = new Date(Date.now() + value * 60 * 1000);
      } else if (unit === "hours") {
        endTime = new Date(Date.now() + value * 60 * 60 * 1000);
      } else {
        return res.status(400).json({ error: "Invalid time unit" });
      }

      // Ensure the end time does not exceed 1 day
      const maxEndTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
      if (endTime > maxEndTime) {
        endTime = maxEndTime;
      }
    } else {
      // Default to 24 hours if no duration is provided
      endTime = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    auction.currentBid = bidAmount;
    auction.highestBidder = bidderName;
    auction.bids.push({ bidderName, bidAmount });
    auction.endsIn = endTime;

    await auction.save();

    // Save the bid in BidCollect
    const bidCollect = new BidCollect({
      auctionId: auction._id,
      bidderName,
      bidAmount,
    });
    await bidCollect.save();

    res.json(auction);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  createAuction,
  getAllAuctions,
  getAuctionById,
  updateAuctionById,
  deleteAuctionById,
  placeBid,
};
