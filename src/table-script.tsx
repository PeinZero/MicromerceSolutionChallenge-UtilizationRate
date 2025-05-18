import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
import { useMemo } from "react";
import sourceData from "./source-data.json";
import type { SourceDataType, TableDataType } from "./types";


const data = sourceData as unknown as SourceDataType[];

const activeEmployeesData  = data.filter(
  (dataRow) => dataRow?.employees && dataRow?.employees?.statusAggregation?.status === "Aktiv"
);

// employmentStatus type should be a string literal "active" or "inactive" or something.
const activeExternalsData  = data.filter(
  (dataRow) => dataRow?.externals && dataRow?.externals?.employmentStatus?.employmentStatus === "Aktiv"
);

let filteredData: SourceDataType[] = [];
if(activeExternalsData.length > 0){
  filteredData = [...activeEmployeesData, ...activeExternalsData];
}
else{
  filteredData = activeEmployeesData;
}

/**
 * Example of how a tableData object should be structured.
 *
 * Each `row` object has the following properties:
 * @prop {string} person - The full name of the employee.
 * @prop {number} past12Months - The value for the past 12 months.
 * @prop {number} y2d - The year-to-date value.
 * @prop {number} may - The value for May.
 * @prop {number} june - The value for June.
 * @prop {number} july - The value for July.
 * @prop {number} netEarningsPrevMonth - The net earnings for the previous month.
 */
const tableData: TableDataType[] =  filteredData.map((dataRow, index) => {
  
  const data = dataRow.employees || dataRow.externals;

  const person = data?.name;
  const {utilisationRateLastTwelveMonths, utilisationRateYearToDate, lastThreeMonthsIndividually} = data!.workforceUtilisation || {};

  // May Utilisation is not available in the data !!
  const mayUtilisationRate = (lastThreeMonthsIndividually?.find(data => data.month === "May"))?.utilisationRate ?? "0.00";
  const juneUtilisationRate = (lastThreeMonthsIndividually?.find(data => data.month === "June"))?.utilisationRate ?? "0.00";
 const julyUtilisationRate = (lastThreeMonthsIndividually?.find(data => data.month === "July"))?.utilisationRate ?? "0.00";

  const monthlySalary = data?.statusAggregation?.monthlySalary || "N/A";

  const row: TableDataType = {
    person: `${person}`,
    past12Months: `${Number(utilisationRateLastTwelveMonths)*100} %`,
    y2d: `${Number(utilisationRateYearToDate)*100} %`,
    may: `${Number(mayUtilisationRate)*100} %`,
    june: `${Number(juneUtilisationRate)*100} %`,
    july: `${Number(julyUtilisationRate)*100} %`,
    netEarningsPrevMonth: `${monthlySalary} EUR`,
  };

  return row;
});

const Example = () => {
  const columns = useMemo<MRT_ColumnDef<TableDataType>[]>(
    () => [
      {
        accessorKey: "person",
        header: "Person",
      },
      {
        accessorKey: "past12Months",
        header: "Past 12 Months",
      },
      {
        accessorKey: "y2d",
        header: "Y2D",
      },
      {
        accessorKey: "may",
        header: "May",
      },
      {
        accessorKey: "june",
        header: "June",
      },
      {
        accessorKey: "july",
        header: "July",
      },
      {
        accessorKey: "netEarningsPrevMonth",
        header: "Net Earnings Prev Month",
      },
    ],
    []
  );

  const table = useMaterialReactTable({
    columns,
    data: tableData,
  });

  return <MaterialReactTable table={table} />;
};

export default Example;
