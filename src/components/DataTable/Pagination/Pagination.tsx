import clsx from "clsx";
import { UsePaginationInstanceProps, UsePaginationState } from "react-table";

type PaginationProps = React.HTMLProps<HTMLDivElement> &
  UsePaginationInstanceProps<{}> & { state: UsePaginationState<{}> };

export const Pagination = ({
  canPreviousPage,
  canNextPage,
  pageOptions,
  pageCount,
  gotoPage,
  nextPage,
  previousPage,
  setPageSize,
  state: { pageIndex, pageSize },
  className
}: PaginationProps) => {
  return (
    <nav className={clsx("isolate rounded-md", className)}>
      <div className="inline-block pr-2">
        <div className="text-gray-700">
          <div className="inline-block pr-2 font-bold">
            Page {pageIndex + 1} of {pageOptions.length}
          </div>
          <div className="mt-1 inline-block rounded-md shadow-sm pr-2">
            <span className="px-4 py-2 inline-block items-center rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500">
              Go to page
            </span>
            <input
              type="number"
              className="rounded-none rounded-r-md border-gray-300 px-4 py-2 w-16"
              defaultValue={pageIndex + 1}
              onChange={(e) => {
                const page = e.target.value ? Number(e.target.value) - 1 : 0;
                gotoPage(page);
              }}
            />
          </div>
          <select
            className="rounded-md w-20 border-gray-300 py-2 pl-3 pr-10 shadow-sm inline-block"
            value={pageSize}
            onChange={(e) => {
              setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 30, 40, 50].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                {pageSize}
              </option>
            ))}
          </select>
        </div>
      </div>
      <div className="inline-block -space-x-px">
        <button
          className="relative inline-block rounded-l-md border border-gray-300 bg-white px-2 py-2 text-gray-500 hover:bg-gray-50 focus:z-20"
          onClick={() => gotoPage(0)}
          disabled={!canPreviousPage}
        >
          {"<<"}
        </button>
        <button
          className="relative inline-block border border-gray-300 bg-white px-2 py-2 text-gray-500 hover:bg-gray-50 focus:z-20"
          onClick={() => previousPage()}
          disabled={!canPreviousPage}
        >
          Previous
        </button>
        <button
          className="relative inline-block border border-gray-300 bg-white px-2 py-2 text-gray-500 hover:bg-gray-50 focus:z-20"
          onClick={() => nextPage()}
          disabled={!canNextPage}
        >
          Next
        </button>
        <button
          className="relative inline-block rounded-r-md border border-gray-300 bg-white px-4 py-2 text-gray-500 hover:bg-gray-50 focus:z-20"
          onClick={() => gotoPage(pageCount - 1)}
          disabled={!canNextPage}
        >
          {">>"}
        </button>
      </div>
    </nav>
  );
};