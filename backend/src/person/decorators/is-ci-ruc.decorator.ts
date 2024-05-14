import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
} from 'class-validator';

export function IsCedulaOrRUC(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: 'isCedulaOrRUC',
      target: object.constructor,
      propertyName: propertyName,
      constraints: [],
      options: validationOptions,
      validator: {
        validate(value: any, args: ValidationArguments) {
          const cedulaRegex = /^\d{1,3}(\.\d{3})*$/;
          const rucRegex = /^\d{1,8}-\d$/;
          return (
            typeof value === 'string' &&
            (cedulaRegex.test(value) || rucRegex.test(value))
          );
        },
        defaultMessage(args: ValidationArguments) {
          return 'The value must be a valid Paraguayan Cédula or RUC';
        },
      },
    });
  };
}
