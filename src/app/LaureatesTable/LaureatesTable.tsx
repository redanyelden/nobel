"use client";

import React, { useState, useMemo } from "react";
import "./LaureatesTable.css";
import parse from "html-react-parser";

export interface Laureate {
    id: string;
    firstname: string;
    surname?: string;
    motivation: string;
    share: string;
    year: string;
    category: string;
}

interface LaureatesTableProps {
    laureates: Laureate[];
}

const ITEMS_PER_PAGE = 20;

const LaureatesTable: React.FC<LaureatesTableProps> = ({ laureates }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortField, setSortField] = useState<"name" | "year" | null>(null);
    const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

    const handleSort = (field: "name" | "year") => {
        if (sortField === field) {
            setSortDirection((prev) => (prev === "asc" ? "desc" : "asc"));
        } else {
            setSortField(field);
            setSortDirection("asc");
        }
        setCurrentPage(1);
    };

    const sortedLaureates = useMemo(() => {
        const sorted = [...laureates];

        if (sortField === "name") {
            sorted.sort((a, b) => {
                const nameA = `${a.firstname} ${a.surname || ""}`.toLowerCase();
                const nameB = `${b.firstname} ${b.surname || ""}`.toLowerCase();
                return nameA.localeCompare(nameB);
            });
        } else if (sortField === "year") {
            sorted.sort((a, b) => Number(a.year) - Number(b.year));
        }

        if (sortDirection === "desc") {
            sorted.reverse();
        }

        return sorted;
    }, [laureates, sortField, sortDirection]);

    const totalPages = Math.ceil(sortedLaureates.length / ITEMS_PER_PAGE);
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const currentLaureates = sortedLaureates.slice(startIndex, startIndex + ITEMS_PER_PAGE);

    const goToPage = (page: number) => {
        if (page < 1 || page > totalPages) return;
        setCurrentPage(page);
    };

    return (
        <div className="tableWrapper">
            <table className="table">
                <thead>
                    <tr>
                        <th
                            onClick={() => handleSort("name")}
                            className="sortable"
                        >
                            Name {sortField === "name" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                        </th>
                        <th
                            onClick={() => handleSort("year")}
                            className="sortable"
                        >
                            Year {sortField === "year" ? (sortDirection === "asc" ? "↑" : "↓") : ""}
                        </th>
                        <th>Category</th>
                        <th>Motivation</th>
                        <th>Share</th>
                    </tr>
                </thead>
                <tbody>
                    {currentLaureates.map((l) => (
                        <tr key={`${l.id}-${l.year}`}>
                            <td>{`${l.firstname} ${l.surname || ""}`.trim()}</td>
                            <td>{l.year}</td>
                            <td>{l.category}</td>
                            <td>{parse(l.motivation.replace(/"/g, ""))}</td>
                            <td>{l.share}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <div className="pagination">
                {[...Array(totalPages)].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                        <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={pageNum === currentPage ? "active" : ""}
                        >
                            {pageNum}
                        </button>
                    );
                })}
            </div>
        </div>
    );
};

export default LaureatesTable;
