import { ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments } from 'class-validator';


@ValidatorConstraint({ name: 'fromToConstraint', async: false })
export class FromToConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const start = args.object['start'];
    const end = value;
    if (start === undefined && end !== undefined) {
      return false; // If from is not set and to is set, return false (validation fails)
    }
    return true; // Otherwise, validation passes
  }

  defaultMessage(args: ValidationArguments) {
    return 'Cannot set "end" if "start" is not set.';
  }
}
