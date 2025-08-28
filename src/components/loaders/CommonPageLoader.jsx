import { LoaderIcon } from "lucide-react";
import { useThemeStore } from "../../stores/useThemeStore";

const CommonPageLoader = () => {
  const { theme } = useThemeStore();
  return (
    <>
      <div
        className="min-h-[calc(100vh)] flex items-center justify-center"
        data-theme={theme}
      >
        <LoaderIcon className="animate-spin size-8 text-primary"></LoaderIcon>
      </div>
    </>
  );
};

export default CommonPageLoader;
