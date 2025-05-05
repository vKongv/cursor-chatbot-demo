export type ModelConfig = {
  id: string;
  name: string;
  provider: string; // 'xai' | 'openai'
  description: string;
};

export type ProviderConfig = {
  id: string;
  name: string;
  models: ModelConfig[];
  defaultModelId: string;
};

export const providersConfig: ProviderConfig[] = [
  {
    id: 'xai',
    name: 'xAI',
    models: [
      {
        id: 'grok-2-vision-1212',
        name: 'Grok 2 Vision',
        provider: 'xai',
        description: 'Vision model with advanced capabilities',
      },
      {
        id: 'grok-3-mini-beta',
        name: 'Grok 3 Mini',
        provider: 'xai',
        description: 'Fast and efficient mini version of Grok 3',
      },
    ],
    defaultModelId: 'grok-2-vision-1212',
  },
  {
    id: 'openai',
    name: 'OpenAI',
    models: [
      {
        id: 'gpt-4.1-mini',
        name: 'GPT-4.1 Mini',
        provider: 'openai',
        description: 'Compact version of GPT-4.1',
      },
      {
        id: 'o4-mini',
        name: 'o4 Mini',
        provider: 'openai',
        description: 'Latest compact multimodal model',
      },
    ],
    defaultModelId: 'gpt-4.1-mini',
  },
];

export const defaultProviderId = 'xai';

// Helper function to get model by full ID (providerId:modelId)
export function getModelByFullId(fullId: string): ModelConfig | undefined {
  if (!fullId.includes(':')) return undefined;

  const [providerId, modelId] = fullId.split(':');
  const provider = providersConfig.find((p) => p.id === providerId);

  if (!provider) return undefined;

  return provider.models.find((m) => m.id === modelId);
}

// Helper function to construct full model ID
export function getFullModelId(providerId: string, modelId: string): string {
  return `${providerId}:${modelId}`;
}
