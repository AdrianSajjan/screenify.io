import Draggable from "react-draggable";

import { GripHorizontalIcon, LayoutGridIcon, VideoIcon, VideoOffIcon } from "lucide-react";
import { observer } from "mobx-react";
import { useRef } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@screenify.io/ui/components/ui/accordion";
import { Badge } from "@screenify.io/ui/components/ui/badge";
import { Button } from "@screenify.io/ui/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader } from "@screenify.io/ui/components/ui/card";
import { Label } from "@screenify.io/ui/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger } from "@screenify.io/ui/components/ui/select";
import { Separator } from "@screenify.io/ui/components/ui/separator";
import { Switch } from "@screenify.io/ui/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@screenify.io/ui/components/ui/tabs";

import { useFetchUserCameraDevices } from "@screenify.io/recorder/hooks/use-camera";
import { useWindowDimensions } from "@screenify.io/recorder/hooks/use-window-dimensions";

import { MicrophonePlugin } from "@screenify.io/recorder/components/plugins/microphone";
import { SAFE_AREA_PADDING } from "@screenify.io/recorder/constants/layout";
import { camera } from "@screenify.io/recorder/store/camera";
import { recorder } from "@screenify.io/recorder/store/recorder";
import { measureElement } from "@screenify.io/recorder/lib/utils";

const PluginCardHOC = observer(() => {
  if (recorder.status === "idle" || recorder.status === "pending" || recorder.status === "error") {
    return <PluginCard />;
  } else {
    return null;
  }
});

const PluginCard = observer(() => {
  const plugin$ = useRef<HTMLDivElement>(null!);
  const cameras = useFetchUserCameraDevices();

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
                <AccordionItem value="camera" className="shadow-none border-0 rounded-none">
                  <AccordionTrigger className="bg-background">Camera</AccordionTrigger>
                  <AccordionContent className="bg-background p-6 space-y-5">
                    <Select value={camera.device} onValueChange={camera.changeDevice}>
                      <SelectTrigger className="">
                        <div className="flex items-center gap-2 flex-1">
                          {camera.device === "n/a" ? <VideoOffIcon size={20} /> : <VideoIcon size={20} />}
                          {camera.device === "n/a" ? "No Camera" : cameras.find((c) => c.deviceId === camera.device)?.label}
                          {camera.device === "n/a" ? <Badge className="ml-auto rounded-full">Off</Badge> : null}
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="n/a">No Camera</SelectItem>
                        {cameras.map((camera, index) => (
                          <SelectItem key={camera.deviceId} value={camera.deviceId}>
                            {camera.label || `Camera ${index + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="flip-camera">Flip Camera</Label>
                      <Switch id="flip-camera" checked={camera.flip} onCheckedChange={camera.updateFlip} />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <Separator variant="thick" />
                <MicrophonePlugin />
                <Separator variant="thick" />
                <AccordionItem value="advanced" className="shadow-none border-0 rounded-none">
                  <AccordionTrigger className="bg-background">Toolbar</AccordionTrigger>
                  <AccordionContent className="bg-background p-6 space-y-5">
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="hide-toolbar">Enabled</Label>
                      <Switch id="hide-toolbar" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="camera-controls">Camera Controls</Label>
                      <Switch id="camera-controls" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="mic-controls">Microphone Controls</Label>
                      <Switch id="mic-controls" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="cursor-controls">Cursor Controls</Label>
                      <Switch id="cursor-controls" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="effects-controls">Effects Controls</Label>
                      <Switch id="effects-controls" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="blur-controls">Blur Controls</Label>
                      <Switch id="blur-controls" />
                    </div>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="drawing-controls">Drawing Controls</Label>
                      <Switch id="drawing-controls" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
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
