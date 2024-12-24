import Draggable from "react-draggable";

import {
  GripHorizontalIcon,
  LayoutGridIcon,
  MicIcon,
  MicOffIcon,
  VideoIcon,
  VideoOffIcon,
} from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@screenify.io/ui/components/ui/accordion";
import { Badge } from "@screenify.io/ui/components/ui/badge";
import { Button } from "@screenify.io/ui/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@screenify.io/ui/components/ui/card";
import { Label } from "@screenify.io/ui/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@screenify.io/ui/components/ui/select";
import { Separator } from "@screenify.io/ui/components/ui/separator";
import { Switch } from "@screenify.io/ui/components/ui/switch";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@screenify.io/ui/components/ui/tabs";
import { SAFE_AREA_PADDING } from "@screenify.io/recorder/constants/layout";
import { useRef } from "react";
import { useFetchUserCameraDevices } from "@screenify.io/recorder/hooks/use-camera";
import { useFetchUserMicrophoneDevices } from "@screenify.io/recorder/hooks/use-microphone";
import { usePreferenceStore } from "@screenify.io/recorder/store/preference";
import { useCoreStore } from "@screenify.io/recorder/store/core";
import { useWindowDimensions } from "@screenify.io/recorder/hooks/use-window-dimensions";

export function PluginCard() {
  const pluginRef = useRef<HTMLDivElement>(null!);

  const cameras = useFetchUserCameraDevices();
  const microphones = useFetchUserMicrophoneDevices();

  const { recording, setRecording } = useCoreStore();
  const { height: windowHeight, width: windowWidth } = useWindowDimensions();
  const { camera, microphone, setCamera, setMicrophone } = usePreferenceStore();

  const pluginWidth = pluginRef.current?.getBoundingClientRect().width || 448;
  const pluginHeight = pluginRef.current?.getBoundingClientRect().height || 526;

  const defaultPosition = {
    x: windowWidth - pluginWidth - SAFE_AREA_PADDING,
    y: SAFE_AREA_PADDING,
  };

  const bounds = {
    left: SAFE_AREA_PADDING,
    top: SAFE_AREA_PADDING,
    right: windowWidth - pluginWidth - SAFE_AREA_PADDING,
    bottom: windowHeight - pluginHeight - SAFE_AREA_PADDING,
  };

  return (
    <Draggable
      nodeRef={pluginRef}
      handle="#plugin-handle"
      defaultPosition={defaultPosition}
      bounds={bounds}
    >
      <Card
        ref={pluginRef}
        className="absolute p-0 bg-background w-full max-w-md overflow-hidden"
      >
        <CardHeader
          id="plugin-handle"
          className="grid place-items-center p-2 cursor-move"
        >
          <GripHorizontalIcon size={16} />
        </CardHeader>
        <Separator />
        <Tabs defaultValue="record">
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
          <Separator />
          <TabsContent value="record" className="mt-0">
            <CardContent className="p-0">
              <Accordion
                type="multiple"
                className="w-full max-h-96 overflow-auto"
              >
                <AccordionItem
                  value="camera"
                  className="shadow-none border-0 rounded-none"
                >
                  <AccordionTrigger className="bg-background">
                    Camera
                  </AccordionTrigger>
                  <AccordionContent className="bg-background p-6 space-y-5">
                    <Select value={camera} onValueChange={setCamera}>
                      <SelectTrigger className="">
                        <div className="flex items-center gap-2 flex-1">
                          {camera === "n/a" ? (
                            <VideoOffIcon size={20} />
                          ) : (
                            <VideoIcon size={20} />
                          )}
                          {camera === "n/a"
                            ? "No Camera"
                            : cameras.find((c) => c.deviceId === camera)
                                ?.label || "Select Camera"}
                          {camera === "n/a" ? (
                            <Badge className="ml-auto rounded-full">Off</Badge>
                          ) : null}
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="n/a">No Camera</SelectItem>
                        {cameras.map((camera, index) => (
                          <SelectItem
                            key={camera.deviceId}
                            value={camera.deviceId}
                          >
                            {camera.label || `Camera ${index + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="flip-camera">Flip Camera</Label>
                      <Switch id="flip-camera" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <Separator variant="thick" />
                <AccordionItem
                  value="microphone"
                  className="shadow-none border-0 rounded-none"
                >
                  <AccordionTrigger className="bg-background">
                    Microphone
                  </AccordionTrigger>
                  <AccordionContent className="bg-background p-6 space-y-5">
                    <Select value={microphone} onValueChange={setMicrophone}>
                      <SelectTrigger className="">
                        <div className="flex items-center gap-2 flex-1">
                          {microphone === "n/a" ? (
                            <MicOffIcon size={20} />
                          ) : (
                            <MicIcon size={20} />
                          )}
                          {microphone === "n/a"
                            ? "No Microphone"
                            : microphones.find((m) => m.deviceId === microphone)
                                ?.label || "Select Microphone"}
                          {microphone === "n/a" ? (
                            <Badge className="ml-auto rounded-full">Off</Badge>
                          ) : null}
                        </div>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="n/a">No Microphone</SelectItem>
                        {microphones.map((microphone, index) => (
                          <SelectItem
                            key={microphone.deviceId}
                            value={microphone.deviceId}
                          >
                            {microphone.label || `Microphone ${index + 1}`}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <div className="flex items-center justify-between gap-4">
                      <Label htmlFor="push-to-talk">
                        <span>Push to Talk</span>&nbsp;
                        <span className="text-xs">(⌥⇧U)</span>
                      </Label>
                      <Switch id="push-to-talk" />
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <Separator variant="thick" />
                <AccordionItem
                  value="advanced"
                  className="shadow-none border-0 rounded-none"
                >
                  <AccordionTrigger className="bg-background">
                    Toolbar
                  </AccordionTrigger>
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
              <Button
                className="w-full justify-between"
                onClick={() => setRecording(!recording)}
              >
                <span className="invisible text-xs">⌥⇧D</span>
                {recording ? (
                  <span className="font-bold">Stop Recording</span>
                ) : (
                  <span className="font-bold">Start Recording</span>
                )}
                <span className="visible text-xs">⌥⇧D</span>
              </Button>
            </CardFooter>
          </TabsContent>
          <TabsContent value="video" className="mt-0">
            <div className="p-8 grid place-items-center">Coming Soon!</div>
          </TabsContent>
        </Tabs>
      </Card>
    </Draggable>
  );
}
