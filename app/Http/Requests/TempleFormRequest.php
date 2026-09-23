<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class TempleFormRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        return auth()->check() && auth()->user()->role === 'admin';
    }

    /**
     * Get the validation rules that apply to the request.
     */
    public function rules(): array
    {
        return [
            'name' => 'required|string|max:255',
            'location' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'state' => 'nullable|string|max:255',
            'main_deity' => 'nullable|string|max:255',
            'established' => 'nullable|string|max:255',
            'significance' => 'nullable|string|max:255',
            'online_booking' => 'sometimes|boolean',
            'booking_url' => 'nullable|string|max:500',
            'image' => ['nullable', 'string', 'max:255', 'regex:#^(https?://|/)#i'],
            'image_file' => 'nullable|image|mimes:jpeg,png,jpg,gif,webp|max:5120',
            'rating' => 'required|numeric|min:0|max:5',
            'crowd_level' => 'required|in:Low,Moderate,High,Very High,Extreme',
            'has_vip_darshan' => 'required|boolean',
            'instant_price' => 'nullable|numeric|min:0',
            'hold_token' => 'nullable|numeric|min:0',
            'description' => 'nullable|string',
            'amenities' => 'nullable|array',
            'amenities.*' => 'string|max:255',
            'timings' => 'nullable|array',
            'timings.*.name' => 'nullable|string|max:255',
            'timings.*.time' => 'nullable|string|max:255',
            'timings.*.type' => 'nullable|string|max:255',
            'facilities' => 'nullable|array',
            'facilities.*' => 'string|max:255',
            'status' => 'required|in:active,inactive',
        ];
    }

    /**
     * Get custom messages for validator errors.
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Temple name is required.',
            'location.required' => 'Location is required.',
            'rating.required' => 'Rating is required.',
            'rating.numeric' => 'Rating must be a number.',
            'rating.min' => 'Rating must be at least 0.',
            'rating.max' => 'Rating cannot exceed 5.',
            'crowd_level.required' => 'Crowd level is required.',
            'crowd_level.in' => 'Invalid crowd level selected.',
            'has_vip_darshan.required' => 'VIP Darshan option is required.',
            'image.regex' => 'Image URL must start with http://, https:// or / (e.g. https://example.com/temple.jpg).',
            'image.max' => 'Image URL is too long (max 255 characters). Try uploading the image instead.',
            'image_file.image' => 'The uploaded file must be an image.',
            'image_file.max' => 'The image may not be larger than 5MB.',
        ];
    }

    /**
     * Trim the image URL before validation.
     */
    protected function prepareForValidation(): void
    {
        if (is_string($this->image)) {
            $this->merge(['image' => trim($this->image)]);
        }
    }
}
