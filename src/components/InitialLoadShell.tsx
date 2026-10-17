import Taskbar from "@/components/Taskbar/Taskbar";
export default function InitialLoadShell({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="bg-[#09090B]">
      <noscript>
        <style>{".portfolio-preloader{display:none}.portfolio-dock{visibility:visible;animation:none}"}</style>
      </noscript>
      {children}
      <div className="portfolio-dock">
        <Taskbar />
      </div>
    </div>
  );
}
