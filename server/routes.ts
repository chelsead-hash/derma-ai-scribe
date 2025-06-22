import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { ExtractionService } from "./services/ExtractionService";

export async function registerRoutes(app: Express): Promise<Server> {
  // Web scraping endpoint
  app.post('/api/scrape', async (req, res) => {
    try {
      const { url } = req.body;
      if (!url) {
        return res.status(400).json({ error: 'URL is required' });
      }
      
      const extractedData = await ExtractionService.scrapeWebsite(url);
      res.json(extractedData);
    } catch (error) {
      console.error('Scraping error:', error);
      res.status(500).json({ error: 'Failed to scrape website' });
    }
  });

  // Paper extraction endpoint
  app.post('/api/extract-paper', async (req, res) => {
    try {
      const { doi } = req.body;
      if (!doi) {
        return res.status(400).json({ error: 'DOI is required' });
      }
      
      const extractedData = await ExtractionService.extractFromPaper(doi);
      res.json(extractedData);
    } catch (error) {
      console.error('Paper extraction error:', error);
      res.status(500).json({ error: 'Failed to extract from paper' });
    }
  });

  // GitHub extraction endpoint
  app.post('/api/github-extract', async (req, res) => {
    try {
      const { repoUrl } = req.body;
      if (!repoUrl) {
        return res.status(400).json({ error: 'Repository URL is required' });
      }
      
      const extractedData = await ExtractionService.extractFromGitHub(repoUrl);
      res.json(extractedData);
    } catch (error) {
      console.error('GitHub extraction error:', error);
      res.status(500).json({ error: 'Failed to extract from GitHub' });
    }
  });

  // HuggingFace extraction endpoint
  app.post('/api/huggingface-extract', async (req, res) => {
    try {
      const { modelName } = req.body;
      if (!modelName) {
        return res.status(400).json({ error: 'Model name is required' });
      }
      
      const extractedData = await ExtractionService.extractFromHuggingFace(modelName);
      res.json(extractedData);
    } catch (error) {
      console.error('HuggingFace extraction error:', error);
      res.status(500).json({ error: 'Failed to extract from HuggingFace' });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
