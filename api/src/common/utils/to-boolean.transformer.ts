import { TransformFnParams } from 'class-transformer';

export const toBoolean = ({
  value,
}: Pick<TransformFnParams, 'value'>): boolean | undefined => {
  if (value === undefined || value === null || value === '') {
    return undefined;
  }
  if (typeof value === 'boolean') {
    return value;
  }
  if (typeof value === 'string') {
    if (value === 'true' || value === '1') return true;
    if (value === 'false' || value === '0') return false;
  }
  return undefined;
};
