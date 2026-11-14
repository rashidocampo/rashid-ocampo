import { ParallaxComponent } from "@/components/ui/parallax-scrolling";

export default function ParallaxDemo() {
  return (
    <>
      <ParallaxComponent>
        <div className="wrap grid min-h-[28rem] items-center">
          <h2 className="display-lg">Mountain parallax</h2>
        </div>
      </ParallaxComponent>
      <p className="wrap py-6 text-sm">
        Adapted from <a className="link" href="https://www.osmo.supply/">Osmo</a>.
        Mountain photograph by{" "}
        <a className="link" href="https://unsplash.com/photos/landscape-photography-of-mountains-with-fog-_MMP5j_fCqw">
          Willian Justen de Vasconcellos
        </a>.
      </p>
    </>
  );
}
