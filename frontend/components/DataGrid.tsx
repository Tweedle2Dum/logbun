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

export default function DataGrid() {
  const [fetchedData, setFetchedData] = useState<any>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Set the number of items to display per page

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedData = fetchedData?.slice(startIndex, endIndex);

  useEffect(() => {
    // Function to fetch data
    const fetchData = async () => {
      try {
        // Replace 'http://example.com/api/data' with your actual API endpoint
        const apiUrl = "http://localhost:3000/logs";

        // Making a GET request using fetch
        const response = await fetch(apiUrl);

        // Checking if the response status is OK (200)
        if (!response.ok) {
          throw new Error(`Error: ${response.status} - ${response.statusText}`);
        }

        // Parsing the response JSON
        const data = await response.json();
        console.log(data.data);
        // Setting the fetched data in the state
        setFetchedData(data.data);
      } catch (error) {
        // Handling errors
        console.error("Error fetching data:", error.message);
      }
    };

    // Call the fetchData function when the component mounts
    fetchData();
  }, []); 


  async function fetchFilterData(filters){
        console.log(filters)
        const filteredObject = Object.fromEntries(
            Object.entries(filters).filter(([key, value]) => value !== "")
          );
          //@ts-ignore
          const queryString = new URLSearchParams(filteredObject).toString();
          console.log(queryString)
         try {
          // Replace 'http://example.com/api/data' with your actual API endpoint
          const apiUrl = `http://localhost:3000/logs?${queryString}`;
  
          // Making a GET request using fetch
          const response = await fetch(apiUrl);
  
          // Checking if the response status is OK (200)
          if (!response.ok) {
            throw new Error(`Error: ${response.status} - ${response.statusText}`);
          }
  
          // Parsing the response JSON
          const data = await response.json();
          console.log(data.data);
          // Setting the fetched data in the state
          setFetchedData(data.data);
        } catch (error) {
          // Handling errors
          console.error("Error fetching data:", error.message);
        } 
      
    

  }

  return (
    <>


    <div style={{marginBottom:'20px'}}>
        <FilterComponent onFilterChange={fetchFilterData }/>
    </div>
    <div className="flex justify-center"> <Button onClick={()=>{}}> <Link to={'/live'}>Live logs</Link></Button></div>
      <Table aria-label="Log collection table">
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
          {paginatedData !== undefined &&
            paginatedData.map((log) => (
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
        <Paginator currentPage={currentPage}
          itemsPerPage={itemsPerPage}
          totalItems={fetchedData?.length || 0}
          onPageChange={handlePageChange} />
      </div>
    </>
  );
}
