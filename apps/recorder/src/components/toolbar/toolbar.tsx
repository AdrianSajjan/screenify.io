import Draggable from "react-draggable";

import {
  ArrowDownToLineIcon,
  GripVerticalIcon,
  MicIcon,
  MousePointer2Icon,
  PauseIcon,
  PenIcon,
  PlayIcon,
  RotateCcwIcon,
  Trash2Icon,
  VideoIcon,
  WandIcon,
} from "lucide-react";
import { useRef } from "react";

import { Button } from "@screenify.io/ui/components/ui/button";
import { Card } from "@screenify.io/ui/components/ui/card";
import { Separator } from "@screenify.io/ui/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@screenify.io/ui/components/ui/tooltip";
import { SAFE_AREA_PADDING } from "@screenify.io/recorder/constants/layout";
import { useCoreStore } from "@screenify.io/recorder/store/core";
import { useWindowDimensions } from "@screenify.io/recorder/hooks/use-window-dimensions";

export function PluginToolbar() {
  const toolbarRef = useRef<HTMLDivElement>(null!);

  const { recording, setRecording } = useCoreStore();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();

  const toolbarHeight =
    toolbarRef.current?.getBoundingClientRect().height || 40;
  const toolbarWidth = toolbarRef.current?.getBoundingClientRect().width || 200;

  const defaultPosition = {
    x: SAFE_AREA_PADDING,
    y: windowHeight - SAFE_AREA_PADDING - toolbarHeight,
  };

  const bounds = {
    left: SAFE_AREA_PADDING,
    top: SAFE_AREA_PADDING,
    right: windowWidth - SAFE_AREA_PADDING - toolbarWidth,
    bottom: windowHeight - SAFE_AREA_PADDING - toolbarHeight,
  };

  return (
    <Draggable
      nodeRef={toolbarRef}
      handle="#toolbar-handle"
      defaultPosition={defaultPosition}
      bounds={bounds}
    >
      <Card
        ref={toolbarRef}
        className="w-fit absolute bg-background overflow-hidden flex items-center h-10"
      >
        <TooltipProvider disableHoverableContent delayDuration={300}>
          <div className="px-1.5 bg-primary/80 h-10 grid place-items-center cursor-move">
            <GripVerticalIcon id="toolbar-handle" size={16} />
          </div>
          <Separator orientation="vertical" variant="thick" />
          <strong className="px-4 tabular-nums">00:00</strong>
          <Separator orientation="vertical" variant="thick" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <ArrowDownToLineIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Save recording</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          {recording ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="no-shadow"
                  className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
                  onClick={() => setRecording(false)}
                >
                  <PauseIcon size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Pause recording</span>
              </TooltipContent>
            </Tooltip>
          ) : (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="no-shadow"
                  className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
                  onClick={() => setRecording(true)}
                >
                  <PlayIcon size={20} />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <span>Resume recording</span>
              </TooltipContent>
            </Tooltip>
          )}
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <RotateCcwIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Restart recording</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <Trash2Icon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Delete recording</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" variant="thick" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <PenIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Drawing options</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <WandIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Effects options</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <MousePointer2Icon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Cursor options</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" variant="thick" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <MicIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Toggle mic</span>
            </TooltipContent>
          </Tooltip>
          <Separator orientation="vertical" />
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="no-shadow"
                className="h-10 w-10 grid place-items-center border-0 bg-background hover:bg-primary rounded-none"
              >
                <VideoIcon size={20} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <span>Toggle camera</span>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </Card>
    </Draggable>
  );
}
