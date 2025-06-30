import multer  from 'multer';
import fs      from 'fs/promises';
import { RagDocService } from './service.js';

class RagController {
  // // Get all Docs
  // async getAllDocs(req, res) {
  //   try {
  //     const Docs = await RagDocService.getAllDocs();
  //     res.status(200).json({
  //       success: true,
  //       data: Docs,
  //       message: 'Docs retrieved successfully'
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: error.message,
  //       message: 'Failed to retrieve Docs'
  //     });
  //   }
  // }

  // // Get Doc by ID
  // async getDocById(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const Doc = await RagDocService.getDocById(id);
      
  //     if (!Doc) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'Doc not found'
  //       });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       data: Doc,
  //       message: 'Doc retrieved successfully'
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: error.message,
  //       message: 'Failed to retrieve Doc'
  //     });
  //   }
  // }

// Multer config: only accept .txt, single file
  upload = multer({
    dest: process.env.MULTER_DEST,
    fileFilter: (req, file, cb) => {
      if (file.mimetype !== 'text/plain') {
        return cb(new Error('Only .txt files are allowed'), false);
      }
      cb(null, true);
    },
    limits: { files: 1 },
  }).single('file');


  // Create new Doc
  async uploadDocumentAndCreateVectorStore(req, res) {
    this.upload(req, res, async (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      if (!req.file) {
        return res.status(400).json({ error: 'No file uploaded.' });
      }
      try {
        const newDoc = await RagDocService.uploadDocumentAndCreateVectorStore(req.file.path);
        res.status(201).json({
          success: true,
          data: newDoc,
          message: 'Doc created successfully'
        });
      } catch (error) {
        console.log(error);
        res.status(500).json({
          success: false,
          error: error.message,
          message: 'Failed to create Doc'
        });
      } finally {
        // cleanup temp file
        await fs.unlink(req.file.path).catch(() => {});
      }
    });
  }

  // // Update Doc
  // async update(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const updateData = req.body;
  //     const updatedDoc = await RagDocService.updateDoc(id, updateData);
      
  //     if (!updatedDoc) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'Doc not found'
  //       });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       data: updatedDoc,
  //       message: 'Doc updated successfully'
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: error.message,
  //       message: 'Failed to update Doc'
  //     });
  //   }
  // }

  // // Delete Doc
  // async deleteDoc(req, res) {
  //   try {
  //     const { id } = req.params;
  //     const deletedDoc = await RagDocService.deleteDoc(id);
      
  //     if (!deletedDoc) {
  //       return res.status(404).json({
  //         success: false,
  //         message: 'Doc not found'
  //       });
  //     }

  //     res.status(200).json({
  //       success: true,
  //       data: deletedDoc,
  //       message: 'Doc deleted successfully'
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: error.message,
  //       message: 'Failed to delete Doc'
  //     });
  //   }
  // }

  // // Search Docs
  // async searchDocs(req, res) {
  //   try {
  //     const { query } = req.query;
  //     const Docs = await RagDocService.searchDocs(query);
      
  //     res.status(200).json({
  //       success: true,
  //       data: Docs,
  //       message: 'Search completed successfully'
  //     });
  //   } catch (error) {
  //     res.status(500).json({
  //       success: false,
  //       error: error.message,
  //       message: 'Failed to search Docs'
  //     });
  //   }
  // }
}

export const RagDocController = new RagController(); 