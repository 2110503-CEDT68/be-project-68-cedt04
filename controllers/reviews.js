const Review = require('../models/Review');
const Campground = require('../models/Campground');

exports.createReview = async (req, res, next) => {
  try {
    const { rating, comment } = req.body;

    // หา review เดิมของ user คนนี้ใน campground นี้
    let review = await Review.findOne({
      campground: req.params.campgroundId,
      user: req.user.id
    });

    if (review) {
      // ถ้ามีแล้ว → อัปเดต
      review.rating = rating;
      review.comment = comment;
      await review.save();
    } else {
      // ถ้ายังไม่มี → สร้างใหม่
      review = await Review.create({
        rating,
        comment,
        campground: req.params.campgroundId,
        user: req.user.id
      });
    }

    // ===== คำนวณ rating ใหม่ =====
    const campground = await Campground.findById(req.params.campgroundId);

    const reviews = await Review.find({
      campground: req.params.campgroundId
    });

    campground.totalReviews = reviews.length;

    campground.averageRating =
      reviews.reduce((acc, item) => acc + item.rating, 0) /
      reviews.length;

    await campground.save();

    res.status(200).json({
      success: true,
      data: review
    });

  } catch (err) {
    next(err);
  }
};