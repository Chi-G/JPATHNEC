<?php

namespace App\Filament\Resources\UserDevices\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class UserDeviceInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.name')
                    ->label('User'),
                TextEntry::make('device_name'),
                TextEntry::make('browser')
                    ->placeholder('-'),
                TextEntry::make('platform')
                    ->placeholder('-'),
                TextEntry::make('ip_address'),
                TextEntry::make('user_agent')
                    ->placeholder('-'),
                IconEntry::make('is_current')
                    ->boolean(),
                TextEntry::make('last_used_at')
                    ->dateTime(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
