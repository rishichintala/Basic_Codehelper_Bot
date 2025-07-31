import { ActivityTypes } from "@microsoft/agents-activity";
import {
  AgentApplication,
  AttachmentDownloader,
  MemoryStorage,
  TurnContext,
  TurnState,
} from "@microsoft/agents-hosting";
import OpenAI from 'openai';

interface ConversationState {
  count: number;
  conversationHistory: Array<{role: 'system' | 'user' | 'assistant', content: string}>;
}
type ApplicationTurnState = TurnState<ConversationState>;

const downloader = new AttachmentDownloader();

// Initialize OpenAI with proper environment variable handling
const getOpenAIClient = () => {
  const apiKey = process.env.OPENAI_API_KEY;
  
  if (!apiKey) {
    console.error('❌ OPENAI_API_KEY environment variable is required but not set!');
    console.error('Please set your OpenAI API key in the environment variables.');
    console.error('For local development, create a .env file with: OPENAI_API_KEY=your_key_here');
    throw new Error('OpenAI API key is required. Please set OPENAI_API_KEY environment variable.');
  }
  
  if (apiKey.length < 20) {
    console.error('❌ OPENAI_API_KEY appears to be invalid (too short)');
    throw new Error('OpenAI API key appears to be invalid');
  }
  
  console.log('✅ OpenAI API key loaded successfully');
  return new OpenAI({ apiKey });
};

let openai: OpenAI;
try {
  openai = getOpenAIClient();
  console.log('OpenAI client initialized successfully');
} catch (error) {
  console.error('Failed to initialize OpenAI client:', error);
  throw error;
}

// Define storage and application
const storage = new MemoryStorage();
export const teamsBot = new AgentApplication<ApplicationTurnState>({
  storage,
  fileDownloaders: [downloader],
});

// Helper function to get OpenAI response
async function getCodeHelperResponse(userMessage: string, conversationHistory: Array<{role: 'system' | 'user' | 'assistant', content: string}> = []): Promise<string> {
  try {
    const messages = [
      {
        role: "system" as const,
        content: `You are a Code Helper Bot for Microsoft Teams. You specialize in:
        - Explaining programming concepts
        - Debugging code issues
        - Code reviews and suggestions
        - Best practices and patterns
        - Language-specific help (JavaScript, TypeScript, Python, etc.)
        - Architecture and design questions
        
        Keep responses concise but helpful. Use code blocks for code examples. Be friendly and encouraging.`
      },
      ...conversationHistory.slice(-8), // Keep last 8 messages for context
      { role: "user" as const, content: userMessage }
    ];

    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: messages,
      max_tokens: 800,
      temperature: 0.7,
    });

    return completion.choices[0].message?.content || "I'm having trouble processing that right now.";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    return "Sorry, I'm having trouble connecting to my AI brain right now. Please try again later.";
  }
}



// Code Helper Commands
teamsBot.message("/help", async (context: TurnContext, state: ApplicationTurnState) => {
  const helpMessage = `🤖 **Code Helper Bot Commands:**\n\n` +
    `• **General coding questions** - Just ask me anything about programming!\n` +
    `• **/review** - Paste code after this command for a code review\n` +
    `• **/debug** - Describe your bug or paste error messages\n` +
    `• **/explain** - Ask me to explain any programming concept\n` +
    `• **/best-practices** - Get best practices for any technology\n` +
    `• **/clear** - Clear the entire conversation and start fresh\n` +
    `• **/reset** - Clear conversation history (lighter reset)\n` +
    `• **/help** - Show this help message\n\n` +
    `**Examples:**\n` +
    `• "How do I handle async/await in JavaScript?"\n` +
    `• "/review function add(a,b) { return a+b; }"\n` +
    `• "/debug TypeError: Cannot read property 'length' of undefined"\n` +
    `• "/explain dependency injection"`;
  
  await context.sendActivity(helpMessage);
});

teamsBot.message("/review", async (context: TurnContext, state: ApplicationTurnState) => {
  const codeToReview = context.activity.text?.replace('/review', '').trim();
  
  if (!codeToReview) {
    await context.sendActivity("Please paste your code after the /review command for me to review!");
    return;
  }

  const reviewPrompt = `Please review this code and provide constructive feedback on:
- Code quality and readability
- Potential bugs or issues
- Performance improvements
- Best practices
- Security considerations if applicable

Code to review:
${codeToReview}`;

  const response = await getCodeHelperResponse(reviewPrompt, state.conversation.conversationHistory);
  await context.sendActivity(`🔍 **Code Review:**\n\n${response}`);
});

