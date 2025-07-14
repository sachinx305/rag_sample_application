import multer from "multer";
import fs from "fs/promises";
import { RagChainsService } from "./chains/service.js";
import { RagGraphService } from "./graph/service.js";

class RagController {
  // Multer config: only accept .txt, single file
  upload = multer({
    dest: process.env.MULTER_DEST,
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== "text/plain") {
        return cb(new Error("Only .txt files are allowed"), false);
      }
      cb(null, true);
    },
    limits: { files: 1 },
  }).single("file");

  // Create new Doc
  async uploadDocumentAndCreateVectorStore(req, res) {
    this.upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded." });
      }
      try {
        const newDoc = await RagChainsService.uploadDocumentAndCreateVectorStore(
          req.file.path
        );
        res.status(201).json({
          success: true,
          data: newDoc,
          message: "Doc created successfully",
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          error: error.message,
          message: "Failed to create Doc",
        });
      } finally {
        // cleanup temp file
        await fs.unlink(req.file.path).catch(() => {});
      }
    });
  }

  // // execute user query
  async userQuery(req, res) {
    try {
      const { query } = req.body;
      // const queryResult = await RagChainsService.executeUserQuery(query);
      const queryResult =
        await RagChainsService.executeSequenceViaRunnableSequence(query);

      res.status(200).json({
        success: true,
        data: queryResult,
        message: "User query executed successfully",
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({
        success: false,
        error: error.message,
        message: "Failed to execute user query",
      });
    }
  }

    // // execute user query
    async userGraphQuery(req, res) {
      try {
        const { query } = req.body;
        const queryResult =
          await RagChainsService.executeRagGraph(query);
  
        res.status(200).json({
          success: true,
          data: queryResult,
          message: "User query executed successfully",
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          error: error.message,
          message: "Failed to execute user query",
        });
      }
    }
}

export const RagDocController = new RagController();
