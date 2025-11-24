<?php

namespace App\Http\Controllers;

use Inertia\Inertia;
use Illuminate\Http\Request;

class PrivacyController extends Controller
{
    public function privacy() {
      return Inertia::render('privacy/index');
    }

    public function terms() {
        return Inertia::render('terms/index');
    }
}
