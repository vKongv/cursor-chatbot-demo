import { auth } from '@/app/(auth)/auth';
import { getChatById, updateChatTagsById } from '@/lib/db/queries';
import { NextResponse } from 'next/server';
import { z } from 'zod';

const updateTagsSchema = z.object({
  tags: z.array(z.string()),
});

export async function PUT(
  request: Request,
  { params }: { params: { id: string } },
) {
  try {
    const session = await auth();

    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id: chatId } = params;
    const body = await request.json();

    const { tags } = updateTagsSchema.parse(body);

    // Check if chat exists and belongs to user
    const chat = await getChatById({ id: chatId });
    if (!chat) {
      return NextResponse.json({ error: 'Chat not found' }, { status: 404 });
    }

    if (chat.userId !== session.user.id) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    // Update the tags
    const [updatedChat] = await updateChatTagsById({ chatId, tags });

    return NextResponse.json({
      success: true,
      chat: updatedChat,
    });
  } catch (error) {
    console.error('Failed to update chat tags:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 },
    );
  }
}
