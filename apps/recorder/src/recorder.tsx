import { CameraStream } from "@screenify.io/recorder/components/camera/camera";
import { PluginCard } from "@screenify.io/recorder/components/plugin/plugin";
import { PluginToolbar } from "@screenify.io/recorder/components/toolbar/toolbar";

export default function App() {
  return (
    <section className="w-screen h-screen z-base bg-overlay-light">
      <PluginCard />
      <PluginToolbar />
      <CameraStream />
    </section>
  );
}
