import multer from "multer";
import express from "express";
import { createServer } from "node:http";
import { join } from "node:path";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { marked } from "marked";
import llmApiProcess from "./lib/llm.js";

const app = express();
const server = createServer(app);

app.get("/", (req, res) => {
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  res.sendFile(join(__dirname, "index.html"));
});

// アップロードディレクトリの設定
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });

app.post("/upload", upload.single("image"), async (req, res) => {
  if (!req.file) {
    return res
      .status(400)
      .json({ error: "ファイルがアップロードされていません" });
  }

  try {
    const imageFile = req.file;

    // ファイルの存在確認
    if (!fs.existsSync(imageFile.path)) {
      return res
        .status(400)
        .json({ error: "アップロードされたファイルが見つかりません" });
    }

    const imageBuffer = fs.readFileSync(imageFile.path);

    // バッファが空でないことを確認
    if (!imageBuffer || imageBuffer.length === 0) {
      return res.status(400).json({ error: "ファイルが空です" });
    }

    const base64Image = imageToBase64(imageBuffer);

    // base64文字列が有効であることを確認
    if (!base64Image || base64Image.length === 0) {
      return res.status(400).json({ error: "画像の変換に失敗しました" });
    }

    // llmを呼び出して画像解析
    const imageRead = new llmApiProcess(base64Image);
    try {
      const result = await imageRead.vision();

      // マークダウンをHTMLに変換
      const markdownContent = result.message.content;
      const htmlContent = marked(markdownContent);

      res.json({
        success: true,
        markdown: markdownContent,
        html: htmlContent,
        filename: imageFile.filename,
      });
    } catch (error) {
      console.error("Vision API error:", error);
      res.status(500).json({ error: "画像認識処理中にエラーが発生しました" });
    }
  } catch (error) {
    console.error("Upload processing error:", error);
    res.status(500).json({ error: "ファイル処理中にエラーが発生しました" });
  }
});

server.listen(3000, () => {
  console.log("server running at http://localhost:3000");
});

const imageToBase64 = (inputImage) => {
  try {
    // バッファをBase64形式に変換
    const base64Image = inputImage.toString("base64");

    // Ollama APIは純粋なbase64文字列を期待するため、data URLではなくbase64文字列のみを返す
    return base64Image;
  } catch (error) {
    console.error("画像の変換中にエラーが発生しました:", error);
    throw error;
  }
};
