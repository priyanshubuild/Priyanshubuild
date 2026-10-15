import LoadingScreen from "@/components/LoadingScreen";
import Taskbar from "@/components/Taskbar/Taskbar";
export default function InitialLoadShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#09090B]">
      <noscript>
        <style>{".portfolio-preloader{display:none}"}</style>
      </noscript>
      <LoadingScreen />
      {children}
      <Taskbar />
    </div>
  );
}
