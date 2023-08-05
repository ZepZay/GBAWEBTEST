import { Button } from '@mui/material';
import { useContext } from 'react';
import { BiError } from 'react-icons/bi';
import { PacmanLoader } from 'react-spinners';
import styled, { useTheme } from 'styled-components';

import { ModalBody } from './modal-body.tsx';
import { ModalFooter } from './modal-footer.tsx';
import { ModalHeader } from './modal-header.tsx';
import { EmulatorContext } from '../../context/emulator/emulator.tsx';
import { ModalContext } from '../../context/modal/modal.tsx';
import { useUpLoadSave } from '../../hooks/use-upload-save.tsx';

type UploadSaveErrorProps = {
  text: string;
  icon?: JSX.Element;
};

type DynamicBodyProps = {
  errorColor: string;
  loadingColor: string;
  respStatus: number | undefined;
  isLoading: boolean;
  hasError: boolean;
};

const CenteredText = styled.p`
  text-align: center;
  margin: 0;
`;

const ErrorWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 5px;
`;

const ErrorText = styled.p`
  margin: 0;
  color: ${({ theme }) => theme.errorRed};
`;

const UploadSaveError = ({ icon, text }: UploadSaveErrorProps) => {
  return (
    <ErrorWrapper>
      {icon}
      <ErrorText>{text}</ErrorText>
    </ErrorWrapper>
  );
};

const DynamicBody = ({
  errorColor,
  loadingColor,
  respStatus,
  isLoading,
  hasError,
}: DynamicBodyProps) => {
  const LoadingIndicator = () => (
    <PacmanLoader color={loadingColor} cssOverride={{ margin: '0 auto' }} />
  );

  let BodyContents = null;
  if (isLoading) {
    BodyContents = LoadingIndicator;
  } else if (hasError) {
    BodyContents = () => (
      <UploadSaveError
        icon={<BiError style={{ color: errorColor }} />}
        text="Save file upload has failed"
      />
    );
  } else if (respStatus === 200) {
    BodyContents = () => (
      <CenteredText>Save file upload was successful!</CenteredText>
    );
  } else {
    BodyContents = () => (
      <CenteredText>
        Are you sure you want to upload your save file to the server?
      </CenteredText>
    );
  }

  return (
    <ModalBody>
      <BodyContents />
    </ModalBody>
  );
};

export const UploadSaveToServer = () => {
  const theme = useTheme();
  const { setIsModalOpen } = useContext(ModalContext);
  const { emulator } = useContext(EmulatorContext);
  const {
    data,
    isLoading,
    error,
    execute: executeUploadSave,
  } = useUpLoadSave();

  return (
    <>
      <ModalHeader title="Send Save to Server" />
      <DynamicBody
        errorColor={theme.errorRed}
        loadingColor={theme.gbaThemeBlue}
        isLoading={isLoading}
        hasError={!!error}
        respStatus={data?.status}
      />
      <ModalFooter>
        <Button
          variant="contained"
          onClick={() => {
            const saveFileBytes = emulator?.getCurrentSave();
            const savePath = emulator?.getCurrentSaveName();
            const saveName = savePath?.split('/')?.pop();

            if (saveFileBytes && saveName) {
              const saveFileBlob = new Blob([saveFileBytes]);
              const saveFile = new File([saveFileBlob], saveName);
              executeUploadSave({ saveFile });
            }
          }}
        >
          Upload
        </Button>
        <Button variant="outlined" onClick={() => setIsModalOpen(false)}>
          Close
        </Button>
      </ModalFooter>
    </>
  );
};
