<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class ProductInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('name'),
                TextEntry::make('slug'),
                TextEntry::make('description')
                    ->columnSpanFull(),
                TextEntry::make('short_description')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('sku')
                    ->label('SKU'),
                TextEntry::make('price')
                    ->money(),
                TextEntry::make('compare_price')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('cost_price')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('stock_quantity')
                    ->numeric(),
                IconEntry::make('track_stock')
                    ->boolean(),
                IconEntry::make('is_active')
                    ->boolean(),
                IconEntry::make('is_featured')
                    ->boolean(),
                IconEntry::make('is_new')
                    ->boolean(),
                IconEntry::make('is_bestseller')
                    ->boolean(),
                IconEntry::make('is_trending')
                    ->boolean(),
                TextEntry::make('brand')
                    ->placeholder('-'),
                TextEntry::make('material')
                    ->placeholder('-'),
                TextEntry::make('fit')
                    ->placeholder('-'),
                TextEntry::make('origin')
                    ->placeholder('-'),
                TextEntry::make('meta_title')
                    ->placeholder('-'),
                TextEntry::make('meta_description')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('category.name')
                    ->label('Category'),
                TextEntry::make('rating')
                    ->numeric(),
                TextEntry::make('review_count')
                    ->numeric(),
                TextEntry::make('sales_count')
                    ->numeric(),
                TextEntry::make('view_count')
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
