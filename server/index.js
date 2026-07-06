const mongoose = require('mongoose');
const app = require('./app');

const PORT = process.env.PORT || 5001;

// Start the HTTP server immediately so the host's port binding and health check
// succeed even if the database is momentarily unreachable. This prevents a
// transient DB outage (e.g. a free-tier Atlas cluster that auto-paused) from
// crash-looping the whole service and taking it completely offline.
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

// Connect to MongoDB with indefinite exponential backoff (never exit).
async function connectWithRetry(attempt = 1) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');
  } catch (err) {
    const delay = Math.min(30000, 2000 * attempt);
    console.error(`❌ MongoDB connection error (attempt ${attempt}): ${err.message}`);
    console.log(`Retrying in ${delay / 1000}s...`);
    setTimeout(() => connectWithRetry(attempt + 1), delay);
  }
}

connectWithRetry();
