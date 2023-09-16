import { ReactNode } from 'react';
import { styled } from 'styled-components';

type ModalBodyProps = {
  children: ReactNode;
};

const BodyWrapper = styled.div`
  padding: 1rem;
  overflow-y: auto;
`;

export const ModalBody = ({ children }: ModalBodyProps) => {
  return <BodyWrapper>{children}</BodyWrapper>;
};
