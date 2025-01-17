import { Checkbox, CheckboxProps, FormControlLabel } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { useFormField } from 'relay-forms';
import uniqueId from '../../../../util/uniqueId';
import { composeValidators, ValidatedInput } from '../validators';

interface AdditionalProps {
  label: string;
  labelPlacement?: 'bottom' | 'end' | 'start' | 'top';
}

export type ValidatedCheckboxProps = ValidatedInput<
  Omit<CheckboxProps, 'value'> & AdditionalProps,
  boolean
>;

export const ValidatedCheckbox: React.FC<ValidatedCheckboxProps> = ({
  name,
  defaultChecked,
  validate,
  label,
  labelPlacement,
  errorMessage,
  disabled,
  ...rest
}) => {
  const key = useMemo(() => name || uniqueId('v_txt-'), [name]);

  const validateCallback = useCallback(
    (v: boolean) => composeValidators(validate, errorMessage)(v),
    [validate, errorMessage]
  );

  const [{ value }, setValue] = useFormField({
    key,
    initialValue: defaultChecked || false,
    validate: validateCallback,
  });

  const setValueCallback = useCallback(
    (event: any) => {
      const value = event.target.checked;
      setValue(value);
    },
    [setValue]
  );

  React.useEffect(() => {
    if (disabled) {
      setValue(defaultChecked || false);
    }
  }, [disabled]);

  return (
    <FormControlLabel
      control={
        <Checkbox
          {...rest}
          value={value}
          onChange={setValueCallback}
          disabled={disabled}
        />
      }
      labelPlacement={labelPlacement || 'end'}
      label={label}
    />
  );
};
