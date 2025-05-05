# Plan: Implement AI Provider Selection

This document outlines the steps to add functionality allowing users to select the AI provider (xAI or OpenAI) and the specific model within that provider.

## 1. Define Providers and Models Configuration

- **Action:** Create a configuration structure (e.g., in a new file `lib/ai/config.ts` or within `components/chat.tsx`) to define available providers and their models.
- **Details:**
  - Map provider IDs (`xai`, `openai`) to display names ("xAI", "OpenAI").
  - For each provider, list available models with their internal IDs (`grok-2-vision-1212`, `grok-3-mini-beta`, `o4-mini`, `gpt-4.1-mini`) and user-facing names/descriptions (e.g., "Grok 2", "Grok 3 Mini", "GPT-4.1 Mini", "GPT-4o Mini").
  - Define a default model for each provider.
- **Example Structure (`lib/ai/config.ts`):**

  ```typescript
  export type ModelConfig = {
    id: string;
    name: string;
    provider: string; // 'xai' | 'openai'
    // Add other relevant details if needed (e.g., capabilities)
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
        { id: 'grok-2-vision-1212', name: 'Grok 2 Vision', provider: 'xai' },
        { id: 'grok-3-mini-beta', name: 'Grok 3 Mini', provider: 'xai' },
      ],
      defaultModelId: 'grok-2-vision-1212',
    },
    {
      id: 'openai',
      name: 'OpenAI',
      models: [
        { id: 'gpt-4.1-mini', name: 'GPT-4.1 Mini', provider: 'openai' },
        { id: 'o4-mini', name: 'GPT-4o Mini', provider: 'openai' },
      ],
      defaultModelId: 'gpt-4.1-mini',
    },
    // Add other providers if needed
  ];

  export const defaultProviderId = 'xai'; // Or whichever is the default
  ```

## 2. Update AI Provider Initialization (`lib/ai/providers.ts`)

- **Action:** Modify `myProvider` to potentially handle multiple providers or adjust how models are accessed.
- **Details:**
  - Import `openai` from `@ai-sdk/openai`.
  - Ensure both `xai(...)` and `openai(...)` model instances can be created. The backend API route will need to select the correct instance dynamically based on the request.
  - One approach: Keep the `customProvider` structure but expand the `languageModels` map to include OpenAI models, perhaps prefixing IDs (e.g., `openai:gpt-4.1-mini`). The backend will then construct the key.
- **Install Dependency:** Run `pnpm add @ai-sdk/openai`.
- **Environment:** Add `OPENAI_API_KEY` to `.env.local` and potentially `.env.example`.

## 3. Modify `Chat` Component (`components/chat.tsx`)

- **Action:** Introduce state for provider and model selection.
- **Details:**
  - Import `providersConfig`, `defaultProviderId` from the new config file.
  - Add state: `const [selectedProviderId, setSelectedProviderId] = useState<string>(defaultProviderId);`
  - Add state: `const [selectedModelId, setSelectedModelId] = useState<string>(initialChatModel);` // Needs refinement based on how `initialChatModel` relates to providers.
  - **Refinement:** Determine `initialProviderId` and `initialModelId` based on `initialChatModel` passed from the server. If `initialChatModel` only contains the model ID (e.g., 'grok-2-vision-1212'), find the corresponding provider from `providersConfig`. Update the initial state accordingly.
  - Update `useChat` hook's `experimental_prepareRequestBody`:
    ```typescript
    experimental_prepareRequestBody: (body) => ({
      id,
      message: body.messages.at(-1),
      selectedProviderId: selectedProviderId, // Send provider
      selectedModelId: selectedModelId,       // Send model
      selectedVisibilityType: visibilityType,
    }),
    ```
  - Pass `selectedProviderId`, `setSelectedProviderId`, `selectedModelId`, `setSelectedModelId`, and `providersConfig` down to `ChatHeader`.

## 4. Create `ProviderSelector` Component (`components/provider-selector.tsx`)

