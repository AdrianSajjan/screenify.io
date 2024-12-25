import Draggable from "react-draggable";

import { GripHorizontalIcon, LayoutGridIcon, VideoIcon } from "lucide-react";
import { observer } from "mobx-react";
import { useRef } from "react";

import { Accordion } from "@screenify.io/ui/components/ui/accordion";
import { Button } from "@screenify.io/ui/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@screenify.io/ui/components/ui/card";
import { Separator } from "@screenify.io/ui/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@screenify.io/ui/components/ui/tabs";

import { CameraPlugin } from "@screenify.io/recorder/components/plugin/camera";
import { MicrophonePlugin } from "@screenify.io/recorder/components/plugin/microphone";
import { ToolbarPlugin } from "@screenify.io/recorder/components/plugin/toolbar";
import { ScreenPlugin } from "@screenify.io/recorder/components/plugin/screen";

import { SAFE_AREA_PADDING } from "@screenify.io/recorder/constants/layout";
import { useWindowDimensions } from "@screenify.io/recorder/hooks/use-window-dimensions";
import { measureElement } from "@screenify.io/recorder/lib/utils";
import { recorder } from "@screenify.io/recorder/store/recorder";

const PluginCardHOC = observer(() => {
  if (recorder.status === "idle" || recorder.status === "pending" || recorder.status === "error") {
    return <PluginCard />;
  } else {
    return null;
  }
});

const PluginCard = observer(() => {
  const plugin$ = useRef<HTMLDivElement>(null!);

  const { height: screenHeight, width: screenWidth } = useWindowDimensions();
  const { height: pluginHeight, width: pluginWidth } = measureElement(plugin$.current, { height: 526, width: 448 });

  const handleScreenCapture = () => {
    switch (recorder.status) {
      case "pending":
        recorder.cancelScreenCapture();
        break;
      case "idle":
        recorder.startScreenCapture();
        break;
    }
  };

  const defaultPosition = {
    x: screenWidth - pluginWidth - SAFE_AREA_PADDING,
    y: SAFE_AREA_PADDING,
  };

  const bounds = {
    left: SAFE_AREA_PADDING,
    top: SAFE_AREA_PADDING,
    right: screenWidth - pluginWidth - SAFE_AREA_PADDING,
    bottom: screenHeight - pluginHeight - SAFE_AREA_PADDING,
  };

  return (
    <Draggable nodeRef={plugin$} handle="#plugin-handle" defaultPosition={defaultPosition} bounds={bounds}>
      <Tabs ref={plugin$} defaultValue="record" className="w-full max-w-md">
        <Card className="absolute p-0 bg-background w-full overflow-hidden animate-in fade-in-0 zoom-in-75">
          <CardHeader className="p-0 space-y-0">
            <div className="cursor-move w-full p-2 grid place-items-center" id="plugin-handle">
              <GripHorizontalIcon size={16} />
            </div>
            <Separator />
            <TabsList className="rounded-none border-none">
              <TabsTrigger className="w-full" value="record">
                <VideoIcon size={20} />
                <span>Record</span>
              </TabsTrigger>
              <TabsTrigger className="w-full" value="video">
                <LayoutGridIcon size={20} />
                <span>Videos</span>
              </TabsTrigger>
            </TabsList>
          </CardHeader>
          <Separator />
          <TabsContent value="record" className="mt-0">
            <CardContent className="p-0">
              <Accordion type="multiple" className="w-full max-h-96 overflow-auto">
                <CameraPlugin />
                <Separator variant="thick" />
                <MicrophonePlugin />
                <Separator variant="thick" />
                <ScreenPlugin />
                <Separator variant="thick" />
                <ToolbarPlugin />
              </Accordion>
            </CardContent>
            <Separator variant="thick" />
            <CardFooter className="pt-5">
              <Button className="w-full justify-between" onClick={handleScreenCapture}>
                <span className="invisible text-xs">⌥⇧D</span>
                <span className="font-bold">{recorder.status === "pending" ? "Cancel Recording" : "Start Recording"}</span>
                <span className="visible text-xs">⌥⇧D</span>
              </Button>
            </CardFooter>
          </TabsContent>
          <TabsContent value="video" className="mt-0">
            <div className="p-8 grid place-items-center">Coming Soon!</div>
          </TabsContent>
        </Card>
      </Tabs>
    </Draggable>
  );
});

export { PluginCardHOC as PluginCard };
