// /models/AbuseReport.js
const mongoose = require("mongoose");

const AbuseReportSchema = new mongoose.Schema(
  {
    reporter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // The user reporting
    reportedUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    }, // The user being reported
    chat: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Chat",
      required: true,
    }, // The chat where the abuse occurred
    reason: {
      type: String,
      required: true,
    }, // Reason for the report
    timestamp: {
      type: Date,
      default: Date.now,
    }, // When the report was filed
    isResolved: {
      type: Boolean,
      default: false,
    }, // Whether the report has been addressed
  },
  { timestamps: true }
);

module.exports = mongoose.model("AbuseReport", AbuseReportSchema);
