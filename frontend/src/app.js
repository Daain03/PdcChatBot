import ChatbotAPI from "../api.js";

document.addEventListener("DOMContentLoaded", () => {
  const chatMessages = document.getElementById("chatMessages");
  const userInput = document.getElementById("userInput");
  const sendButton = document.getElementById("sendButton");

  // Helper: Create and style chat bubble
  function addMessage(role, content) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${role}-message`;

    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = content;

    messageDiv.appendChild(bubble);
    chatMessages.appendChild(messageDiv);

    // Scroll to bottom
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }

  // Handle sending messages
  async function handleSendMessage() {
    const message = userInput.value.trim();
    if (!message) return;

    addMessage("user", message);
    userInput.value = "";

    // Typing indicator
    const typingDiv = document.createElement("div");
    typingDiv.className = "message bot-message typing";
    const bubble = document.createElement("div");
    bubble.className = "bubble";
    bubble.textContent = "...";
    typingDiv.appendChild(bubble);
    chatMessages.appendChild(typingDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    try {
      const { response, error } = await ChatbotAPI.sendMessage(message);
      const reply = response || error || "Sorry, I didn't understand that";
      addMessage("bot", reply);
    } catch (err) {
      addMessage(
        "bot",
        "Our chatbot service is currently unavailable. Please try again later."
      );
    } finally {
      document.querySelector(".typing")?.remove();
    }
  }

  // Event listeners
  sendButton.addEventListener("click", handleSendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleSendMessage();
  });

  // Initial greeting
  setTimeout(() => {
    addMessage("bot", "Hello! I'm the Iqra University assistant. How can I help you today?");
  }, 500);
});
