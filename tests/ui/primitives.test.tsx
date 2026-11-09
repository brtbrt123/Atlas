import React from 'react';
import { render, screen, userEvent } from '@testing-library/react-native';
import { Button, Feedback, Section, Type } from '../../src/components/ui';
import { componentVariants, typography } from '../../src/theme/tokens';

describe('ATLAS primitives', () => {
  test('an enabled action runs once when pressed', async () => {
    const onPress = jest.fn();
    await render(<Button label="Complete set" onPress={onPress} />);
    await userEvent.press(screen.getByRole('button', { name: 'Complete set' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test.each([{ disabled: true, busy: false }, { disabled: false, busy: true }])('unavailable action %j cannot run', async props => {
    const onPress = jest.fn();
    await render(<Button label="Finish workout" onPress={onPress} {...props} />);
    const action = screen.getByRole('button', { name: 'Finish workout' });
    expect(action).toBeDisabled();
    if (props.busy) expect(action).toBeBusy();
    await userEvent.press(action);
    expect(onPress).not.toHaveBeenCalled();
  });

  test('danger variant uses its semantic colors', async () => {
    await render(<Button label="Discard workout" variant="danger" onPress={jest.fn()} />);
    expect(screen.getByRole('button', { name: 'Discard workout' })).toHaveStyle({ backgroundColor: componentVariants.button.danger.background, borderColor: componentVariants.button.danger.border });
    expect(screen.getByText('Discard workout')).toHaveStyle({ color: componentVariants.button.danger.foreground });
  });

  test('error recovery invokes the supplied retry action', async () => {
    const retry = jest.fn();
    await render(<Feedback kind="error" title="Save failed" detail="Your draft is still here." onRetry={retry} />);
    expect(screen.getByText('Your draft is still here.')).toBeOnTheScreen();
    await userEvent.press(screen.getByRole('button', { name: 'Try again' }));
    expect(retry).toHaveBeenCalledTimes(1);
  });

  test('sections expose headings and numeric text uses the shared type scale', async () => {
    await render(<Section title="This week"><Type numeric variant="display">120</Type></Section>);
    expect(screen.getByRole('header', { name: 'This week' })).toBeOnTheScreen();
    expect(screen.getByText('120')).toHaveStyle({ fontSize: typography.size.display, lineHeight: typography.lineHeight.display, fontVariant: ['tabular-nums'] });
  });
});
