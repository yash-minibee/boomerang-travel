<?php

declare(strict_types=1);

class CurrencyHelper
{
    private static ?float $audRate = null;

    /**
     * Get the current stored exchange rate for AUD.
     * Fallbacks to 1.0 and logs an error if the query fails or table is empty.
     */
    public static function getAUDExchangeRate(): float
    {
        if (self::$audRate !== null) {
            return self::$audRate;
        }

        try {
            $db = Database::getInstance();
            $stmt = $db->prepare('SELECT rate FROM currency_rates WHERE currency = ? LIMIT 1');
            $stmt->execute(['AUD']);
            $row = $stmt->fetch();
            if ($row) {
                self::$audRate = (float)$row['rate'];
                return self::$audRate;
            }
        } catch (Exception $e) {
            error_log('Failed to fetch currency rate from DB: ' . $e->getMessage());
        }

        error_log('No AUD currency rate found in database. Defaulting to 1.0.');
        self::$audRate = 1.0;
        return self::$audRate;
    }

    /**
     * Convert USD to AUD using the stored exchange rate.
     */
    public static function convertUSDToAUD(float $usdAmount): float
    {
        $rate = self::getAUDExchangeRate();
        return $usdAmount * $rate;
    }

    /**
     * Format a currency value with its appropriate symbol.
     */
    public static function formatCurrency(float $amount, string $currency = 'USD'): string
    {
        $rounded = round($amount);
        if ($currency === 'AUD') {
            return 'A$' . number_format($rounded);
        }
        return '$' . number_format($rounded);
    }
}
