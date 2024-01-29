import SearchBar from "@/features/ui/search-bar/search-bar";

const Toolbar = () => (
  <div
    className="w-full bg-[#f9f9f9] border-b  border_solid border-gray-200 \
  border-r-[1px_solid_rgba(0, 0, 0, 0.1)] z-[3] h-[56px]"
  >
    <SearchBar />
  </div>
);

export default Toolbar;
