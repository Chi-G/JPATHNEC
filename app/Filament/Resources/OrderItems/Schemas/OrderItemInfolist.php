<?php

namespace App\Filament\Resources\OrderItems\Schemas;

use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class OrderItemInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('order_id')
                    ->numeric(),
                TextEntry::make('product_id')
                    ->numeric(),
                TextEntry::make('product_name'),
                TextEntry::make('product_sku'),
                TextEntry::make('product_description')
                    ->placeholder('-')
                    ->columnSpanFull(),
                ImageEntry::make('product_image')
                    ->placeholder('-'),
                TextEntry::make('quantity')
                    ->numeric(),
                TextEntry::make('size')
                    ->placeholder('-'),
                TextEntry::make('color')
                    ->placeholder('-'),
                TextEntry::make('unit_price')
                    ->numeric(),
                TextEntry::make('total_price')
                    ->numeric(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
