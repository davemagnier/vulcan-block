export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const wallet = req.body.wallet?.toLowerCase();
    const bannedWallets = [
      "0x229bc9afe9d1743ba0a2f929ff2e4e0184866f11",
      "0x4c6672e4a69585dba86412a03b585c856b12183f"
    ];

    if (!wallet) {
      return res.status(400).json({ success: false, error: "Missing wallet" });
    }

    if (bannedWallets.includes(wallet)) {
      return res.status(200).json({
        success: true,
        blockOtherRoles: true // 🚫 This blocks Vulcan from assigning other roles
      });
    }

    // For all others: do nothing (they pass on to other role rules)
    return res.status(200).json({ success: false });
  } catch (err) {
    console.error("Webhook error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
