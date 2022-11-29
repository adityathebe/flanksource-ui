import Convert from "ansi-to-html";
import clsx from "clsx";
import DOMPurify from "dompurify";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ColumnDef,
  useReactTable,
  getCoreRowModel,
  flexRender,
  ColumnSizingState
} from "@tanstack/react-table";
import { EvidenceType } from "../../../api/services/evidence";
import LogItem from "../../../types/Logs";
import { AttachEvidenceDialog } from "../../AttachEvidenceDialog";
import { Loading } from "../../Loading";
import { LogsTableLabelsCell, LogsTableTimestampCell } from "./LogsTableCells";
import useDebouncedValue from "../../../hooks/useDebounce";

const convert = new Convert();

type LogsTableProps = {
  logs: LogItem[];
  actions?: Record<string, any>;
  variant?: "comfortable" | "compact";
  viewOnly?: boolean;
  isLoading?: boolean;
  areQueryParamsEmpty?: boolean;
  componentId?: string;
};

export function LogsTable({
  logs,
  actions = [],
  variant,
  viewOnly,
  isLoading = false,
  areQueryParamsEmpty = false,
  componentId
}: LogsTableProps) {
  const [attachAsAsset, setAttachAsAsset] = useState(false);
  const [lines, setLines] = useState<LogItem[]>([]);

  const [rowSelection, setRowSelection] = useState({});

  const [columnSizing, setColumnSizing] = useState<ColumnSizingState>(() => {
    const savedColumnSizes = localStorage.getItem("logsTableColumnSizes");
    if (savedColumnSizes != null && savedColumnSizes !== "") {
      return JSON.parse(savedColumnSizes);
    }
    return {};
  });

  // debounce the column sizing state so it doesn't update too often
  const debouncedColumnSizing = useDebouncedValue(columnSizing, 500);

  // save the column sizing state to local storage, after it has been debounced
  useEffect(() => {
    if (debouncedColumnSizing != null) {
      localStorage.setItem(
        "logsTableColumnSizes",
        JSON.stringify(debouncedColumnSizing)
      );
    }
  }, [debouncedColumnSizing]);

  const columns = useMemo(
    () =>
      [
        {
          id: "selection",
          header: "Time",
          accessor: "timestamp",
          enableResizing: false,
          size: 5,
          maxSize: 6,
          cell: ({ cell }) => (
            <LogsTableTimestampCell
              cell={cell}
              variant={variant}
              viewOnly={viewOnly}
            />
          )
        },
        {
          header: (props) => {
            const { table } = props;
            const selectedFlatRows = table.getSelectedRowModel().flatRows;
            const { rowSelection } = table.getState();
            const hasSelectedRows = Object.keys(rowSelection).length !== 0;
            return (
              <div className="flex justify-between">
                <span className="align-middle my-auto">Message</span>
                {!viewOnly && (
                  <div className="flex justify-end -m-2 flex-wrap">
                    <div className="p-2">
                      <button
                        type="button"
                        disabled={!hasSelectedRows}
                        onClick={() => {
                          setLines(selectedFlatRows.map((d) => d.original));
                          setAttachAsAsset(true);
                        }}
                        className={clsx(
                          hasSelectedRows ? "btn-primary" : "hidden"
                        )}
                      >
                        Attach as Evidence
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          },
          accessor: "message",
          id: "message",
          size: 300,
          cell: ({ cell, row }) => {
            return (
              <div
                className="break-all"
                // eslint-disable-next-line react/no-danger
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(
                    convert.toHtml(row.original.message)
                  )
                }}
              />
            );
          }
        },
        {
          size: 100,
          id: "labels",
          header: "Labels",
          cell: ({ cell }) => <LogsTableLabelsCell cell={cell} />
        }
      ] as Array<ColumnDef<LogItem>>,
    [variant, viewOnly]
  );

  const table = useReactTable({
    columns,
    data: logs,
    state: {
      rowSelection,
      columnSizing
    },
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    enableColumnResizing: true,
    columnResizeMode: "onChange",
    debugTable: true,
    debugHeaders: true,
    debugColumns: true,
    onColumnSizingChange: setColumnSizing
  });

  // in order to ensure column resizing doesn't affect the selection column, we
  // need to rebase the new size to the base size of 400, total size of all
  // columns, including the selection column. This will ensure that the
  // selection remains the same size as it is rendered, and the other columns
  // sizes are rebased to relation to 100% of the width.
  const determineColumnWidth = useCallback(
    (column: string) => {
      const columnSize = table.getColumn(column).getSize();
      if (column === "selection") {
        return columnSize;
      }
      console.log(columnSize, column, table.getTotalSize());
      return (columnSize / (table.getTotalSize() - 6)) * 400;
    },
    [table]
  );

  return (
    <div className="flex flex-col flex-1 overflow-y-auto">
      <div className="block pb-6 w-full">
        <AttachEvidenceDialog
          isOpen={attachAsAsset}
          onClose={() => setAttachAsAsset(false)}
          evidence={{ lines }}
          type={EvidenceType.Log}
          component_id={componentId}
          callback={(success: boolean) => {
            if (success) {
              setLines([]);
            }
          }}
        />
        <table
          className={clsx(
            "w-full table-fixed",
            variant === "comfortable" ? "comfortable-table" : "compact-table"
          )}
        >
          <thead className="bg-white sticky top-0 font-bold">
            {table.getHeaderGroups().map((headerGroup) => {
              return (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      style={{
                        width: determineColumnWidth(header.id)
                      }}
                      className={`relative group overflow-hidden`}
                    >
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}
                      {/* Use column.getResizerProps to hook up the events correctly */}
                      {header.column.getCanResize() && (
                        <div
                          onMouseDown={header.getResizeHandler()}
                          onTouchStart={header.getResizeHandler()}
                          className={`absolute right-0 top-0 h-full w-1 cursor-col-resize touch-none select-none bg-gray-400 opacity-100 ${
                            header.column.getIsResizing()
                              ? "bg-black opacity-100"
                              : ""
                          }`}
                        />
                      )}
                    </th>
                  ))}
                </tr>
              );
            })}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id}>
                  {row.getVisibleCells().map((cell) => (
                    <td
                      key={cell.id}
                      style={{
                        width: cell.column.getSize()
                      }}
                      className="overflow-hidden"
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </td>
                  ))}
                </tr>
              );
            })}
            {table.getRowModel().rows.length === 0 && (
              <tr>
                <td className="text-center" colSpan={columns.length}>
                  {areQueryParamsEmpty ? (
                    <span>Please select a component to view the logs</span>
                  ) : isLoading ? (
                    <Loading text="Loading logs ..." />
                  ) : (
                    <span>There are no logs matching the search query</span>
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}