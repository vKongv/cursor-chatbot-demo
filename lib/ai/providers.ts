import {
  customProvider,
  extractReasoningMiddleware,
  wrapLanguageModel,
} from 'ai';
import { xai } from '@ai-sdk/xai';
import { openai } from '@ai-sdk/openai';
import { isTestEnvironment } from '../constants';
import {
  artifactModel,
  chatModel,
  reasoningModel,
  titleModel,
} from './models.test';

// Create a dynamic model instance based on provider and model ID
export function createModelInstance(providerId: string, modelId: string) {
  if (providerId === 'xai') {
    return xai(modelId as any);
  } else if (providerId === 'openai') {
    return openai(modelId as any);
  }
  throw new Error(`Unsupported provider: ${providerId}`);
}

// Create a reasoning model instance
export function createReasoningModelInstance(
  providerId: string,
  modelId: string,
) {
  const model = createModelInstance(providerId, modelId);
  return wrapLanguageModel({
    model,
    middleware: extractReasoningMiddleware({ tagName: 'think' }),
  });
}

export const myProvider = isTestEnvironment
  ? customProvider({
      languageModels: {
        'chat-model': chatModel,
        'chat-model-reasoning': reasoningModel,
        'title-model': titleModel,
        'artifact-model': artifactModel,
      },
    })
  : customProvider({
      languageModels: {
        'chat-model': xai('grok-2-vision-1212'),
        'chat-model-reasoning': wrapLanguageModel({
          model: xai('grok-3-mini-beta'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        'title-model': xai('grok-2-1212'),
        'artifact-model': xai('grok-2-1212'),
        // Add OpenAI models
        'openai:gpt-4.1-mini': openai('gpt-4.1-mini'),
        'openai:o4-mini': wrapLanguageModel({
          model: openai('o4-mini'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
        // Add xAI models with prefixed IDs
        'xai:grok-2-vision-1212': xai('grok-2-vision-1212'),
        'xai:grok-3-mini-beta': wrapLanguageModel({
          model: xai('grok-3-mini-beta'),
          middleware: extractReasoningMiddleware({ tagName: 'think' }),
        }),
      },
      imageModels: {
        'small-model': xai.image('grok-2-image'),
      },
    });
