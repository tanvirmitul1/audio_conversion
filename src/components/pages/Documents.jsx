import { useState } from "react";
import styled from "styled-components";
import useColors from "../../hooks/useColors";
import {
  MdEdit,
  MdDelete,
  MdOutlinePictureAsPdf,
  MdOutlineTableChart,
} from "react-icons/md";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import JqueryDateRangePicker from "../reusable/JqueryDateRangePicker";
import { Flex } from "../../ui/GlobalStyle";

import SearchBar from "../reusable/SearchBar";
import { dummyData } from "../../utils/dummydata";
// Dummy Data

const Documents = () => {
  const navigate = useNavigate();
  const colors = useColors();
  const [data, setData] = useState(dummyData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const totalPages = Math.ceil(data.length / itemsPerPage);

  const filteredData = data.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const withinDateRange =
      (!startDate || new Date(doc.date) >= new Date(startDate)) &&
      (!endDate || new Date(doc.date) <= new Date(endDate));
    return matchesSearch && withinDateRange;
  });

  const handleEdit = (id) => {
    Swal.fire({
      title: "Edit Document",
      text: "Do you want to edit this document?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, edit it!",
      cancelButtonText: "Cancel",
    }).then((result) => {
      if (result.isConfirmed) navigate(`/documents/${id}`);
    });
  };

  const handleDelete = (id) => {
    Swal.fire({
      title: "Delete Document",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        setData(data.filter((doc) => doc.id !== id));
        Swal.fire("Deleted!", "The document has been deleted.", "success");
      }
    });
  };

  const handleExportFile = (id, type) => {
    const doc = data.find((d) => d.id === id);
    if (!doc) return;

    const fileContent = `
      Document Name: ${doc.name}
      Date: ${doc.date}
      Translation: ${doc.translation}
    `;

    const blob =
      type === "pdf"
        ? new Blob([fileContent], { type: "application/pdf" })
        : new Blob([fileContent], { type: "application/msword" });

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `${doc.name}.${type}`;
    link.click();
  };

  return (
    <Container colors={colors}>
      <Flex justifyContent={"space-between"}>
        <Header colors={colors}>
          <h1>Previous Transcriptions</h1>
          <p>View all your transcribed documents here</p>
        </Header>
        <Filters colors={colors}>
          <div className="date-filter">
            <label>Filter by date</label>
            <div className="date-range-container">
              <JqueryDateRangePicker
                startDate={startDate}
                setStartDate={setStartDate}
                endDate={endDate}
                setEndDate={setEndDate}
              />
            </div>
          </div>
          <SearchBar
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            label={true}
          />
        </Filters>
      </Flex>
      <TableWrapper colors={colors}>
        <table>
          <thead>
            <tr>
              <th>Document Title</th>
              <th>Date</th>
              <th>Actions</th>
              <th>Export</th>
            </tr>
          </thead>
          <tbody>
            {filteredData
              .slice(
                (currentPage - 1) * itemsPerPage,
                currentPage * itemsPerPage
              )
              .map((doc) => (
                <tr key={doc.id}>
                  <td>
                    <a
                      href={doc.link}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {doc.name}
                    </a>
                  </td>
                  <td>{doc.date}</td>
                  <td>
                    <ActionButton
                      colors={colors}
                      color={colors?.primary}
                      onClick={() => handleEdit(doc.id)}
                    >
                      <MdEdit /> Edit
                    </ActionButton>
                    <ActionButton
                      colors={colors}
                      color={colors?.danger}
                      onClick={() => handleDelete(doc.id)}
                    >
                      <MdDelete /> Delete
                    </ActionButton>
                  </td>
                  <td>
                    <ActionButton
                      colors={colors}
                      color={colors?.success}
                      onClick={() => handleExportFile(doc.id, "pdf")}
                    >
                      <MdOutlinePictureAsPdf /> PDF
                    </ActionButton>
                    <ActionButton
                      colors={colors}
                      color={colors?.success}
                      onClick={() => handleExportFile(doc.id, "doc")}
                    >
                      <MdOutlineTableChart /> Word
                    </ActionButton>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </TableWrapper>
      <Pagination colors={colors}>
        <LimitSelector>
          <span>show</span>
          <select
            id="limit"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
            <option value="10">20</option>
            <option value="10">30</option>
          </select>
          <label>row</label>
        </LimitSelector>
        <PageNavigation>
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            &lt; Prev
          </button>
          <span>
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={() =>
              setCurrentPage((prev) => Math.min(prev + 1, totalPages))
            }
            disabled={currentPage === totalPages}
          >
            Next &gt;
          </button>
        </PageNavigation>
      </Pagination>
    </Container>
  );
};

export default Documents;

export const Container = styled.div`
  padding: 20px;
  background-color: ${({ colors }) => colors?.background};
  color: ${({ colors }) => colors?.text};
`;

export const Header = styled.div`
  text-align: center;

  h1 {
    font-size: 24px;
    font-weight: bold;
    color: ${({ colors }) => colors?.text};
  }

  p {
    font-size: 16px;
    color: ${({ colors }) => colors?.text};
  }
`;

export const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 20px;

  table {
    width: 100%;
    border-collapse: collapse;
    color: ${({ colors }) => colors?.text};

    th,
    td {
      text-align: center;
      padding: 10px;
      border: 1px solid ${({ colors }) => colors?.border};
    }

    th {
      background-color: ${({ colors }) => colors?.sidebarBg};
    }

    tr:nth-child(even) {
      background-color: ${({ colors }) => colors?.shadow};
    }
  }
`;

export const ActionButton = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 5px 10px;
  margin: 0 5px;
  border: none;
  border-radius: 5px;
  cursor: pointer;
  background-color: ${({ color }) => color};
  color: ${({ colors }) => colors?.buttonColor};
  transition: 0.3s;

  &:hover {
    background-color: ${({ colors }) => colors?.text};
  }
`;

export const Pagination = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;

  button {
    background-color: ${({ colors }) => colors?.primary};
    color: ${({ colors }) => colors?.text};
    border: none;
    padding: 5px 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background-color: ${({ colors }) => colors?.text};
      color: ${({ colors }) => colors?.primary};
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
  }

  span {
    color: ${({ colors }) => colors?.text};
  }
`;

export const LimitSelector = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  select {
    padding: 5px;
    border: 1px solid ${({ colors }) => colors?.border};
    border-radius: 5px;
    background-color: ${({ colors }) => colors?.sidebarBg};
    color: ${({ colors }) => colors?.text};
  }

  label {
    color: ${({ colors }) => colors?.text};
  }
`;

export const PageNavigation = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`;
const Filters = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 20px;
  margin-bottom: 20px;
  padding: 15px;
  border-radius: 10px;
  background-color: ${({ colors }) => colors?.background};

  .search-container {
    flex: 1;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: 5px;
    padding: 8px 12px;
    transition: border-color 0.3s;

    &:focus-within {
      border-color: ${({ colors }) => colors?.primary};
    }

    input {
      flex: 1;
      padding: 8px 12px;
      font-size: 14px;
      border: none;
      outline: none;
      background: transparent;
      color: ${({ colors }) => colors?.text};
      border: 1px solid ${({ colors }) => colors?.border};
      border-radius: 50px;
      background-color: ${({ colors }) => colors?.sidebarBg};

      &::placeholder {
        color: ${({ colors }) => colors?.placeholder};
      }
    }
    .search-input-container {
      position: relative;
      display: flex;
      align-items: center;
      gap: 5px;
    }

    .search-icon {
      font-size: 18px;
      color: ${({ colors }) => colors?.icon};
    }
  }

  .date-filter {
    display: flex;
    flex-direction: column;
    gap: 5px;
    label {
      color: ${({ colors }) => colors?.text};
    }

    .date-range-container {
      display: flex;
      align-items: center;
      padding: 8px 12px;
      border: 1px solid ${({ colors }) => colors?.border};
      border-radius: 8px;
      background-color: ${({ colors }) => colors?.sidebarBg};
      transition: border-color 0.3s;

      &:focus-within {
        border-color: ${({ colors }) => colors?.primary};
      }

      input {
        flex: 1;
        padding: 8px;
        font-size: 14px;
        border: none;
        outline: none;
        background: transparent;
        color: ${({ colors }) => colors?.text};
      }
    }
  }
`;
