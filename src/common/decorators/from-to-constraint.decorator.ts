import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';


@ValidatorConstraint({ name: 'fromToConstraint', async: false })
export class FromToConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const from = args.object['from'];
    const to = value;
    if (from === undefined && to !== undefined) {
      return false; // If from is not set and to is set, return false (validation fails)
    }
    return true; // Otherwise, validation passes
  }

  defaultMessage(args: ValidationArguments) {
    return 'Cannot set "to" if "from" is not set.';
  }
}
