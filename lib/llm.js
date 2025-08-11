import { Ollama } from "ollama";

const ollama = new Ollama({ host: "http://127.0.0.1:11434" });

export default class llmApiProcess {
  constructor(content) {
    this.content = content;
  }

  async vision() {
    return await getCompletion(this.content);

    async function getCompletion(base64Image) {
      const message = {
        role: "user",
        content:
          "あなたは優秀な美術評論家です。画像について可能な限り詳しく説明してください。",
        images: [base64Image],
      };

      try {
        const response = await ollama.chat({
          model: "gemma3:27b",
          messages: [message],
        });

        return response;
      } catch (error) {
        throw error;
      }
    }
  }
}
