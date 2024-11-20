/* eslint-disable react/prop-types */

import { FiSearch } from "react-icons/fi";
import { IoIosClose } from "react-icons/io";
import styled from "styled-components";
import useColors from "../../hooks/useColors";

const SearchBar = ({
  searchTerm,
  setSearchTerm,
  label = false,
  placeholder = "Search your docs",
}) => {
  const colors = useColors();
  return (
    <Input colors={colors}>
      <div className="search-container">
        {label && <label>Filter by name</label>}
        <div className="search-input-container">
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <span
            style={{
              cursor: "pointer",
              position: "absolute",
              right: "30px",
            }}
          >
            <IoIosClose size={20} onClick={() => setSearchTerm("")} />
          </span>
          <FiSearch className="search-icon" />
        </div>
      </div>
    </Input>
  );
};

export default SearchBar;

const Input = styled.div`
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
`;
