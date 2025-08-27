# mcp2mqtt MCP Server in Node.js
Node.js bridge to real obsidian notes for AI Agents
The bundle looks like this:
* Obsidian + Remotely Save plugin (webdav mode)
* Webdav storage in docker container
* Private MCP server in docker container
* AI agent (checked in n8n) in docker container 

Used ideas and some modules from 
[Project mcp-server-node]https://github.com/lucianoayres/mcp-server-node

## ChangeLog
###### 27.08.2025
First commit - added getFiles, getFile, getSummary (test feature, ready-made summaries about all notes, so that it would be easier for the bot to navigate through them, without reading each one)

## What is MCP?
**Model Context Protocol (MCP)** provides a standardized approach to integrate custom tools into AI-assisted development environments. With MCP, you can define tools that perform specific tasks—such as retrieving external data, validating code, or enforcing coding standards—and the AI assistant in your IDE can call these tools automatically based on context. This helps improve developer productivity, ensures consistent quality, and streamlines workflows.

## License
This project is licensed under the [MIT License](LICENSE).
