/* eslint-disable no-unused-vars */
import { useState } from "react";
import styled from "styled-components";
import useColors from "../../hooks/useColors";
import { FaSearch } from "react-icons/fa"; // Search icon

const UsersList = () => {
  const colors = useColors();
  const [users, setUsers] = useState([
    { username: "John Doe", email: "john@example.com", role: "Admin" },
    { username: "Jane Smith", email: "jane@example.com", role: "User" },
    { username: "Alice Johnson", email: "alice@example.com", role: "User" },
    { username: "Bob Brown", email: "bob@example.com", role: "Admin" },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 2;

  const filteredUsers = users.filter(
    (user) =>
      (user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (roleFilter ? user.role === roleFilter : true)
  );

  const paginatedUsers = filteredUsers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRoleFilterChange = (e) => {
    setRoleFilter(e.target.value);
    setCurrentPage(1); // Reset to first page when filtering by role
  };

  const handlePageChange = (direction) => {
    setCurrentPage((prev) => {
      if (
        direction === "next" &&
        currentPage * itemsPerPage < filteredUsers.length
      ) {
        return prev + 1;
      } else if (direction === "prev" && currentPage > 1) {
        return prev - 1;
      }
      return prev;
    });
  };

  return (
    <ListContainer colors={colors}>
      <h3>User List</h3>
      <SearchWrapper colors={colors}>
        <div className="search-input">
          <FaSearch size={20} />
          <input
            type="text"
            placeholder="Search Users"
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        <select value={roleFilter} onChange={handleRoleFilterChange}>
          <option value="">All</option>
          <option value="Admin">Admin</option>
          <option value="User">User</option>
        </select>
      </SearchWrapper>

      {filteredUsers.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <>
          <ul>
            {paginatedUsers.map((user, index) => (
              <ListItem key={index} colors={colors}>
                <span>{user.username}</span>
                <span>{user.email}</span>
                <span>{user.role}</span>
              </ListItem>
            ))}
          </ul>
          <PaginationWrapper>
            <button
              onClick={() => handlePageChange("prev")}
              disabled={currentPage === 1}
            >
              Prev
            </button>
            <span>Page {currentPage}</span>
            <button
              onClick={() => handlePageChange("next")}
              disabled={currentPage * itemsPerPage >= filteredUsers.length}
            >
              Next
            </button>
          </PaginationWrapper>
        </>
      )}
    </ListContainer>
  );
};

export default UsersList;

const ListContainer = styled.div`
  flex: 1;
  padding: 20px;
  background-color: ${({ colors }) => colors?.light};
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  h3 {
    color: ${({ colors }) => colors?.primary};
  }

  ul {
    list-style-type: none;
    padding: 0;
  }
`;

const ListItem = styled.li`
  display: flex;
  justify-content: space-between;
  padding: 12px;
  border: 1px solid ${({ colors }) => colors?.border};
  border-radius: 5px;
  margin-bottom: 10px;
  background-color: ${({ colors }) => colors?.background};

  span {
    color: ${({ colors }) => colors?.text};
  }
`;

const SearchWrapper = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;

  .search-input {
    display: flex;
    align-items: center;
    gap: 10px;
    input {
      padding: 5px;
      width: 200px;
      border-radius: 5px;
      border: 1px solid ${({ colors }) => colors?.border};
      background-color: ${({ colors }) => colors?.background};
      color: ${({ colors }) => colors?.text};
    }
  }

  select {
    padding: 5px;
    border-radius: 5px;
    border: 1px solid ${({ colors }) => colors?.border};
    background-color: ${({ colors }) => colors?.background};
    color: ${({ colors }) => colors?.text};
  }
`;

const PaginationWrapper = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 20px;

  button {
    padding: 8px 12px;
    cursor: pointer;
    background-color: ${({ colors }) => colors?.primary};
    border: none;
    border-radius: 5px;
    color: ${({ colors }) => colors?.background};

    &:disabled {
      background-color: ${({ colors }) => colors?.border};
      cursor: not-allowed;
    }
  }
`;
