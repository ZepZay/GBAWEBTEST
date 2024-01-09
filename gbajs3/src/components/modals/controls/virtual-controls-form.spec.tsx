import { screen } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { VirtualControlsForm } from './virtual-controls-form.tsx';
import { renderWithContext } from '../../../../test/render-with-context.tsx';
import { GbaDarkTheme } from '../../../context/theme/theme.tsx';
import { virtualControlsLocalStorageKey } from '../../controls/consts.tsx';

describe('<VirtualControlsForm />', () => {
  afterEach(() => {
    localStorage.clear();
  });

  it('renders form with required fields', () => {
    renderWithContext(<VirtualControlsForm id="testId" />);

    expect(
      screen.getByRole('form', { name: 'Virtual Controls Form' })
    ).toBeInTheDocument();
    expect(screen.getByLabelText('Virtual D-pad/Buttons')).toBeInTheDocument();
    expect(screen.getByLabelText('Save State')).toBeInTheDocument();
    expect(screen.getByLabelText('Load State')).toBeInTheDocument();
    expect(screen.getByLabelText('Quick Reload')).toBeInTheDocument();
    expect(screen.getByLabelText('Send save to server')).toBeInTheDocument();
  });

  it('renders form with provided id', () => {
    renderWithContext(<VirtualControlsForm id="testId" />);

    expect(
      screen.getByRole('form', { name: 'Virtual Controls Form' })
    ).toHaveAttribute('id', 'testId');
  });

  it('submits default values with external button', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    renderWithContext(
      <>
        <VirtualControlsForm id="testId" />
        <button form="testId" type="submit">
          submit
        </button>
      </>
    );

    const submitButton = screen.getByRole('button', { name: 'submit' });

    expect(submitButton).toBeInTheDocument();

    await userEvent.click(submitButton);

    expect(setItemSpy).toHaveBeenCalledWith(
      virtualControlsLocalStorageKey,
      '{"DPadAndButtons":true,"SaveState":false,"LoadState":false,"QuickReload":false,"SendSaveToServer":false}'
    );
  });

  it('form values can be changed and properly persisted', async () => {
    const setItemSpy = vi.spyOn(Storage.prototype, 'setItem');

    renderWithContext(
      <>
        <VirtualControlsForm id="testId" />
        <button form="testId" type="submit">
          submit
        </button>
      </>
    );

    const submitButton = screen.getByRole('button', { name: 'submit' });

    expect(submitButton).toBeInTheDocument();

    const checkBoxes = screen.getAllByRole('checkbox');

    expect(checkBoxes.length).toEqual(5);

    checkBoxes.forEach(async (checkbox) => {
      await userEvent.click(checkbox);
    });

    await userEvent.click(submitButton);

    expect(setItemSpy).toHaveBeenCalledWith(
      virtualControlsLocalStorageKey,
      '{"DPadAndButtons":false,"SaveState":true,"LoadState":true,"QuickReload":true,"SendSaveToServer":true}'
    );
  });

  it('DPadAndButtons is true by default on mobile resolutions', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query !== GbaDarkTheme.isLargerThanPhone,
      media: '',
      addListener: () => {},
      removeListener: () => {},
      onchange: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true
    }));

    renderWithContext(<VirtualControlsForm id="testId" />);

    const dpadAndButtonsCheckbox = screen.getByLabelText(
      'Virtual D-pad/Buttons'
    );

    expect(dpadAndButtonsCheckbox).toBeInTheDocument();
    expect(dpadAndButtonsCheckbox).toBeChecked();
  });

  it('DPadAndButtons is false by default on desktop resolutions', () => {
    vi.spyOn(window, 'matchMedia').mockImplementation((query) => ({
      matches: query === GbaDarkTheme.isLargerThanPhone,
      media: '',
      addListener: () => {},
      removeListener: () => {},
      onchange: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => true
    }));

    renderWithContext(<VirtualControlsForm id="testId" />);

    const dpadAndButtonsCheckbox = screen.getByLabelText(
      'Virtual D-pad/Buttons'
    );

    expect(dpadAndButtonsCheckbox).toBeInTheDocument();
    expect(dpadAndButtonsCheckbox).not.toBeChecked();
  });
});
