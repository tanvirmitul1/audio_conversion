import { useState } from "react";
import styled from "styled-components";
import useColors from "../../hooks/useColors";
import {
  MdEdit,
  MdDelete,
  MdOutlinePictureAsPdf,
  MdOutlineTableChart,
} from "react-icons/md";
import swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

// Dummy Data
const dummyData = Array.from({ length: 10 }, (_, index) => ({
  id: index + 1,
  name: `Document ${index + 1}`,
  link: `https://example.com/audio${index + 1}.mp3`,
  date: `2024-11-${index + 10}`,
  translation: `Translation of audio file ${index + 1}`,
}));

const Documents = () => {
  const navigate = useNavigate();
  const colors = useColors();
  const [data, setData] = useState(dummyData);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [searchTerm, setSearchTerm] = useState("");
  const [dateRange, setDateRange] = useState({ start: "", end: "" });

  // Filtered Data
  const filteredData = data.filter((doc) => {
    const matchesSearch = doc.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesDate =
      (!dateRange.start || new Date(doc.date) >= new Date(dateRange.start)) &&
      (!dateRange.end || new Date(doc.date) <= new Date(dateRange.end));
    return matchesSearch && matchesDate;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleEdit = (id) => {
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to edit this document?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, edit it!",
      cancelButtonText: "No, cancel!",
      reverseButtons: true,
    })
      .then((result) => {
        if (result.isConfirmed) {
          navigate(`/documents/${id}`);
        }
      })
      .catch((error) => {
        console.error("Error editing document:", error);
      });
  };

  const handleDelete = (id) => {
    swal
      .fire({
        title: "Are you sure?",
        text: "This action cannot be undone!",
        icon: "warning",
        showCancelButton: true,
        confirmButtonText: "Yes, delete it!",
      })
      .then((result) => {
        if (result.isConfirmed) {
          setData(data.filter((doc) => doc.id !== id));
          swal.fire("Deleted!", "Your document has been deleted.", "success");
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
      <Header colors={colors}>
        <h1>Previous Transcriptions</h1>
        <p>View all your transcribed documents here</p>
      </Header>
      <Filters>
        <input
          type="text"
          placeholder="Search by document name"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div>
          <label>Start Date:</label>
          <input
            type="date"
            value={dateRange.start}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, start: e.target.value }))
            }
          />
        </div>
        <div>
          <label>End Date:</label>
          <input
            type="date"
            value={dateRange.end}
            onChange={(e) =>
              setDateRange((prev) => ({ ...prev, end: e.target.value }))
            }
          />
        </div>
      </Filters>
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
            {paginatedData.map((doc) => (
              <tr key={doc.id}>
                <td>
                  <a href={doc.link} target="_blank" rel="noopener noreferrer">
                    {doc.name}
                  </a>
                </td>
                <td>{doc.date}</td>
                <td>
                  <ActionButton
                    colors={colors}
                    onClick={() => handleEdit(doc.id)}
                  >
                    <MdEdit /> Edit
                  </ActionButton>
                  <ActionButton
                    colors={colors}
                    onClick={() => handleDelete(doc.id)}
                  >
                    <MdDelete /> Delete
                  </ActionButton>
                </td>
                <td>
                  <ActionButton
                    colors={colors}
                    onClick={() => handleExportFile(doc.id, "pdf")}
                  >
                    <MdOutlinePictureAsPdf /> PDF
                  </ActionButton>
                  <ActionButton
                    colors={colors}
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
          <label htmlFor="limit">Limit:</label>
          <select
            id="limit"
            value={itemsPerPage}
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            <option value="5">5</option>
            <option value="10">10</option>
          </select>
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
  margin-bottom: 20px;

  h1 {
    font-size: 24px;
    color: ${({ colors }) => colors?.primary};
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
      text-align: left;
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
  background-color: ${({ colors }) => colors?.primary};
  color: ${({ colors }) => colors?.text};
  transition: 0.3s;

  &:hover {
    background-color: ${({ colors }) => colors?.text};
    color: ${({ colors }) => colors?.primary};
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
  gap: 20px;
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid ${({ colors }) => colors?.border};
  border-radius: 8px;
  background-color: ${({ colors }) => colors?.background};

  input[type="text"] {
    flex: 1;
    padding: 10px;
    font-size: 14px;
    border: 1px solid ${({ colors }) => colors?.border};
    border-radius: 5px;
    background-color: ${({ colors }) => colors?.sidebarBg};
    color: ${({ colors }) => colors?.text};
    outline: none;
    transition: border-color 0.3s;

    &:focus {
      border-color: ${({ colors }) => colors?.primary};
    }
  }

  div {
    display: flex;
    flex-direction: column;
    gap: 5px;

    label {
      font-size: 14px;
      color: ${({ colors }) => colors?.text};
    }

    input[type="date"] {
      padding: 10px;
      font-size: 14px;
      border: 1px solid ${({ colors }) => colors?.border};
      border-radius: 5px;
      background-color: ${({ colors }) => colors?.sidebarBg};
      color: ${({ colors }) => colors?.text};
      outline: none;
      transition: border-color 0.3s;

      &:focus {
        border-color: ${({ colors }) => colors?.primary};
      }
    }
  }
`;
