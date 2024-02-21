import { cn } from 'ui/utils';
import { Button } from 'ui/core/components/button';
import { ScrollArea } from 'ui/core/components/scroll-area';
import { Playlist } from '../data/playlists';
import { CodeIcon } from '@radix-ui/react-icons';
import { useRouter } from 'next/router';
import { ChevronRight } from 'lucide-react';
import clsx from 'clsx';
import { useDebounce } from 'use-debounce';
import { atom } from 'jotai';
import { useState } from 'react';

export const sidebarState = atom<boolean>(false);
interface SidebarProps extends React.HTMLAttributes<HTMLDivElement> {
  playlists: Playlist[];
}

enum SidebarState {
  OPEN = 'open',
  CLOSED = 'closed',
}

export function Sidebar({ playlists }: SidebarProps) {
  const { push } = useRouter();
  const [open, setOpen] = useState<SidebarState>(SidebarState.OPEN);

  const debouncedState = useDebounce(open, 250);

  return (
    <>
      <SidebarButton
        open={open === SidebarState.OPEN}
        setOpen={(open) =>
          setOpen(open ? SidebarState.OPEN : SidebarState.CLOSED)
        }
        className="absolute bottom-10 right-2 z-50 rounded-full items-center justify-center flex"
      />

      <div
        key="sidebar"
        className={clsx(
          'bg-background/75 transition-all duration-200 ease-in-out',
          open === SidebarState.OPEN
            ? 'w-80 opacity-100'
            : debouncedState[0] === SidebarState.CLOSED
            ? 'hidden opacity-0'
            : '!w-0 opacity-0'
        )}
      >
        <div className="space-y-4 py-4">
          <div className="px-3 py-2">
            <h2 className="mb-2 px-4 text-xl font-medium tracking-wide">
              Models
            </h2>
            <div className="space-y-1">
              <ModelButton model="racks-t3-7B">
                <svg
                  aria-label="Next.js logomark"
                  data-theme="light"
                  height="40"
                  role="img"
                  viewBox="0 0 180 180"
                  width="40"
                  className="mr-2 h-4 w-4"
                >
                  <mask
                    height="180"
                    id=":R0:mask0_408_134"
                    maskUnits="userSpaceOnUse"
                    style={{ maskType: 'alpha' }}
                    width="180"
                    x="0"
                    y="0"
                  >
                    <circle cx="90" cy="90" fill="black" r="90"></circle>
                  </mask>
                  <g mask="url(#:R0:mask0_408_134)">
                    <circle
                      cx="90"
                      cy="90"
                      data-circle="true"
                      fill="black"
                      r="90"
                    ></circle>
                    <path
                      d="M149.508 157.52L69.142 54H54V125.97H66.1136V69.3836L139.999 164.845C143.333 162.614 146.509 160.165 149.508 157.52Z"
                      fill="url(#:R0:paint0_linear_408_134)"
                    ></path>
                    <rect
                      fill="url(#:R0:paint1_linear_408_134)"
                      height="72"
                      width="12"
                      x="115"
                      y="54"
                    ></rect>
                  </g>
                  <defs>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id=":R0:paint0_linear_408_134"
                      x1="109"
                      x2="144.5"
                      y1="116.5"
                      y2="160.5"
                    >
                      <stop stop-color="white"></stop>
                      <stop
                        offset="1"
                        stop-color="white"
                        stop-opacity="0"
                      ></stop>
                    </linearGradient>
                    <linearGradient
                      gradientUnits="userSpaceOnUse"
                      id=":R0:paint1_linear_408_134"
                      x1="121"
                      x2="120.799"
                      y1="54"
                      y2="106.875"
                    >
                      <stop stop-color="white"></stop>
                      <stop
                        offset="1"
                        stop-color="white"
                        stop-opacity="0"
                      ></stop>
                    </linearGradient>
                  </defs>
                </svg>
                racks-t3-7B
              </ModelButton>

              <ModelButton model="racks-shadcn-7B">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 256 256"
                  className="mr-2 h-4 w-4"
                >
                  <rect width="256" height="256" fill="none"></rect>
                  <line
                    x1="208"
                    y1="128"
                    x2="128"
                    y2="208"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  ></line>
                  <line
                    x1="192"
                    y1="40"
                    x2="40"
                    y2="192"
                    fill="none"
                    stroke="currentColor"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="16"
                  ></line>
                </svg>
                racks-shadcn-7B
              </ModelButton>
            </div>
          </div>
          <div className="py-2">
            <h2 className="relative px-7 text-xl font-medium tracking-wide">
              Recent
            </h2>
            <ScrollArea className="h-[300px] px-1">
              <div className="space-y-1 p-2">
                {playlists?.map((playlist, i) => (
                  <Button
                    key={`${playlist}-${i}`}
                    variant="ghost"
                    className="w-full justify-start font-normal overflow-ellipsis"
                  >
                    <CodeIcon className="mr-2 h-4 w-4 mt-1" />
                    {playlist}
                  </Button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </div>
    </>
  );
}

interface ModelButtonProps {
  model: string;
  children: React.ReactNode;
}

const ModelButton: React.FC<ModelButtonProps> = ({ model, children }) => {
  const { push } = useRouter();
  return (
    <Button
      variant="ghost"
      className="w-full justify-start"
      onClick={() =>
        push({
          pathname: '/home',
          query: {
            tab: 'chat',
            model: model,
          },
        })
      }
    >
      {children}
    </Button>
  );
};

const SidebarButton = ({
  open,
  setOpen,
  className,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  className?: string;
}) => {
  return (
    <Button
      variant="default"
      size="iconxs"
      className={className}
      onClick={() => setOpen(!open)}
    >
      <ChevronRight
        className={clsx(
          'h-5 w-5 transition-transform duration-150 ease-in-out',
          open && 'rotate-180'
        )}
      />
    </Button>
  );
};
