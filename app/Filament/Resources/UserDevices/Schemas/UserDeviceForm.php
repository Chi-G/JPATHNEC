<?php

namespace App\Filament\Resources\UserDevices\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class UserDeviceForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Select::make('user_id')
                    ->relationship('user', 'name')
                    ->required(),
                TextInput::make('device_name')
                    ->required(),
                TextInput::make('browser'),
                TextInput::make('platform'),
                TextInput::make('ip_address')
                    ->required(),
                TextInput::make('user_agent'),
                Toggle::make('is_current')
                    ->required(),
                DateTimePicker::make('last_used_at')
                    ->required(),
            ]);
    }
}