- **Action:** Create a new dropdown component for selecting the AI provider.
- **Details:**
  - Mirror the structure of existing selectors (`ModelSelector`, `VisibilitySelector`).
  - Use `Select` from `shadcn/ui`.
  - Props: `selectedProviderId: string`, `setSelectedProviderId: (id: string) => void`, `providers: ProviderConfig[]`, `setSelectedModelId: (id: string) => void`.
  - Render options based on `providersConfig`.
  - On selection change (`onValueChange`):
    - Call `setSelectedProviderId(newProviderId)`.
    - Find the default model ID for the `newProviderId` from `providersConfig`.
    - Call `setSelectedModelId(defaultModelIdForNewProvider)`.

## 5. Modify `ModelSelector` Component (`components/model-selector.tsx`)

- **Action:** Update the existing model selector to be provider-aware.
- **Details:**
  - Props: Update to receive `selectedProviderId: string`, `selectedModelId: string`, `setSelectedModelId: (id: string) => void`, `providersConfig: ProviderConfig[]` (instead of just `session` and `selectedModelId`).
  - Find the current provider's config: `const currentProvider = providersConfig.find(p => p.id === selectedProviderId);`
  - Filter models: Display only `currentProvider.models` in the `Select` options.
  - Update `onValueChange` to call `setSelectedModelId(newModelId)`.
  - Update the `Select`'s `value` to be `selectedModelId`.

## 6. Modify `ChatHeader` Component (`components/chat-header.tsx`)

- **Action:** Integrate the new `ProviderSelector`.
- **Details:**
  - Import `ProviderSelector`.
  - Update `PureChatHeader` props to accept `selectedProviderId`, `setSelectedProviderId`, `selectedModelId`, `setSelectedModelId`, `providersConfig`.
  - Render `<ProviderSelector ... />` before `<ModelSelector ... />`.
  - Pass the relevant props to both `ProviderSelector` and `ModelSelector`.
  - Adjust CSS classes/ordering (`order-N`) as needed to achieve `Provider -> Model -> Visibility` layout.

## 7. Modify Backend API (`app/(chat)/api/chat/route.ts`)

- **Action:** Update the API route to handle provider and model selection.
- **Details:**

  - **Schema (`./schema.ts`):** Update `postRequestBodySchema` to include `selectedProviderId: z.string()` and `selectedModelId: z.string()`. Remove `selectedChatModel` if it's fully replaced.
  - **Route Handler (`./route.ts`):**

    - Parse `selectedProviderId` and `selectedModelId` from the validated request body.
    - Modify the logic that selects the language model:

      ```typescript
      // Example logic (adapt based on how myProvider is structured)
      let modelInstance;
      if (selectedProviderId === 'openai') {
        modelInstance = openai(selectedModelId as any); // Cast might be needed depending on exact model strings
      } else if (selectedProviderId === 'xai') {
        modelInstance = xai(selectedModelId as any); // Cast might be needed
      } else {
        // Handle error or default
        throw new Error(`Unsupported provider: ${selectedProviderId}`);
      }

      const { textStream } = await streamText({
        // model: myProvider.languageModel('chat-model'), // Replace this
        model: modelInstance, // Use the dynamically selected instance
        // ... rest of streamText options
      });
      ```

    - Ensure the model IDs used here (`selectedModelId`) exactly match those expected by the `@ai-sdk/openai` and `@ai-sdk/xai` initializers.

## 8. Database Considerations (Optional Follow-up)

- **Action:** Evaluate if chat persistence needs updating.
- **Details:**
  - Currently, `chats` table likely stores `model` (string). This implicitly assumes a single provider.
  - **Option 1 (Simple):** Store the combined ID like `openai:gpt-4.1-mini` or `xai:grok-2-vision-1212`. The frontend/backend would parse/construct this.
  - **Option 2 (Better):** Add a `providerId` column to the `chats` table. Update Drizzle schema (`lib/db/schema.ts`), generate/run migrations (`pnpm db:generate`, `pnpm db:migrate`), and update queries (`saveChat`, `getChatById` in `lib/db/queries.ts`) to save and retrieve both fields. Update `initialChatModel` retrieval logic in the page component (`app/(chat)/chat/[id]/page.tsx`) to pass both provider and model to the `Chat` component.

This plan provides a step-by-step guide. Implementation details, especially around state management and provider/model instance selection in the backend, may require minor adjustments based on the existing codebase structure.
