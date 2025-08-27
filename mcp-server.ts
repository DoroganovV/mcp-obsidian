import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StreamableHTTPServerTransport } from "@modelcontextprotocol/sdk/server/streamableHttp.js";
import express from "express";
import { request, response } from "express";
import { z } from "zod";
import * as fs from 'fs';
import * as path from 'path';

function getServer() {
  const server = new McpServer({ name: "MCP Server Vitaly Doroganov", version: "0.0.1" });

  server.tool(
    "getFiles",
    "Get all files",
    async () => {
      return { content: readRecursive(`../obsidian`) };
    }
  );

  server.tool(
    "getFile",
    "Get content of file",
    {
      fullPath: z.string().describe('Path to file'),
    },
    async ({ fullPath }) => {
      return { content: [{ type: "text", text: loadFileContent(fullPath) }] };
    }
  );

  server.tool(
    "getSummary",
    "Get summary of every notes",
    async () => {
      return { content: [{ type: "text", text: loadFileContent(`../obsidian/summary.md`) }] };
    }
  );
  return server;
}

function readRecursive(dir: string): string[] {
  let results: string[] = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(readRecursive(fullPath));
    } else if (fullPath.endsWith('.md')) {
      results.push(fullPath);
    }
  }
  return results;
}

function loadFileContent(fullPath: string): string {
  return fs.readFileSync(fullPath, 'utf-8');
}

const app = express();
app.use(express.json());
app.post("/mcp", async (req: request, res: response) => {
  try {
    const server = getServer();
    const transport = new StreamableHTTPServerTransport({ sessionIdGenerator: undefined });

    res.on("close", () => {
      console.log("Request closed");
      transport.close();
      server.close();
    });

    await server.connect(transport);
    await transport.handleRequest(req, res, req.body);
  }
  catch (error) {
    console.error("Error handling request:", error);
    if (!res.headersSent) {
      res.status(500).json({
        jsonrpc: "2.0",
        error: { code: -32603, message: "Internal Server Error" },
        id: null
      });
    }
  }
});

app.listen(3000, () => {
  console.log("MCP server listening on port 3000");
});