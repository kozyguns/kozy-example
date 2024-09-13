import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  getFilteredRowModel,
  getSortedRowModel,
} from "@tanstack/react-table"

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { DataTablePagination } from "./data-table-pagination"
import { EmployeeTableToolbar } from "./employee-table-toolbar"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import classNames from "classnames"
import styles from "./table.module.css"

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[]
  data: TData[]
}

export function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  // console.log("Data passed to DataTable:", data); // Add this line
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
  })

  return (
    <div>
      <EmployeeTableToolbar table={table} />
      <div className="rounded-md border">
      <div className="flex-1 overflow-hidden max-h-full rounded-md border w-full sm:w-full md:w-full lg:min-w-8xl lg:max-w-8xl">
        <div className="overflow-hidden">
          
            <Table className="w-full overflow-hidden">
            <ScrollArea
            className={classNames(
              styles.noScroll,
              "h-[calc(100vh-400px)] w-[calc(100vw-10px)] overflow-auto"
            )}
          >
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody className="overflow-hidden">
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="overflow-hidden">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
          <ScrollBar orientation="horizontal" />
        <ScrollBar orientation="vertical" />
        </ScrollArea>
        </Table>
        
        </div>
        </div>
      </div>
      <DataTablePagination table={table} />
    </div>
  )
}