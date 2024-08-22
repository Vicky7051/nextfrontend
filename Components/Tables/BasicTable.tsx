import { RiSortAlphabetAsc, RiSortAlphabetDesc } from "react-icons/ri";
import { useTable, useSortBy } from "react-table";

type Pagination = {
    totalRecords: number;
    totalPages: number;
    currentPage: number;
    isLastPage: boolean;
};

type Props = {
    columns: any;
    data: any;
    pagination?: Pagination; // Make pagination optional
    handlePageChange?: (val: number) => void;
    currentId?: string;
};

const BasicTable = ({ columns, data, pagination, handlePageChange, currentId = '' }: Props) => {

    const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } = useTable({
        columns: columns,
        data: data
    }, useSortBy);

    return (
        <>
            <table {...getTableProps()} className="w-full">
                <thead>
                    {
                        headerGroups.map((item) => (
                            <tr {...item.getHeaderGroupProps()}>
                                {
                                    item.headers.map((col: any) => (
                                        <th {...col.getHeaderProps(col.getSortByToggleProps())} className="text-left border p-3">
                                            {col.render('Header')}
                                        </th>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </thead>
                <tbody {...getTableBodyProps()}>
                    {
                        rows.map((row: any) => {
                            prepareRow(row);
                            return (
                                row.original._id !== currentId && (
                                    <tr {...row.getRowProps()}>
                                        {
                                            row.cells.map((cell: any) => (
                                                <td {...cell.getCellProps()} className="p-3 border">
                                                    {cell.render('Cell')}
                                                </td>
                                            ))
                                        }
                                    </tr>
                                )
                            );
                        })
                    }
                </tbody>
            </table>
            {
                pagination && handlePageChange && (
                    <div className="flex mt-3 gap-2 items-center justify-end">
                        <button
                            className="border px-3"
                            onClick={() => handlePageChange(pagination.currentPage - 1)}
                            disabled={pagination.currentPage === 1}
                        >
                            Prev
                        </button>
                        {
                            Array.from({ length: pagination.totalPages }, (_, i) => (
                                <button
                                    key={i + 1}
                                    className={`border px-2 ${pagination.currentPage === i + 1 ? 'bg-sky-900 text-white' : ''}`}
                                    onClick={() => handlePageChange(i + 1)}
                                    style={{padding : "0px 5px"}}
                                >
                                    {i + 1}
                                </button>
                            ))
                        }
                        <button
                            className="border px-3"
                            onClick={() => handlePageChange(pagination.currentPage + 1)}
                            disabled={pagination.isLastPage}
                        >
                            Next
                        </button>
                    </div>
                )
            }
        </>
    );
}

export default BasicTable;
