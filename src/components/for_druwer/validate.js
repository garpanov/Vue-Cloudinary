export function validate_full_name(value) {
  if (!value) {
    return "Будь ласка, заповніть поле";
  }
  if (!/^[А-Яа-яІіЇїЄє\s-'’]+$/.test(value)) {
    return "Дозволено букви, пробіли та дефіси";
  }
  if (value.length < 2 || value.length > 100) {
    return "Довжина від 2 до 100 символів";
  }
  return null; // Нет ошибок
}

export function validate_city_adress(value) {
  if (!value) {
    return "Будь ласка, заповніть поле";
  }
  if (value.length < 5 || value.length > 150) {
    return "Довжина має бути від 5 до 150 символів";
  }
  return null; // Немає помилок
}

export function validate_index(value) {
  if (!value) {
    return "Будь ласка, заповніть поле";
  }
  if (!/^\d+$/.test(value)) {
    return "Дозволено тільки цифри";
  }
  return null; // Немає помилок
}


export function validate_number_phone(number) {
  if (!number) return "Будь ласка, заповніть поле";
  if (!/^\+?[0-9]{10,15}$/.test(number)) {
    return "Введіть дійсний номер телефону";
  }
  return null; // Нет ошибок
}

export function full_validate(surname, name, middle_name, number_phone, city, adress, index) {
  const erorrs_list = {
    surname_error: validate_full_name(surname),
    name_error: validate_full_name(name),
    middle_name_error: validate_full_name(middle_name),
    number_phone_error: validate_number_phone(number_phone),
    city_errors: validate_city_adress(city),
    adres_errors: validate_city_adress(adress),
    index_errors: validate_index(index)
  }


  return erorrs_list
}
