import styled from "styled-components";

/* Styled Components */
export const Container = styled.div`
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: ${({ colors }) => colors?.background};
  color: ${({ colors }) => colors?.text};
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;

  .doc-info {
    display: flex;
    align-items: center;
    gap: 10px;

    h2 {
      margin: 0;
      font-size: 20px;
    }

    p {
      margin: 0;
      color: ${({ colors }) => colors?.secondaryText};
      font-size: 14px;
    }
  }

  .search-bar input {
    padding: 8px;
    border: 1px solid ${({ colors }) => colors?.border};
    border-radius: 5px;
    width: 300px;
    background-color: ${({ colors }) => colors?.light};
  }
`;

export const Content = styled.div`
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
`;

export const TranslationSection = styled.div`
  flex: 3;
  padding: 10px;
  border: 1px solid ${({ colors }) => colors?.border};
  border-radius: 5px;
  background-color: ${({ colors }) => colors?.sidebarBg};
`;

export const Speaker = styled.div`
  font-weight: bold;
  color: ${({ colors }) => colors?.secondaryText};
  margin-top: 15px;
`;

export const Chunk = styled.div`
  margin: 10px 0;
  padding: 10px;
  border-radius: 5px;
  display: flex;
  justify-content: flex-start;
`;

export const Time = styled.span`
  display: flex;
  font-size: 12px;
  color: ${({ colors }) => colors?.secondaryText};
`;

export const TextInput = styled.input`
  border: none;
  resize: none;

  background: transparent;
  color: ${({ colors }) => colors?.text};
  outline: none;
  cursor: pointer;
`;

export const ActionsCard = styled.div`
  flex: 1;
  padding: 30px;
  border: 1px solid ${({ colors }) => colors?.border};
  border-radius: 5px;
  background-color: ${({ colors }) => colors?.sidebarBg};
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 10px;

  .pdf-container {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .checkbox-container {
    margin-bottom: 10px;
  }

  .actions {
    display: flex;

    gap: 10px;
  }

  .actions button {
    width: 100%;
    padding: 10px;
    border: none;
    border-radius: 5px;
    font-size: 16px;
    cursor: pointer;
    margin-top: 10px;
  }

  .discard {
    background-color: ${({ colors }) => colors?.danger};
    color: white;
  }

  .save {
    background-color: ${({ colors }) => colors?.success};
    color: white;
  }
`;

export const AudioPlayer = styled.div`
  margin-top: 20px;
  width: 50%;
`;

export const SingleText = styled.div`
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
`;
