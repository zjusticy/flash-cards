const searchBar = () => (
  <div className="h-full">
    <div className="pt-[10px] px-[24px]">
      <div className="h-[2px] my-0 mx-[6px] bg-gray-200" />
      <div
        className="my-0 mx-[4px] bg-white h-[2px] \
      border-x-[2px] border-solid border-gray-200"
      />
      <div
        className="my-0 mx-[2px] bg-white h-[2px] \
      border-x-[2px] border-solid border-gray-200"
      />
      <div className="w-[224px] flex border-x-[2px] border-solid border-gray-200 z-[3]">
        <input
          type="text"
          className="w-full h-[24px] box-border pl-[12px] border-none leading-[24px] \
          outline-none text-[16px] text-gray-600"
          placeholder="Search"
        />
        <button
          className="border-none h-[24px] w-[36px] pr-[12px] bg-white"
          type="button"
        >
          <div className="m-auto h-[16px] w-[16px]">
            <span className="inline-block h-[16px] w-[16px] leading-[16px]">
              <svg className="fill-[#9fa9ba] " viewBox="0 0 16 16">
                <path
                  fill-rule="evenodd"
                  d="M15.718,15.718 C15.327,16.108 14.694,16.108 14.303,15.718 L11.154,12.568 C8.412,14.618 4.524,14.424 2.033,11.932 C-0.701,9.198 -0.701,4.766 2.033,2.033 C4.766,-0.701 9.198,-0.701 11.932,2.033 C14.424,4.524 14.618,8.412 12.568,11.154 L15.718,14.303 C16.108,14.694 16.108,15.327 15.718,15.718 ZM10.518,3.447 C8.565,1.494 5.399,1.494 3.447,3.447 C1.494,5.399 1.494,8.565 3.447,10.518 C5.399,12.470 8.565,12.470 10.518,10.518 C12.470,8.565 12.470,5.399 10.518,3.447 Z"
                />
              </svg>
            </span>
          </div>
        </button>
      </div>
      <div
        className="my-0 mx-[2px] bg-white h-[2px] \
        border-x-[2px] border-solid border-gray-200"
      />
      <div
        className="my-0 mx-[4px] bg-white h-[2px] \
        border-x-[2px] border-solid border-gray-200"
      />
      <div className="h-[2px] my-0 mx-[6px] bg-gray-200" />
    </div>
  </div>
);

export default searchBar;
