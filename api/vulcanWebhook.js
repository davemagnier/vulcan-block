export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    let wallet;
    try {
      wallet = req.body?.wallet?.toLowerCase();
    } catch (parseError) {
      console.error("Body parsing failed:", parseError);
      return res.status(400).json({ success: false, error: "Invalid request body" });
    }

    if (!wallet) {
      return res.status(400).json({ success: false, error: "Missing wallet" });
    }

    const bannedWallets = [
      "0x229bc9afe9d1743ba0a2f929ff2e4e0184866f11",
      "0x4c6672e4a69585dba86412a03b585c856b12183f"
    ];

    if (bannedWallets.includes(wallet)) {
      return res.status(200).json({
        success: true,
        blockOtherRoles: true
      });
    }

    return res.status(200).json({ success: false });

  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
