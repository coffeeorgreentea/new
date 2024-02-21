import { Button, buttonVariants } from 'ui/core/components/button';
import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from 'ui/core/components/menubar';

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from 'ui/core/components/tooltip';

import {
  GitHubLogoIcon,
  HeartIcon,
  MoonIcon,
  SunIcon,
} from '@radix-ui/react-icons';
import { useTheme } from 'next-themes';
import { HFLogo } from '../svg/hf';
import Link from 'next/link';

export function Menu() {
  const { theme, setTheme } = useTheme();
  return (
    <Menubar className="rounded-none border-none px-2 lg:px-4 sticky w-full">
      <MenubarMenu>
        <MenubarTrigger className="font-bold">Racks</MenubarTrigger>
        <MenubarContent>
          <MenubarLabel className="text-muted-foreground">
            Version 0.0.1
            <br />
            <Link
              target="_blank"
              href="https://github.com/coffeeorgreentea"
              className="text-xs text-muted-foreground hover:underline"
            >
              developed by coffeeorgreentea
            </Link>
          </MenubarLabel>
          <MenubarItem>About Racks</MenubarItem>
          <MenubarSeparator />
          <MenubarItem className="gap-x-2 items-center justify-start inline-flex w-full">
            <GitHubLogoIcon className="h-4 w-4" />
            Github
          </MenubarItem>
          <MenubarItem className="gap-x-2 items-center justify-start inline-flex w-full">
            <HFLogo />
            Huggingface
          </MenubarItem>
          <MenubarItem className="gap-x-2 items-center justify-start inline-flex w-full">
            <HeartIcon className="h-4 w-4" />
            Support Me
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger className="relative">File</MenubarTrigger>
        <MenubarContent>
          <MenubarSub>
            <MenubarSubTrigger>New</MenubarSubTrigger>
            <MenubarSubContent className="w-[230px]">
              <MenubarItem>
                Front-end <MenubarShortcut>⌘</MenubarShortcut>
              </MenubarItem>
              <MenubarItem disabled>
                Back-end<MenubarShortcut>⇧⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>
                Fullstack<MenubarShortcut>⌥⌘N</MenubarShortcut>
              </MenubarItem>
              <MenubarItem>Playlist Folder</MenubarItem>
              <MenubarItem disabled>Genius Playlist</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>
            Open Stream URL... <MenubarShortcut>⌘U</MenubarShortcut>
          </MenubarItem>
          <MenubarItem>
            Close Window <MenubarShortcut>⌘W</MenubarShortcut>
          </MenubarItem>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Library</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Update Cloud Library</MenubarItem>
              <MenubarItem>Update Genius</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Organize Library...</MenubarItem>
              <MenubarItem>Export Library...</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Import Playlist...</MenubarItem>
              <MenubarItem disabled>Export Playlist...</MenubarItem>
              <MenubarItem>Show Duplicate Items</MenubarItem>
              <MenubarSeparator />
              <MenubarItem>Get Album Artwork</MenubarItem>
              <MenubarItem disabled>Get Track Names</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarItem>
            Import... <MenubarShortcut>⌘O</MenubarShortcut>
          </MenubarItem>
          <MenubarItem disabled>Burn Playlist to Disc...</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>
            Show in Finder <MenubarShortcut>⇧⌘R</MenubarShortcut>{' '}
          </MenubarItem>
          <MenubarItem>Convert</MenubarItem>
          <MenubarSeparator />
          <MenubarItem>Page Setup...</MenubarItem>
          <MenubarItem disabled>
            Print... <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <MenubarMenu>
        <MenubarTrigger>Styles</MenubarTrigger>
        <MenubarContent>
          <MenubarItem>Edit Theme</MenubarItem>
          <MenubarItem>Open Quick Style</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Hide Sidebar</MenubarItem>
          <MenubarItem
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="gap-x-2 items-center justify-start inline-flex w-full"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
            Enable {theme === 'dark' ? 'Light' : 'Dark'} Mode
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Account</MenubarTrigger>
        <MenubarContent forceMount>
          <MenubarItem inset>Settings</MenubarItem>
          <MenubarSeparator />
          <MenubarItem inset>Logout</MenubarItem>
        </MenubarContent>
      </MenubarMenu>

      <div className="grow" />

      {/* Buttons */}
      <div className="hidden md:inline-flex items-center self-center gap-x-2">
        <MenuIconLink
          type={MenuButtonTypes.BUTTON}
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          tooltip={`Enable ${theme === 'dark' ? 'Light' : 'Dark'} Mode`}
        >
          {theme === 'dark' ? (
            <SunIcon onClick={() => setTheme('light')} />
          ) : (
            <MoonIcon onClick={() => setTheme('dark')} />
          )}
        </MenuIconLink>
        <MenuIconLink tooltip="Support Me" type={MenuButtonTypes.LINK} href="#">
          <HeartIcon />
        </MenuIconLink>
        <MenuIconLink
          tooltip="Github"
          href="https://github.com/coffeeorgreentea"
          type={MenuButtonTypes.LINK}
        >
          <GitHubLogoIcon />
        </MenuIconLink>
        <MenuIconLink
          tooltip="Hugging Face"
          href="https://huggingface.co/spaceinvader"
          type={MenuButtonTypes.LINK}
        >
          <HFLogo />
        </MenuIconLink>
      </div>
    </Menubar>
  );
}

enum MenuButtonTypes {
  BUTTON = 'button',
  LINK = 'link',
}

interface MenuButtonProps {
  children: React.ReactNode;
  tooltip: string;
  type?: MenuButtonTypes;
  href?: string;
  onClick?: () => void;
}

const MenuIconLink: React.FC<MenuButtonProps> = ({
  children,
  tooltip,
  type = MenuButtonTypes.BUTTON,
  href = '#',
  onClick = () => {},
}) => {
  return (
    <TooltipProvider delayDuration={200}>
      <Tooltip>
        <TooltipTrigger asChild>
          {type === MenuButtonTypes.BUTTON ? (
            <Button
              onClick={onClick}
              variant="ghost"
              size="icon"
              className="!self-center !h-4 !w-4"
            >
              {children}
            </Button>
          ) : (
            <Link
              href={href}
              target="_blank"
              className={buttonVariants({
                variant: 'ghost',
                size: 'icon',
                className: '!self-center !h-4 !w-4',
              })}
            >
              {children}
            </Link>
          )}
        </TooltipTrigger>
        <TooltipContent side="bottom" align="end">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};
