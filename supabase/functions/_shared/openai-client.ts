// Definiamo manualmente il tipo ChatCompletionMessageParam invece di importarlo
export type ChatCompletionMessageParam = {
  role: "system" | "user" | "assistant" | "tool" | "function";
  content: string | null;
  name?: string;
  function_call?: {
    name: string;
    arguments: string;
  };
  tool_calls?: Array<{
    id: string;
    type: "function";
    function: {
      name: string;
      arguments: string;
    };
  }>;
};

export interface OpenAIClientConfig {
  apiKey: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
}

export class OpenAIClient {
  private apiKey: string;
  private model: string;
  private temperature: number;
  private maxTokens: number;

  constructor(config: OpenAIClientConfig) {
    this.apiKey = config.apiKey;
    this.model = config.model;
    this.temperature = config.temperature || 0.7;
    this.maxTokens = config.maxTokens || 1000;
  }

  /**
   * Crea un chat completion con OpenAI
   */
  public async createChatCompletion(messages: any[], options?: { response_format?: { type: string } }): Promise<any> {
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify({
          model: this.model,
          messages,
          temperature: this.temperature,
          max_tokens: this.maxTokens,
          ...(options?.response_format && { response_format: options.response_format })
        })
      });

      if (!response.ok) {
        const errorBody = await response.text();
        throw new Error(`OpenAI API responded with status ${response.status}: ${errorBody}`);
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error creating chat completion:', error);
      throw error;
    }
  }

  /**
   * Invia un prompt a OpenAI e restituisce la risposta
   */
  public async sendPrompt(userPrompt: string, systemPrompt: string): Promise<string | null> {
    try {
      const messages = [
        {
          role: 'system',
          content: systemPrompt
        },
        {
          role: 'user',
          content: userPrompt
        }
      ];

      const completion = await this.createChatCompletion(messages);

      if (completion?.choices && completion.choices.length > 0) {
        const content = completion.choices[0].message.content;
        return content;
      }

      return null;
    } catch (error) {
      console.error('Error sending prompt:', error);
      throw error;
    }
  }
} 