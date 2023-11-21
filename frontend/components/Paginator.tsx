import React from "react";
import { Pagination } from "@nextui-org/react";
interface PaginatorProps {
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  onPageChange: (newPage: number) => void;
}

export default function Paginator({
  totalItems,
  itemsPerPage,
  currentPage,
  onPageChange,
}: PaginatorProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handleChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages && newPage !== currentPage) {
        console.log(newPage)
      onPageChange(newPage);
    }
  };
  return (
    <>
      <Pagination  total={totalPages} initialPage={1}  onChange={handleChange}/>
    </>
  );
}
