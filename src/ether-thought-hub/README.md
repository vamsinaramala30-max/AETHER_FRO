# AI Forge Platform

You are a Principal AI Architect, Senior Full-Stack Engineer, LLM Systems Engineer, RAG Engineer, and UX Expert.



Your task is to build a production-grade AI assistant similar to ChatGPT.



CRITICAL REQUIREMENTS



DO NOT use ANY Lovable AI features.



DO NOT use:

- Lovable AI

- Lovable AI Functions

- Lovable Agents

- Lovable AI SDK

- Lovable Chat

- Lovable Built-in AI

- Any proprietary Lovable functionality

- Mock AI responses

- Fake streaming

- Placeholder responses



The entire AI system must be implemented using standard React + TypeScript + Backend APIs only.



The architecture must be vendor independent.



The system must be able to connect later to:

- Ollama

- OpenAI

- Gemini

- Anthropic

- DeepSeek

- LM Studio

- LocalAI

- vLLM

- Any OpenAI-compatible endpoint



without changing the frontend.



==================================



BUILD A COMPLETE CHATGPT-LIKE EXPERIENCE



Implement:



• Modern AI chat interface

• Infinite conversations

• Conversation history

• Conversation search

• Rename conversation

• Delete conversation

• Pin conversations

• Archive conversations

• Folder organization

• Message editing

• Message regeneration

• Streaming response support

• Stop generation

• Copy messages

• Markdown rendering

• Code highlighting

• Tables

• Lists

• Math support

• Mermaid diagrams

• Image preview

• File preview

• Drag & drop upload

• Keyboard shortcuts

• Mobile responsive UI

• Tablet support

• Desktop support

• Dark mode

• Light mode

• Accessibility

• Smooth animations

• Optimistic UI

• Auto scrolling

• Virtualized message rendering



==================================



IMPLEMENT FULL RAG ARCHITECTURE



Design a complete Retrieval Augmented Generation system.



Include:



Knowledge Base



Document Upload



PDF



DOCX



TXT



Markdown



CSV



JSON



Images



OCR pipeline



Chunking



Embeddings abstraction layer



Vector search abstraction



Metadata filtering



Semantic search



Hybrid search



Conversation memory



Workspace memory



User memory



Project memory



Recent context



Long-term memory



Automatic context retrieval



Automatic context compression



Context ranking



Context injection



Source attribution



Knowledge citations



Reference viewer



==================================



MEMORY SYSTEM



Implement multiple memory layers.



Short-term conversation memory



Long-term memory



Workspace memory



Project memory



Personal preferences



Recent interactions



Conversation summaries



Automatic summarization



Memory indexing



Memory retrieval



Memory ranking



Memory pruning



Memory cache



Memory synchronization



==================================



MESSAGE FEATURES



User messages



Assistant messages



System messages



Tool messages



Streaming state



Typing indicator



Retry



Continue generation



Partial rendering



Abort controller



Regenerate



Edit



Delete



Copy



Share



Export



Import



Message reactions



==================================



ARCHITECTURE



Use clean architecture.



Components



Hooks



Services



Repositories



API layer



Types



Utilities



Stores



Context providers



Error boundaries



Suspense



Lazy loading



Code splitting



Reusable UI



No duplicated code.



==================================



STATE MANAGEMENT



Conversation store



Message store



Settings store



Memory store



Knowledge store



Workspace store



Notification store



Use clean state management.



==================================



API LAYER



Create an AI abstraction layer.



The frontend must NEVER know which AI model is used.



The backend should expose endpoints like:



/chat



/conversations



/messages



/memory



/rag/search



/rag/upload



/rag/context



/models



/settings



The frontend only communicates with these endpoints.



==================================



NO MODEL LOCK-IN



Create an adapter interface.



The adapter should support replacing one AI provider with another without changing any UI code.



==================================



RESPONSES



The UI must correctly handle:



Long answers



Short answers



Lists



Tables



Markdown



Code



JSON



Streaming



Thinking state



Errors



Timeouts



Retries



Offline mode



==================================



RESPONSIVE DESIGN



Perfect responsiveness for:



320px



375px



390px



412px



768px



1024px



1280px



1440px



4K



No horizontal scrolling.



No layout breaking.



==================================



PERFORMANCE



Virtualized lists



Memoization



Lazy loading



Code splitting



Request caching



Optimistic updates



Debouncing



Throttling



Background synchronization



==================================



SECURITY



Input validation



Output sanitization



Rate limiting hooks



CSRF-ready



XSS protection



Secure storage



Token abstraction



No secrets in frontend



==================================



ERROR HANDLING



Graceful error UI



Retry mechanisms



Loading skeletons



Empty states



Offline states



Network recovery



==================================



IMPORTANT



Do NOT generate fake AI logic.



Do NOT simulate intelligence.



Instead, build a complete AI platform that is fully functional except for the actual LLM provider, which must be pluggable through a backend adapter.



The resulting application should be architected to match the capabilities and user experience of modern AI assistants while remaining completely independent of Lovable's proprietary AI features.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/6de05dde-a70b-4f8b-a5b7-75c429a6be7b).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
