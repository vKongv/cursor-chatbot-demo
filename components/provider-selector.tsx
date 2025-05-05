'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import { CheckCircleFillIcon, ChevronDownIcon } from './icons';
import type { ProviderConfig } from '@/lib/ai/config';

export function ProviderSelector({
  selectedProviderId,
  setSelectedProviderId,
  setSelectedModelId,
  providers,
  className,
}: {
  selectedProviderId: string;
  setSelectedProviderId: (id: string) => void;
  setSelectedModelId: (id: string) => void;
  providers: ProviderConfig[];
} & React.ComponentProps<typeof Button>) {
  const [open, setOpen] = useState(false);

  const selectedProvider = providers.find(
    (provider) => provider.id === selectedProviderId,
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        asChild
        className={cn(
          'w-fit data-[state=open]:bg-accent data-[state=open]:text-accent-foreground',
          className,
        )}
      >
        <Button
          data-testid="provider-selector"
          variant="outline"
          className="md:px-2 md:h-[34px]"
        >
          {selectedProvider?.name || 'Select Provider'}
          <ChevronDownIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-[300px]">
        {providers.map((provider) => {
          const { id, name } = provider;

          return (
            <DropdownMenuItem
              data-testid={`provider-selector-item-${id}`}
              key={id}
              onSelect={() => {
                setOpen(false);
                setSelectedProviderId(id);
                
                // When provider changes, set model to the default for that provider
                const defaultModelId = provider.defaultModelId;
                setSelectedModelId(defaultModelId);
              }}
              data-active={id === selectedProviderId}
              asChild
            >
              <button
                type="button"
                className="gap-4 group/item flex flex-row justify-between items-center w-full"
              >
                <div className="flex flex-col gap-1 items-start">
                  <div>{name}</div>
                  <div className="text-xs text-muted-foreground">
                    {`${provider.models.length} models available`}
                  </div>
                </div>

                <div className="text-foreground dark:text-foreground opacity-0 group-data-[active=true]/item:opacity-100">
                  <CheckCircleFillIcon />
                </div>
              </button>
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
} 