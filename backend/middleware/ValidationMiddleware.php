<?php

declare(strict_types=1);

class ValidationMiddleware
{
    public static function validate(array $data, array $rules): array
    {
        $errors = [];

        foreach ($rules as $field => $ruleStr) {
            $fieldRules = explode('|', $ruleStr);
            $value      = $data[$field] ?? null;

            foreach ($fieldRules as $rule) {
                if ($rule === 'required') {
                    if ($value === null || $value === '' || $value === []) {
                        $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' is required.';
                        break;
                    }
                }

                if ($rule === 'email' && !empty($value)) {
                    if (!filter_var($value, FILTER_VALIDATE_EMAIL)) {
                        $errors[$field] = 'Invalid email address.';
                        break;
                    }
                }

                if (str_starts_with($rule, 'min:') && !empty($value)) {
                    $min = (int) substr($rule, 4);
                    if (is_string($value) && strlen($value) < $min) {
                        $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . " must be at least {$min} characters.";
                        break;
                    }
                    if (is_numeric($value) && (float) $value < $min) {
                        $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . " must be at least {$min}.";
                        break;
                    }
                }

                if (str_starts_with($rule, 'max:') && !empty($value)) {
                    $max = (int) substr($rule, 4);
                    if (is_string($value) && strlen($value) > $max) {
                        $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . " must not exceed {$max} characters.";
                        break;
                    }
                }

                if (str_starts_with($rule, 'in:') && !empty($value)) {
                    $allowed = explode(',', substr($rule, 3));
                    if (!in_array($value, $allowed, true)) {
                        $errors[$field] = 'Invalid value for ' . str_replace('_', ' ', $field) . '.';
                        break;
                    }
                }

                if ($rule === 'numeric' && !empty($value)) {
                    if (!is_numeric($value)) {
                        $errors[$field] = ucfirst(str_replace('_', ' ', $field)) . ' must be numeric.';
                        break;
                    }
                }
            }
        }

        return $errors;
    }
}
