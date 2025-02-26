import { HfInference } from '@huggingface/inference';
import toast from 'react-hot-toast';

const HF_TOKEN = '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';
const MODEL_ID = 'mistralai/Mistral-7B-v0.1';

const hf = new HfInference(HF_TOKEN);

export const generateAIResponse = async (prompt: string) => {
  try {
    // Validate input
    if (!prompt?.trim()) {
      throw new Error('Please provide a valid input');
    }

    // Format prompt with clear instructions
    const formattedPrompt = `<human>: ${prompt.trim()}\n<assistant>: Let me help you with that.`;

    const response = await hf.textGeneration({
      model: MODEL_ID,
      inputs: formattedPrompt,
      parameters: {
        max_new_tokens: 250,
        temperature: 0.7,
        top_p: 0.95,
        repetition_penalty: 1.15,
        do_sample: true,
        return_full_text: false,
        wait_for_model: true
      }
    });

    if (!response?.generated_text) {
      throw new Error('No response generated');
    }

    // Clean up the response
    let cleanedResponse = response.generated_text
      .replace(/<human>.*?<\/human>/g, '')
      .replace(/<assistant>.*?<\/assistant>/g, '')
      .replace(/^[:\s]+/, '')
      .trim();

    // Validate cleaned response
    if (!cleanedResponse) {
      throw new Error('Empty response received');
    }

    return cleanedResponse;
  } catch (error: any) {
    console.error('Hugging Face API Error:', error);
    
    // Handle specific error cases
    if (!navigator.onLine) {
      throw new Error('Please check your internet connection');
    }
    
    if (error.name === 'AbortError') {
      throw new Error('Request timed out. Please try again');
    }

    if (error.response) {
      const status = error.response.status;
      const errorMap: { [key: number]: string } = {
        401: 'Authentication error. Please check API credentials.',
        429: 'Rate limit exceeded. Please try again later.',
        503: 'Service temporarily unavailable. Please try again later.',
        400: 'Invalid request. Please try different input.',
        500: 'Server error. Please try again later.'
      };
      
      const message = errorMap[status] || 'An unexpected error occurred';
      throw new Error(message);
    }

    // Use error message if available, otherwise fallback
    const message = error.message || 'Failed to generate response';
    throw new Error(message);
  }
};