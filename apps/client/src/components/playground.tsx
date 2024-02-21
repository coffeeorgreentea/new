import { Metadata } from 'next';
import Image from 'next/image';
import { CounterClockwiseClockIcon } from '@radix-ui/react-icons';

import { Button } from 'ui/core/components/button';
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from 'ui/core/components/hover-card';
import { Label } from 'ui/core/components/label';
import { Separator } from 'ui/core/components/separator';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from 'ui/core/components/tabs';
import { Textarea } from 'ui/core/components/textarea';

import { CodeViewer } from './code-viewer';
import { MaxLengthSelector } from './maxlength-selector';
import { ModelSelector } from './model-selector';
import { PresetActions } from './preset-actions';
import { PresetSave } from './preset-save';
import { PresetSelector } from './preset-selector';
import { PresetShare } from './preset-share';
import { TemperatureSelector } from './temperature-selector';
import { TopPSelector } from './top-p-selector';
import { models, types } from '../data/models';
import { presets } from '../data/presets';
import { FileCode, MessageSquareCode, Monitor } from 'lucide-react';
import { useRouter } from 'next/router';
import React from 'react';
import { useQueryParams } from 'ui/hooks';

export const metadata: Metadata = {
  title: 'Playground',
  description: 'The OpenAI Playground built using the components.',
};

enum Mode {
  Chat = 'chat',
  Split = 'split',
  Edit = 'edit',
}

export const Playground = () => {
  const mode = React.useState<string>(Mode.Chat);
  return (
    <>
      <div className="inline-flex w-full items-center">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <h2 className="text-xl font-semibold">LLM</h2>
            <p className="text-sm text-muted-foreground">
            How many tokens can your brain hold in context?
            </p>
          </div>
        </div>
        <div className="ml-auto flex space-x-2 sm:justify-end">
          <PresetSelector presets={presets} />
          <PresetSave />
          <div className="hidden space-x-2 md:flex">
            <CodeViewer />
            <PresetShare />
          </div>
          <PresetActions />
        </div>
      </div>
      {/* Chat Window */}
      <Tabs value={mode[0]} onValueChange={mode[1]} className="flex-1">
        <div className="container h-full py-6">
          <div className="grid h-full items-stretch gap-6 md:grid-cols-[1fr_200px]">
            <div className="hidden flex-col space-y-4 sm:flex md:order-2">
              <div className="grid gap-2">
                <HoverCard openDelay={200}>
                  <HoverCardTrigger asChild>
                    <span className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      Mode
                    </span>
                  </HoverCardTrigger>
                  <HoverCardContent className="w-[320px] text-sm" side="left">
                    Choose the interface that best suits your task. You can
                    provide: a simple prompt to complete, starting and ending
                    text to insert a completion within, or some text with
                    instructions to edit it.
                  </HoverCardContent>
                </HoverCard>
                <TabsList className="grid grid-cols-3">
                  <TabsTrigger value={Mode.Chat}>
                    <span className="sr-only">Chat</span>
                    <MessageSquareCode className="w-5 h-5" />
                  </TabsTrigger>
                  <TabsTrigger value={Mode.Split}>
                    <span className="sr-only">Split</span>
                    <Monitor className="w-5 h-5" />
                  </TabsTrigger>
                  <TabsTrigger value={Mode.Edit}>
                    <span className="sr-only">Edit</span>
                    <FileCode className="w-5 h-5" />
                  </TabsTrigger>
                </TabsList>
              </div>
              <ModelSelector types={types} models={models} />
              <TemperatureSelector defaultValue={[0.56]} />
              <MaxLengthSelector defaultValue={[256]} />
              <TopPSelector defaultValue={[0.9]} />
            </div>
            <div className="md:order-1">
              <TabsContent value={Mode.Chat} className="mt-0 border-0 p-0">
                <div className="flex h-full flex-col space-y-4">
                  <Textarea
                    placeholder="Write a tagline for an ice cream shop"
                    className="min-h-[400px] flex-1 p-4 md:min-h-[700px] lg:min-h-[700px] bg-secondary/50"
                  />
                  <div className="flex items-center space-x-2">
                    <Button>Submit</Button>
                    <Button variant="secondary">
                      <span className="sr-only">Show history</span>
                      <CounterClockwiseClockIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value={Mode.Split} className="mt-0 border-0 p-0">
                <div className="flex flex-col space-y-4">
                  <div className="grid h-full grid-rows-2 gap-6 lg:grid-cols-2 lg:grid-rows-1">
                    <Textarea
                      placeholder="We're writing to [inset]. Congrats from OpenAI!"
                      className="h-full min-h-[300px] lg:min-h-[700px] xl:min-h-[700px] bg-secondary/50"
                    />
                    <div className="rounded-md border bg-muted"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button>Submit</Button>
                    <Button variant="secondary">
                      <span className="sr-only">Show history</span>
                      <CounterClockwiseClockIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
              <TabsContent value={Mode.Edit} className="mt-0 border-0 p-0">
                <div className="flex flex-col space-y-4">
                  <div className="grid h-full gap-6 lg:grid-cols-2">
                    <div className="flex flex-col space-y-4">
                      <div className="flex flex-1 flex-col space-y-2">
                        <Label htmlFor="input">Input</Label>
                        <Textarea
                          id="input"
                          placeholder="We is going to the market."
                          className="flex-1 lg:min-h-[580px] bg-secondary/50"
                        />
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Label htmlFor="instructions">Instructions</Label>
                        <Textarea
                          id="instructions"
                          placeholder="Fix the grammar."
                          className='bg-secondary/50'
                        />
                      </div>
                    </div>
                    <div className="mt-[21px] min-h-[400px] rounded-md border bg-muted lg:min-h-[700px]" />
                  </div>
                  <div className="flex items-center space-x-2">
                    <Button>Submit</Button>
                    <Button variant="secondary">
                      <span className="sr-only">Show history</span>
                      <CounterClockwiseClockIcon className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </TabsContent>
            </div>
          </div>
        </div>
      </Tabs>
    </>
  );
};
