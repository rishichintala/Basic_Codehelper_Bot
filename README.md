# Code Helper Bot for Microsoft Teams

An AI-powered coding assistant bot for Microsoft Teams that helps developers with programming questions, code reviews, debugging, and best practices using OpenAI's GPT-4o.

## 🚀 Features

### AI-Powered Assistance
- **Intelligent Responses**: Powered by OpenAI GPT-4o for accurate and helpful coding advice
- **Context Awareness**: Maintains conversation history for better understanding of your questions
- **Multi-Language Support**: Helps with JavaScript, TypeScript, Python, and many other programming languages

### Specialized Commands
- **`/help`** - Display all available commands and usage examples
- **`/review [code]`** - Get detailed code reviews with suggestions for improvement
- **`/debug [error/issue]`** - Help troubleshoot bugs and error messages
- **`/explain [concept]`** - Get clear explanations of programming concepts
- **`/best-practices [technology]`** - Learn best practices for specific technologies
- **`/clear`** - Complete conversation reset (clears all history and state)
- **`/reset`** - Clear conversation history while keeping basic state

### Teams Integration
- **Multi-Scope Support**: Works in personal chats, team channels, and group chats
- **File Support**: Can process and analyze code files (when enabled)
- **Rich Formatting**: Responses include proper code blocks and formatting

## 🛠️ Technology Stack

- **Backend**: Node.js with Express.js
- **Language**: TypeScript for type safety and better development experience
- **AI**: OpenAI GPT-4o API for intelligent responses
- **Framework**: Microsoft 365 Agents Toolkit for Teams integration
- **Storage**: In-memory conversation state management
- **Authentication**: JWT-based authentication for secure Teams integration

## 📋 Prerequisites

- Node.js (version 18, 20, or 22)
- Microsoft 365 Agents Toolkit Visual Studio Code Extension (v5.0.0+)
- OpenAI API key
- Microsoft Teams environment for deployment

## 🚀 Getting Started

### Local Development

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd Basic_codehelper_Bot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   ```

4. **Run in development mode**
   ```bash
   npm run dev:teamsfx
   ```

5. **Test in Microsoft 365 Agents Playground**
   - Press F5 in VS Code
   - Select "Debug in Microsoft 365 Agents Playground"
   - The bot will open in your browser for testing

### Production Deployment

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Deploy to your hosting platform**
   ```bash
   npm start
   ```

3. **Configure Teams App**
   - Update the app manifest in `appPackage/manifest.json`
   - Deploy to Microsoft Teams Admin Center
   - Configure bot endpoints and permissions

## 💬 Usage Examples

### General Questions
```
How do I handle async/await in JavaScript?
What's the difference between let and const?
Explain dependency injection in simple terms
```

### Code Review
```
/review
function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price;
  }
  return total;
}
```

### Debugging Help
```
/debug TypeError: Cannot read property 'length' of undefined
/debug My React component won't re-render when state changes
```

### Learning Concepts
```
/explain closures in JavaScript
/explain SOLID principles
/best-practices React hooks
```

## 🏗️ Project Structure

```
├── appPackage/          # Teams app manifest and icons
├── env/                 # Environment configuration files
├── infra/              # Infrastructure templates
├── codehelperbot.ts    # Main bot logic and command handlers
├── index.ts            # Express server and bot initialization
├── package.json        # Dependencies and scripts
├── m365agents.yml      # Microsoft 365 Agents Toolkit configuration
└── README.md           # This file
```

## 🔧 Configuration

### Environment Variables
- `OPENAI_API_KEY` - Your OpenAI API key (required)
- `PORT` - Server port (default: 3978)
- `BOT_ID` - Microsoft Bot Framework bot ID
- `TEAMS_APP_ID` - Teams application ID

### Bot Capabilities
- **Conversation Memory**: Keeps last 20 messages for context
- **Response Limits**: Max 800 tokens per response for optimal performance
- **Error Handling**: Graceful fallbacks when AI service is unavailable
- **Security**: No hardcoded secrets, environment-based configuration

## 🔒 Security Features

- **Environment Variables**: All sensitive data stored in environment variables
- **JWT Authentication**: Secure Teams integration with proper token validation
- **Input Validation**: Proper handling of user inputs and error cases
- **API Key Validation**: Checks for valid OpenAI API key on startup

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

If you encounter any issues or have questions:
1. Check the console logs for error messages
2. Verify your OpenAI API key is correctly set
3. Ensure all dependencies are properly installed
4. Review the Microsoft 365 Agents Toolkit documentation

## 🔮 Future Enhancements

- [ ] Integration with GitHub for repository analysis
- [ ] Support for more file types and attachments
- [ ] Advanced code analysis and metrics
- [ ] Integration with development tools and IDEs
- [ ] Multi-language support for bot responses
- [ ] Analytics and usage tracking