export function formatContactPhoneInput(value: string, allowEmpty = false) {
  const input = value.trim();
  if (!input && allowEmpty) return '';

  const international = input.startsWith('+') || input.startsWith('00');
  const digits = input.replace(/\D/g, '');
  const number = input.startsWith('00') ? digits.slice(2) : digits;

  if (international) {
    if (number.length < 2) return `+${number}`;
    return `+${number.slice(0, 2)} ${number.slice(2)}`;
  }
  return `+34 ${number}`;
}
