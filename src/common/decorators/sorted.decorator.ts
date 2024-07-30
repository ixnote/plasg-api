import { ValidationOptions, registerDecorator, ValidationArguments } from 'class-validator';

export function IsSortValue(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isSortValue',
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          return Number(value) === -1 || Number(value) === 1;
        },
        defaultMessage(args: ValidationArguments) {
          return `${args.property} must be either -1 or 1`;
        },
      },
    });
  };
}