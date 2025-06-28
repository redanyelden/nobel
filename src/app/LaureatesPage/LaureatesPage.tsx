"use client";

import { useState, useMemo } from "react";
import LaureatesTable, { Laureate } from "../LaureatesTable/LaureatesTable";
import "./LaureatesPage.css";

const prizeCategories = [
  "physics",
  "chemistry",
  "medicine",
  "literature",
  "peace",
  "economics",
];

interface LaureatesPageProps {
  laureates: Laureate[];
}

const LaureatesPage: React.FC<LaureatesPageProps> = ({ laureates }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [startYear, setStartYear] = useState("");
  const [endYear, setEndYear] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(new Set());

  const toggleCategory = (category: string) => {
    setSelectedCategories((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(category)) newSet.delete(category);
      else newSet.add(category);
      return newSet;
    });
  };

  const filteredLaureates = useMemo(() => {
    const term = searchTerm.toLowerCase();

    return laureates.filter((l) => {
      const matchesSearch =
        !searchTerm || // if user hasn't typed anything, match everything
        l.firstname.toLowerCase().includes(term) ||
        (l.surname?.toLowerCase().includes(term) ?? false) ||
        l.category.toLowerCase().includes(term) ||
        l.motivation.toLowerCase().includes(term);

      const yearNum = Number(l.year);
      const start = Number(startYear);
      const end = Number(endYear);
      const matchesStart = !startYear || (!isNaN(start) && yearNum >= start);
      const matchesEnd = !endYear || (!isNaN(end) && yearNum <= end);

      const matchesCategory =
        selectedCategories.size === 0 || selectedCategories.has(l.category);

      return matchesSearch && matchesStart && matchesEnd && matchesCategory;
    });
  }, [searchTerm, startYear, endYear, laureates, selectedCategories]);

  return (
    <div>
      <h1 className="title">Nobel Laureates</h1>

      <input
        type="search"
        placeholder="Search by name, category, motivation..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="inputSearch"
      />

      <div className="yearInputs">
        <input
          type="number"
          placeholder="Start Year"
          value={startYear}
          onChange={(e) => setStartYear(e.target.value)}
          className="yearInput"
        />
        <input
          type="number"
          placeholder="End Year"
          value={endYear}
          onChange={(e) => setEndYear(e.target.value)}
          className="yearInput"
        />
      </div>

      <div className="categoryButtons">
        {prizeCategories.map((category) => (
          <button
            key={category}
            onClick={() => toggleCategory(category)}
            type="button"
            className={`categoryButton ${selectedCategories.has(category) ? "selected" : ""}`}
          >
            {category}
          </button>
        ))}
      </div>

      <LaureatesTable laureates={filteredLaureates} />
    </div>
  );
};

export default LaureatesPage;