teamsBot.message("/debug", async (context: TurnContext, state: ApplicationTurnState) => {
  const debugInfo = context.activity.text?.replace('/debug', '').trim();
  
  if (!debugInfo) {
    await context.sendActivity("Please describe your bug or paste the error message after the /debug command!");
    return;
  }

  const debugPrompt = `Help me debug this issue. Provide step-by-step debugging suggestions and potential solutions:

${debugInfo}`;

  const response = await getCodeHelperResponse(debugPrompt, state.conversation.conversationHistory);
  await context.sendActivity(`🐛 **Debug Help:**\n\n${response}`);
});

teamsBot.message("/explain", async (context: TurnContext, state: ApplicationTurnState) => {
  const concept = context.activity.text?.replace('/explain', '').trim();
  
  if (!concept) {
    await context.sendActivity("Please tell me what programming concept you'd like me to explain!");
    return;
  }

  const explainPrompt = `Please explain this programming concept in a clear, beginner-friendly way with examples:

${concept}`;

  const response = await getCodeHelperResponse(explainPrompt, state.conversation.conversationHistory);
  await context.sendActivity(`📚 **Explanation:**\n\n${response}`);
});

teamsBot.message("/best-practices", async (context: TurnContext, state: ApplicationTurnState) => {
  const technology = context.activity.text?.replace('/best-practices', '').trim();
  
  if (!technology) {
    await context.sendActivity("Please specify the technology or programming area you want best practices for!");
    return;
  }

  const practicesPrompt = `Provide best practices and recommendations for: ${technology}`;

  const response = await getCodeHelperResponse(practicesPrompt, state.conversation.conversationHistory);
  await context.sendActivity(`⭐ **Best Practices:**\n\n${response}`);
});

teamsBot.message("/clear", async (context: TurnContext, state: ApplicationTurnState) => {
  // Clear all conversation state completely
  state.deleteConversationState();
  
  // Reset conversation history and count
  state.conversation.conversationHistory = [];
  state.conversation.count = 0;
  
  await context.sendActivity(
    "🎆 **Complete Conversation Clear!**\n\n" +
    "Everything has been wiped clean:\n" +
    "• All conversation history deleted\n" +
    "• Message count reset to 0\n" +
    "• Fresh start with no context\n\n" +
    "I'm ready to help you with any coding questions!"
  );
});

teamsBot.message("/reset", async (context: TurnContext, state: ApplicationTurnState) => {
  // Lighter reset - just clear conversation history but keep some state
  if (state.conversation.conversationHistory) {
    state.conversation.conversationHistory = [];
  }
  
  await context.sendActivity("🔄 Conversation history cleared! Ready for a fresh start.");
});

teamsBot.conversationUpdate(
  "membersAdded",
  async (context: TurnContext, state: ApplicationTurnState) => {
    await context.sendActivity(
      `👋 **Welcome to Code Helper Bot!**\n\n` +
      `I'm your AI-powered coding assistant, ready to help with:\n` +
      `• Code reviews and debugging\n` +
      `• Programming concepts and explanations\n` +
      `• Best practices and architecture advice\n` +
      `• Language-specific questions\n\n` +
      `Type **/help** to see all available commands, or just ask me any coding question!`
    );
  }
);

// Listen for ANY message to be received. MUST BE AFTER ANY OTHER MESSAGE HANDLERS
teamsBot.activity(
  ActivityTypes.Message,
  async (context: TurnContext, state: ApplicationTurnState) => {
    const userMessage = context.activity.text?.trim();
    
    if (!userMessage) {
      await context.sendActivity("I didn't receive any text. Please ask me a coding question!");
      return;
    }

    // Initialize conversation history if it doesn't exist
    if (!state.conversation.conversationHistory) {
      state.conversation.conversationHistory = [];
    }

    // Add user message to conversation history
    state.conversation.conversationHistory.push({ role: "user", content: userMessage });

    // Get AI response
    const response = await getCodeHelperResponse(userMessage, state.conversation.conversationHistory);
    
    // Add bot response to conversation history
    state.conversation.conversationHistory.push({ role: "assistant", content: response });
    
    // Keep conversation history manageable (last 20 messages)
    if (state.conversation.conversationHistory.length > 20) {
      state.conversation.conversationHistory = state.conversation.conversationHistory.slice(-20);
    }

    // Send response to user
    await context.sendActivity(response);
  }
);

// Remove the old regex and function matchers as they're not needed for the Code Helper Bot
