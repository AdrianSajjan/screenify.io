import { CameraPreview } from "@screenify.io/recorder/components/camera";
import { PluginCard } from "@screenify.io/recorder/components/plugin/plugin";
import { Timer } from "@screenify.io/recorder/components/timer";
import { PluginToolbar } from "@screenify.io/recorder/components/toolbar/toolbar";

export default function App() {
  return (
    <section className="w-screen h-screen z-base bg-overlay-light">
      <PluginCard />
      <PluginToolbar />
      <CameraPreview />
      <Timer />
    </section>
  );
}
