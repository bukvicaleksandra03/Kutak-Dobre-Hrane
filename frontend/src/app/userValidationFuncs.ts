import { User } from "./models/user";

export function checkAllFields(user: User) {
  if (user.username == null || user.username == "") return "You must enter username";
  else if (user.password == null || user.password == "") return "You must enter a password";
  else if (user.firstname == null || user.firstname == "") return "You must enter a name";
  else if (user.lastname == null || user.lastname == "") return "You must enter a lastname";
  else if (user.email == null || user.email == "") return "You must enter an email";
  else if (user.phone == null || user.phone == "") return "You must enter a phone number";
  else if (user.address == null || user.address == "") return "You must enter an address";
  else if (user.safety_question == null || user.safety_question == "") return "You must enter a safety_question";
  else if (user.safety_answer == null || user.safety_answer == "") return "You must enter an answer to the safety_question";
  else if (user.gender == null || user.gender == "") return "You must choose a gender";

  if (user.type == "guest" && (user.credit_card == null || user.credit_card == "")) return "You must enter a credit card number";

  return "ok";
}

export function checkPassword(password: string) {
  let num_characters = /^\S{6,10}$/;
  let contains_uppercase = /[A-Z]/;
  let contains_three_lowercase = /.*[a-z].*[a-z].*[a-z]/;
  let contains_number = /[0-9]/;
  let contains_special_character = /[!@#$%^&*\.,]/;
  let begins_with_letter = /^[A-Za-z]/;

  if (!num_characters.test(password) || !contains_uppercase.test(password) ||
      !contains_three_lowercase.test(password) || !contains_number.test(password) ||
      !contains_special_character.test(password) || !begins_with_letter.test(password)) {
        return "Password must have between 6 i 10 characters, at least one capital letter, three small letters, a number, a special character and must begin with a letter.";
  }
  return "ok";
}

export function checkEmail(email: string) {
  let email_regex = /^[a-zA-Z0-9\._%+-]+@[a-zA-Z0-9\.-]+\.[a-zA-Z]{2,}$/;
  if (!email_regex.test(email)) {
    return "Email is not in good format.";
  }
  return "ok";
}

export function checkCreditCard(credit_card: string) {
  let credit_card_regex = /^\d{16}$/;
  if (!credit_card_regex.test(credit_card)) {
    return "Credit card number must have 16 characters";
  }
  return "ok";
}

export function checkPhone(phone: string) {
  let phone_regex = /^\+\d{7,14}$/;
  if (!phone_regex.test(phone)) {
    return "Enter phone number with area code. Example: +38163290175";
  }
  return "ok";
}
