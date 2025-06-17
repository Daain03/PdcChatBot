const baseURL =
  process.env.NODE_ENV === "production" ? "/api" : "http://localhost:3001/api";

export default {
  async sendMessage(message) {
    if (!message?.trim()) {
      throw new Error("Message cannot be empty");
    }

    const response = await fetch(`${baseURL}/chat`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ prompt: message.trim() }), // <-- FIXED LINE
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Request failed");
    }

    return await response.json();
  },
};
