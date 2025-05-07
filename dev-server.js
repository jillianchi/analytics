import app from "./api/server.js"; // ✅ same Express app used by Vercel

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`🚀 Local server running at http://localhost:${PORT}`);
});
