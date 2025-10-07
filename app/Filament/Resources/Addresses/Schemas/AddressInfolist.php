<?php

namespace App\Filament\Resources\Addresses\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class AddressInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user.name')
                    ->label('User'),
                TextEntry::make('type')
                    ->badge(),
                TextEntry::make('full_name'),
                TextEntry::make('company')
                    ->placeholder('-'),
                TextEntry::make('address_line_1'),
                TextEntry::make('address_line_2')
                    ->placeholder('-'),
                TextEntry::make('city'),
                TextEntry::make('state'),
                TextEntry::make('postal_code'),
                TextEntry::make('country'),
                TextEntry::make('phone')
                    ->placeholder('-'),
                IconEntry::make('is_default')
                    ->boolean(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
