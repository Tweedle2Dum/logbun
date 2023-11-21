import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
  Spacer,
  Button,
} from "@nextui-org/react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import Paginator from "./Paginator";
import FilterComponent from "./Filter";

export default function LiveDataGrid() {
  const [logData, setLogData] = useState<any[]>([]); // State variable for the latest log data
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [queryString, setQueryString] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [filters, setFilters] = useState();
  const itemsPerPage = 10; // Set the number of items to display per page

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = fetchedData?.slice(startIndex, endIndex);

  function displayLogData(logData) {
    return (
      <>
        <TableRow key={logData._id}>
          <TableCell>{logData._id}</TableCell>
          <TableCell>{logData.level}</TableCell>
          <TableCell>{logData.message}</TableCell>
          <TableCell>{logData.resourceId}</TableCell>
          <TableCell>{logData.spanId}</TableCell>
          <TableCell>{logData.commit}</TableCell>

          <TableCell>{logData.timestamp}</TableCell>
          <TableCell>{logData.traceId}</TableCell>
        </TableRow>
      </>
    );
  }

  useEffect(() => {
    let url;
    console.log(queryString)
    if (queryString === "") {
      url = `http://localhost:3000/logs/live`;
    } else {
      url = `http://localhost:3000/logs/live${queryString}`;
    }

    const logSource = new EventSource(url);
    logSource.onmessage = function (event) {
      const newLogData = JSON.parse(event.data);
      //@ts-ignore
      setLogData((prevLogData) => [...prevLogData, newLogData]);
      console.log(logData);
    };
    return () => {
      logSource.close();
    };
  }, [filters]);

  async function fetchFilterData(filters) {
    console.log(filters);
    const filteredObject = Object.fromEntries(
      Object.entries(filters).filter(([key, value]) => value !== "")
    );

    //@ts-ignore
    setQueryString(new URLSearchParams(filteredObject).toString());
    console.log(queryString);
    //@ts-ignore
    setFilters(filteredObject);
  }

  return (
    <>
      <div style={{ marginBottom: "20px" }}>
        <FilterComponent onFilterChange={fetchFilterData} />
      </div>
      <Table aria-label="Log collection table" style={{ overflowY: "scroll" }}>
        <TableHeader>
          <TableColumn>ID</TableColumn>
          <TableColumn>Level</TableColumn>
          <TableColumn>Message</TableColumn>
          <TableColumn>Resource ID</TableColumn>
          <TableColumn>Span ID</TableColumn>
          <TableColumn>Commit</TableColumn>

          <TableColumn>Timestamp</TableColumn>
          <TableColumn>Trace ID</TableColumn>
        </TableHeader>
        <TableBody>
          {/* Display all log data using mapping */}
          {logData &&
            logData.map((log) => (
              <TableRow key={log._id}>
                <TableCell>{log._id}</TableCell>
                <TableCell>{log.level}</TableCell>
                <TableCell>{log.message}</TableCell>
                <TableCell>{log.resourceId}</TableCell>
                <TableCell>{log.spanId}</TableCell>
                <TableCell>{log.commit}</TableCell>

                <TableCell>{log.timestamp}</TableCell>
                <TableCell>{log.traceId}</TableCell>
              </TableRow>
            ))}
        </TableBody>
      </Table>
      <Spacer />
      <Spacer />

      <Spacer />

      <div className=" flex justify-center items-center">
        {" "}
        <Paginator
          currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={fetchedData?.length || 0}
          onPageChange={handlePageChange}
        />
      </div>
    </>
  );
}
