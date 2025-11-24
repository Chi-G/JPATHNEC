<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class NewsletterSubscribeRequest extends FormRequest
{
    public function authorize()
    {
        return true;
    }

    public function rules()
    {
        return [
            'email' => 'required|email|max:255',
        ];
    }

    public function messages()
    {
        return [
            'email.required' => 'Please provide your email address.',
            'email.email' => 'Please provide a valid email address.',
        ];
    }
}
