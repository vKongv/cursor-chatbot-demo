## Chat Tagging Feature Implementation Plan

### 1. Database Schema Modification

- **File**: `lib/db/schema.ts`
- **Table**: `chat`
- **Action**: Add a new column named `tags`.
  - **Type**: `text[]` (array of strings). This column will store an array of strings, e.g., `['work', 'urgent', 'project-x']`.
  - **Default**: `[]` (empty array).
  - **Nullable**: `false` (tags should always be an array, even if empty).

### 2. Backend API Endpoints

- **Location**: Create a new API route handler, e.g., `app/(chat)/api/chat/[id]/tags/route.ts`.
- **Endpoint**:
  - `PUT /api/chat/[id]/tags`
    - **Request Body**: `{ tags: string[] }`
    - **Action**: Updates the `tags` field for the specified `chatId`.
    - Performs validation (e.g., ensure `tags` is an array of strings).
    - Returns a success or error response.
    - The client-side will be responsible for re-fetching data after a successful update.

### 3. UI Components

#### 3.1. Tag Management Dialog

- **New Component**: `components/chat/chat-tags-dialog.tsx`
- **Functionality**:
  - Triggered by the "Edit Tags" button and the "+X more" indicator.
  - Receives `chatId` and current `tags` as props.
  - Displays existing tags for the chat. Each tag should have a remove button (e.g., an 'x' icon).
  - Contains an input field for adding new tags:
    - Users can type a tag and press "Enter" to add it.
    - A dedicated "Add Tag" button next to the input field will also add the current input value as a tag.
    - Prevent duplicate tags (case-insensitive check, but store with original casing or normalize to lowercase).
  - On "Save" or "Done", calls the `PUT /api/chat/[id]/tags` endpoint.
  - Handles loading and error states. Manages client-side state for tags during editing.
  - After a successful update, triggers a data re-fetch for the chat list or relevant chat items.
- **Styling**: Use `shadcn/ui` components (`Dialog`, `Input`, `Button`, `Badge` for displaying tags).

#### 3.2. Chat Item UI Update

- **File**: `components/sidebar-history-item.tsx`
- **Modifications**:
  - **Action Menu**:
    - Add a new `DropdownMenuItem` labeled "Edit Tags".
    - This item will open the `ChatTagsDialog`, passing the `chat.id` and `chat.tags`.
  - **Tag Display**:
    - Below the chat title (`<span>{chat.title}</span>`), add a new section to display tags.
    - Fetch `tags` along with other chat data.
    - Display up to 3 tags (e.g., using `Badge` components).
    - If more than 3 tags exist, display the first 2 tags and a "+N more" indicator (e.g., `+${chat.tags.length - 2} more`).
    - The "+N more" indicator should be clickable and open the `ChatTagsDialog` for that chat.
    - If no tags, this section should not render or take up space.

### 4. Data Fetching

- **File**: Likely in `app/(chat)/chat/[id]/page.tsx` or `components/sidebar-history.tsx` or wherever chat list data is fetched.
- **Action**:
  - Ensure the `tags` field is included when fetching chat data. Modify Drizzle queries accordingly.
  - Implement client-side logic to re-fetch chat data (e.g., the list of chats in the sidebar) after tags are successfully updated via the API. This could involve using a data fetching library's cache invalidation/refetch mechanism or a simple manual refetch.

### 5. State Management (Client-Side)

- The `ChatTagsDialog` will manage its own internal state for the list of tags being edited.
- Global state management or context might be used to trigger a refresh of the chat list if not handled by a data fetching library's automatic Caching/SWR capabilities.

### 6. Styling and UX

- Ensure the new UI elements are consistent with the existing design (`shadcn/ui`, Tailwind CSS).
- Provide clear visual feedback for adding/removing tags in the dialog.
- Consider edge cases: empty input, very long tags.

### Implementation Order Suggestion

1.  Update database schema (`lib/db/schema.ts`) and run migrations.
2.  Implement the backend API endpoint (`PUT /api/chat/[id]/tags`).
3.  Create the basic `ChatTagsDialog` component (structure, state, and API call integration).
4.  Implement client-side data re-fetching logic upon successful tag update.
5.  Integrate `ChatTagsDialog` with the "Edit Tags" button in `components/sidebar-history-item.tsx`.
6.  Implement tag display (up to 3, "+N more") in `components/sidebar-history-item.tsx`.
7.  Connect "+N more" to open `ChatTagsDialog`.
8.  Refine styling and UX.

This plan provides a structured approach to implementing the chat tagging feature.
