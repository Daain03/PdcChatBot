const axios = require('axios');
const retriever = require('./ragRetriever');

async function handleChat(prompt) {
  try {
    // ===== POLICY QUESTIONS (RAG) =====
    if (retriever.isPolicyQuestion(prompt)) {
      const { text, source } = retriever.retrieve(prompt);
      
      if (!text) {
        throw new Error("No relevant policy found");
      }

      const response = await axios.post(
        'https://api.together.xyz/v1/chat/completions',
        {
          model: "meta-llama/Llama-3-8b-chat-hf",
          messages: [
            {
              role: "system",
              content: `You are an Iqra University official assistant. Answer STRICTLY using this policy:\n\n${text}\n\n` +
                       `Format: [Policy Source: ${source}]\n` +
                       `If the answer isn't in the policy, say "Please contact admissions@iqra.edu.pk"`
            },
            { role: "user", content: prompt }
          ],
          temperature: 0.1,
          max_tokens: 300
        },
        {
          headers: {
            'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
            'Content-Type': 'application/json'
          },
          timeout: 15000
        }
      );

      return response.data.choices[0].message.content;
    }

    // ===== GENERAL QUESTIONS (Direct LLM) =====
    const response = await axios.post(
      'https://api.together.xyz/v1/chat/completions',
      {
        model: "meta-llama/Llama-3-8b-chat-hf",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 200
      },
      {
        headers: {
          'Authorization': `Bearer ${process.env.TOGETHER_API_KEY}`,
          'Content-Type': 'application/json'
        }
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error("Chat Error:", {
      message: error.message,
      stack: error.stack
    });
    return "Our university assistant is currently unavailable. Please contact registrar@iqra.edu.pk";
  }
}

module.exports = { handleChat };
