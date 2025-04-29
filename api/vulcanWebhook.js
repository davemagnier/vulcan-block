export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false, error: "Method not allowed" });
  }

  let rawBody = "";
  for await (const chunk of req) {
    rawBody += chunk;
  }

  let parsed;
  try {
    parsed = JSON.parse(rawBody);
  } catch (err) {
    console.error("Failed to parse JSON:", err);
    return res.status(400).json({ success: false, error: "Invalid JSON" });
  }

  const wallet = parsed.wallet?.toLowerCase();
  const bannedWallets = [
    "0x229bc9afe9d1743ba0a2f929ff2e4e0184866f11",
    "0x4c6672e4a69585dba86412a03b585c856b12183f"
  ];

  if (!wallet) {
    return res.status(400).json({ success: false, error: "Missing wallet" });
  }

  if (bannedWallets.includes(wallet)) {
    // ✅ Ping Discord
    await fetch("https://discord.com/api/webhooks/1364736685690064966/CMsYAZc2EX1PNMaFs8FnIlGb2tGrIQ4GXtsoKcYc2i94XZS-4raVPmc35zkiVU9dhy_r", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        content: `🚫 Blacklisted wallet attempted verification: \`${wallet}\``
      })
    });

    // ✅ Block other role assignments, allow BLACKLISTED tag
    return res.status(200).json({
      success: true,
      blockOtherRoles: true
    });
  }

  // ✅ Normal user: let Vulcan continue with other role checks
  return res.status(200).json({ success: false });
}
