import { useMediaQuery } from '@mui/material';
import { useLocalStorage } from '@uidotdev/usehooks';
import { useForm, type SubmitHandler } from 'react-hook-form';
import { styled, useTheme } from 'styled-components';

import { virtualControlsLocalStorageKey } from '../../controls/consts.tsx';

type VirtualControlsFormProps = {
  id: string;
  onAfterSubmit: () => void;
};

export type AreVirtualControlsEnabledProps = {
  OpadAndButtons: boolean;
  SaveState: boolean;
  LoadState: boolean;
  QuickReload: boolean;
  SendSaveToServer: boolean;
  NotificationsEnabled: boolean;
};

type ControlsInputProps = AreVirtualControlsEnabledProps;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
`;

export const ControlProfilesForm = ({
  id,
  onAfterSubmit
}: VirtualControlsFormProps) => {
  const [areVirtualControlsEnabled, setAreVirtualControlsEnabled] =
    useLocalStorage<AreVirtualControlsEnabledProps | undefined>(
      virtualControlsLocalStorageKey
    );
  const theme = useTheme();
  const isLargerThanPhone = useMediaQuery(theme.isLargerThanPhone);

  const shouldShowVirtualControl = (virtualControlEnabled?: boolean) => {
    return (
      (virtualControlEnabled === undefined && !isLargerThanPhone) ||
      !!virtualControlEnabled
    );
  };

  const { /*register,*/ handleSubmit /*, watch */ } =
    useForm<ControlsInputProps>({
      values: areVirtualControlsEnabled ?? {
        OpadAndButtons: shouldShowVirtualControl(undefined),
        SaveState: shouldShowVirtualControl(undefined),
        LoadState: shouldShowVirtualControl(undefined),
        QuickReload: shouldShowVirtualControl(undefined),
        SendSaveToServer: shouldShowVirtualControl(undefined),
        NotificationsEnabled: true
      },
      resetOptions: {
        keepDirtyValues: true
      }
    });

  const onSubmit: SubmitHandler<ControlsInputProps> = async (formData) => {
    setAreVirtualControlsEnabled((prevState) => ({
      ...prevState,
      ...formData
    }));
    onAfterSubmit();
  };

  return (
    <StyledForm
      aria-label="Control Profiles Form"
      id={id}
      onSubmit={handleSubmit(onSubmit)}
    ></StyledForm>
  );
};
