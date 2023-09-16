import { useContext } from 'react';
import { styled } from 'styled-components';

import { ModalContext } from '../../context/modal/modal.tsx';

type ModalHeaderProps = {
  title: string;
  showExitIndicator?: boolean;
};

const Header = styled.h3`
  margin: 0;
`;

const CloseButton = styled.button`
  width: 1em;
  height: 1em;
  padding: 1rem;
  margin: 0 0 0 auto;
  cursor: pointer;
  color: ${({ theme }) => theme.pureBlack};
  border: 0;
  border-radius: 0.25rem;
  opacity: 0.5;

  &:focus {
    box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
    opacity: 1;
  }

  &:hover {
    opacity: 0.75;
  }

  background: transparent
    url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 16 16' fill='%23000'%3e%3cpath d='M.293.293a1 1 0 011.414 0L8 6.586 14.293.293a1 1 0 111.414 1.414L9.414 8l6.293 6.293a1 1 0 01-1.414 1.414L8 9.414l-6.293 6.293a1 1 0 01-1.414-1.414L6.586 8 .293 1.707a1 1 0 010-1.414z'/%3e%3c/svg%3e")
    center/1em auto no-repeat;
`;

const HeaderWrapper = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  border-bottom: 1px solid ${({ theme }) => theme.pattensBlue};
  padding: 1rem 1rem;
`;

export const ModalHeader = ({
  title,
  showExitIndicator = true
}: ModalHeaderProps) => {
  const { setIsModalOpen } = useContext(ModalContext);

  return (
    <HeaderWrapper>
      <Header>{title}</Header>
      {showExitIndicator && (
        <CloseButton onClick={() => setIsModalOpen(false)} />
      )}
    </HeaderWrapper>
  );
};
