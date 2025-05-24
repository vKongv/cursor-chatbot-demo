'use client';

import type { Chat } from '@/lib/db/schema';
import {
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
} from './ui/sidebar';
import Link from 'next/link';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import {
  CheckCircleFillIcon,
  GlobeIcon,
  LockIcon,
  MoreHorizontalIcon,
  ShareIcon,
  TrashIcon,
} from './icons';
import { memo, useState } from 'react';
import { useChatVisibility } from '@/hooks/use-chat-visibility';
import { Badge } from './ui/badge';
import { ChatTagsDialog } from './chat/chat-tags-dialog';
import { TagIcon } from 'lucide-react';

const PureChatItem = ({
  chat,
  isActive,
  onDelete,
  setOpenMobile,
  onUpdate,
}: {
  chat: Chat;
  isActive: boolean;
  onDelete: (chatId: string) => void;
  setOpenMobile: (open: boolean) => void;
  onUpdate?: () => void;
}) => {
  const { visibilityType, setVisibilityType } = useChatVisibility({
    chatId: chat.id,
    initialVisibilityType: chat.visibility,
  });

  const [tagsDialogOpen, setTagsDialogOpen] = useState(false);

  const displayedTags = chat.tags?.slice(0, 2) || [];
  const remainingTagsCount = (chat.tags?.length || 0) - displayedTags.length;

  const handleTagsClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setTagsDialogOpen(true);
  };

  return (
    <>
      <SidebarMenuItem>
        <SidebarMenuButton asChild isActive={isActive} size="flexi">
          <Link href={`/chat/${chat.id}`} onClick={() => setOpenMobile(false)}>
            <div className="flex flex-col items-start w-full gap-1">
              <span>{chat.title}</span>
              {(chat.tags?.length || 0) > 0 && (
                <button
                  type="button"
                  className="flex flex-wrap gap-1"
                  onClick={handleTagsClick}
                >
                  {displayedTags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="outline"
                      className="text-xs px-1 py-0 h-5"
                    >
                      {tag}
                    </Badge>
                  ))}
                  {remainingTagsCount > 0 && (
                    <Badge
                      variant="outline"
                      className="text-xs px-1 py-0 h-5 cursor-pointer"
                    >
                      +{remainingTagsCount} more
                    </Badge>
                  )}
                </button>
              )}
            </div>
          </Link>
        </SidebarMenuButton>

        <DropdownMenu modal={true}>
          <DropdownMenuTrigger asChild>
            <SidebarMenuAction
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground mr-0.5"
              showOnHover={!isActive}
            >
              <MoreHorizontalIcon />
              <span className="sr-only">More</span>
            </SidebarMenuAction>
          </DropdownMenuTrigger>

          <DropdownMenuContent side="bottom" align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => setTagsDialogOpen(true)}
            >
              <TagIcon size={16} />
              <span>Edit Tags</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger className="cursor-pointer">
                <ShareIcon />
                <span>Share</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuItem
                    className="cursor-pointer flex-row justify-between"
                    onClick={() => {
                      setVisibilityType('private');
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <LockIcon size={12} />
                      <span>Private</span>
                    </div>
                    {visibilityType === 'private' ? (
                      <CheckCircleFillIcon />
                    ) : null}
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="cursor-pointer flex-row justify-between"
                    onClick={() => {
                      setVisibilityType('public');
                    }}
                  >
                    <div className="flex flex-row gap-2 items-center">
                      <GlobeIcon />
                      <span>Public</span>
                    </div>
                    {visibilityType === 'public' ? (
                      <CheckCircleFillIcon />
                    ) : null}
                  </DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem
              className="cursor-pointer text-destructive focus:bg-destructive/15 focus:text-destructive dark:text-red-500"
              onSelect={() => onDelete(chat.id)}
            >
              <TrashIcon />
              <span>Delete</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>

      <ChatTagsDialog
        open={tagsDialogOpen}
        onOpenChange={setTagsDialogOpen}
        chatId={chat.id}
        currentTags={chat.tags || []}
        onTagsUpdated={() => {
          onUpdate?.();
        }}
      />
    </>
  );
};

export const ChatItem = memo(PureChatItem, (prevProps, nextProps) => {
  if (prevProps.isActive !== nextProps.isActive) return false;
  if (prevProps.chat.tags !== nextProps.chat.tags) return false;
  return true;
});
