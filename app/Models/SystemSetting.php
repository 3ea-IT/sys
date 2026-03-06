<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SystemSetting extends Model
{
    protected $fillable = [
        'key',
        'value',
        'description',
        'type', // string, integer, decimal, boolean, json
    ];

    protected $casts = [
        'value' => 'json',
    ];

    /**
     * Get a setting by key, with optional default
     */
    public static function get($key, $default = null)
    {
        $setting = self::where('key', $key)->first();
        return $setting ? $setting->value : $default;
    }

    /**
     * Set a setting by key
     */
    public static function set($key, $value, $description = null, $type = 'string')
    {
        return self::updateOrCreate(
            ['key' => $key],
            [
                'value' => $value,
                'description' => $description,
                'type' => $type,
            ]
        );
    }

    /**
     * Get all settings as key-value pairs
     */
    public static function allSettings()
    {
        return self::pluck('value', 'key')->toArray();
    }
}
