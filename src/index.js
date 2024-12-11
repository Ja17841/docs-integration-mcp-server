import express from 'express';
import { fetchDocumentation } from './services/docService.js';

const app = express();
const PORT = process.env.PORT || 3000;

const tools = {
  fetchDocs: {
    description: "Fetches official documentation for programming languages and frameworks",
    parameters: {
      source: {
        type: "string",
        enum: ["mdn", "python", "react"],
        description: "Documentation source to query"
      },
      query: {
        type: "string",
        description: "Search query or specific API/method name"
      }
    },
    handler: async ({ source, query }) => {
      return await fetchDocumentation(source, query);
    }
  }
};

app.use(express.json());

app.post('/mcp', async (req, res) => {
  const { tool, parameters } = req.body;
  
  if (!tools[tool]) {
    return res.status(400).json({ error: 'Tool not found' });
  }
  
  try {
    const result = await tools[tool].handler(parameters);
    res.json({ result });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`MCP server running on port ${PORT}`);
});