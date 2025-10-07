<?php

namespace App\Filament\Resources\Addresses\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class AddressForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                Select::make('type')
                    ->options(['billing' => 'Billing', 'shipping' => 'Shipping'])
                    ->default('shipping')
                    ->required(),
                TextInput::make('full_name')
                    ->required(),
                TextInput::make('company'),
                TextInput::make('address_line_1')
                    ->required(),
                TextInput::make('address_line_2'),
                TextInput::make('city')
                    ->required(),
                TextInput::make('state')
                    ->required(),
                TextInput::make('postal_code')
                    ->required(),
                TextInput::make('country')
                    ->required(),
                TextInput::make('phone')
                    ->tel(),
                Toggle::make('is_default')
                    ->required(),
            ]);
    }
}
