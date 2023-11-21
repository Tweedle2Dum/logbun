import React from "react";
import { useState } from "react";
import { Input, Button } from "@nextui-org/react";
export default function FilterComponent({ onFilterChange }) {
  const [filters, setFilters] = useState({
    level: "",
    message: "",
    resourceid: "",
    traceid: "",
    spanid: "",
    commit: "",
    parentresourceid: "",
    fromtimestamp: "",
    totimestamp: "",
  });

  const handleInputChange = (field, value) => {
    setFilters({ ...filters, [field]: value });
  };

  const applyFilters = () => {
    onFilterChange(filters);
  };

  const resetFilters = () => {
    setFilters({
      commit: "",
      fromtimestamp: "",
      level: "",
      message: "",
      parentresourceid: "",
      resourceid: "",
      spanid: "",
      totimestamp: "",
      traceid: "",
    });
    onFilterChange({
      commit: "",
      fromtimestamp: "",
      level: "",
      message: "",
      parentresourceid: "",
      resourceid: "",
      spanid: "",
      totimestamp: "",
      traceid: "",
    });
  };
  return (
    <div className="">
      <Input
        label="Level"
        value={filters.level}
        onChange={(e) => handleInputChange("level", e.target.value)}
        size="sm"
      />
      <Input
        label="Message"
        value={filters.message}
        onChange={(e) => handleInputChange("message", e.target.value)}
        size="sm"
      />
      <Input
        label="ResourceId"
        value={filters.resourceid}
        onChange={(e) => handleInputChange("resourceid", e.target.value)}
        size="sm"
      />
      <Input
        label="TraceId"
        value={filters.traceid}
        onChange={(e) => handleInputChange("traceid", e.target.value)}
        size="sm"
      />
      <Input
        label="SpanId"
        value={filters.spanid}
        onChange={(e) => handleInputChange("spanid", e.target.value)}
        size="sm"
      />
      <Input
        label="Commit"
        value={filters.commit}
        onChange={(e) => handleInputChange("commit", e.target.value)}
        size="sm"
      />
      <Input
        label="ParentResourceId"
        value={filters.parentresourceid}
        onChange={(e) => handleInputChange("parentresourceid", e.target.value)}
        size="sm"
      />
      <Input
        type="date"
        label="From"
        value={filters.fromtimestamp}
        onChange={(e) => handleInputChange("fromtimestamp", e.target.value)}
        size="sm"
      />
      <Input
        type="date"
        label="To"
        value={filters.totimestamp}
        onChange={(e) => handleInputChange("totimestamp", e.target.value)}
        size="sm"
      />

      <div className="flex justify-center gap-4" style={{ marginTop: "20px" }}>
        <Button onClick={applyFilters}>Apply filter</Button>
        <Button onClick={resetFilters}>Reset Filters</Button>
      </div>
    </div>
  );
}
