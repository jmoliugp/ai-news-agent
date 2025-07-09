# AI News Agent

A custom-built AI agent developed from scratch without frameworks, designed to scrape and analyze Google News with an intelligent chat interface for querying recent articles.

## ✨ Features

- **🤖 Custom AI Agent**: Built from scratch with direct OpenAI API integration - no frameworks used
- **📰 Google News Scraping**: Automated news extraction using Puppeteer
- **💬 Interactive Chat Interface**: Real-time conversation with the AI about current events
- **🌍 Multi-language Support**: Fetch news in different languages and countries
- **📊 Categorized News**: Filter by technology, sports, health, business, entertainment, science, and world news
- **🔍 Smart Search**: Search for specific topics and keywords
- **📈 Performance Monitoring**: Built-in timing and performance tracking
- **🛡️ Robust Error Handling**: Comprehensive error handling and retry mechanisms
- **📝 Structured Logging**: Color-coded logging with emojis for better debugging

## 🚀 Installation

### Prerequisites

- Node.js >= 18.0.0
- pnpm >= 8.0.0

### Setup

1. Clone the repository:

```bash
git clone https://github.com/yourusername/ai-news-agent.git
cd ai-news-agent
```

2. Install dependencies:

```bash
pnpm install
```

3. Create a `.env` file in the root directory:

```env
OPENAI_API_KEY=your_openai_api_key_here
```

4. Build the project:

```bash
pnpm run build
```

## 🎯 Usage

### Interactive Chat Mode

Run the AI agent in interactive mode:

```bash
pnpm run chat
```

### Example Conversations

```
🤖 Welcome to the AI News Agent!
I can help you find and analyze the latest news from various sources.

You: What's the latest technology news?
Assistant: I'll fetch the latest technology news for you...

You: Find news about artificial intelligence in Spanish
Assistant: I'll search for AI news in Spanish...

You: Show me business news from France
Assistant: I'll get the latest business news from France...
```

### Available Commands

- **Latest news by category**: "Show me technology news", "Sports updates", "Health news"
- **Search specific topics**: "Find news about climate change", "Search for Tesla news"
- **Multi-language queries**: "News in Spanish", "French news about economics"
- **Country-specific news**: "News from Germany", "UK technology news"

## 🏗️ Project Structure

```
ai-news-agent/
├── src/
│   ├── index.ts                 # Main entry point
│   ├── services/
│   │   ├── ai-agent/           # AI agent implementation
│   │   │   ├── index.ts        # Main agent logic
│   │   │   ├── chat.ts         # OpenAI chat integration
│   │   │   ├── prompts.ts      # System and user prompts
│   │   │   ├── tools/          # Available functions
│   │   │   └── ...
│   │   └── scrappers/          # Web scraping services
│   └── utils/                  # Shared utilities
├── package.json
├── tsconfig.json
└── README.md
```

## 🛠️ Development

### Available Scripts

- `pnpm run chat` - Run the chat application
- `pnpm run dev` - Development mode with file watching
- `pnpm run build` - Build the project
- `pnpm run start` - Run the built application
- `pnpm run lint` - Run ESLint
- `pnpm run format` - Format code with Prettier
- `pnpm run type-check` - Run TypeScript type checking

### Development Workflow

1. **For chat testing**: Use `pnpm run chat` (stable process for readline interface)
2. **For development**: Use `pnpm run dev` (auto-restart on file changes)
3. **For production**: Use `pnpm run build && pnpm run start`

### Code Standards

- **TypeScript**: Strict typing, no `any` types
- **ESLint + Prettier**: Code formatting and linting
- **Modular Architecture**: Clean separation of concerns
- **English Only**: All code, comments, and documentation in English
- **Comprehensive Error Handling**: Try-catch blocks with proper logging
- **Performance First**: Built-in timing and monitoring

## 🔧 Configuration

### Environment Variables

| Variable         | Description         | Required |
| ---------------- | ------------------- | -------- |
| `OPENAI_API_KEY` | Your OpenAI API key | Yes      |

### News Scraping Options

- **Languages**: en-US, es-ES, fr-FR, de-DE, it-IT, pt-BR, etc.
- **Countries**: US, ES, FR, DE, IT, BR, GB, etc.
- **Categories**: TECHNOLOGY, SPORTS, HEALTH, BUSINESS, ENTERTAINMENT, SCIENCE, WORLD
- **Max Articles**: 1-100 (default: 10)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Make your changes following the code standards
4. Test thoroughly: `pnpm run chat`
5. Commit your changes: `git commit -m 'Add amazing feature'`
6. Push to the branch: `git push origin feature/amazing-feature`
7. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Built with direct OpenAI API integration
- Web scraping powered by Puppeteer
- TypeScript for type safety
- Custom logging and error handling implementation

---

**Note**: This is a custom implementation built from scratch without using AI frameworks. The focus is on clean, maintainable code with proper TypeScript typing and comprehensive error handling.
