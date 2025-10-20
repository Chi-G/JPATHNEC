<?php

namespace App\Filament\Resources\Products\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class ProductForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('slug')
                    ->required()
                    ->default(fn ($record) => $record?->slug ?? null),
                Textarea::make('description')
                    ->required()
                    ->columnSpanFull(),
                Textarea::make('short_description')
                    ->columnSpanFull(),
                TextInput::make('sku')
                    ->label('SKU')
                    ->required(),
                TextInput::make('price')
                    ->required()
                    ->numeric()
                    ->prefix('₦'),
                TextInput::make('compare_price')
                    ->numeric(),
                TextInput::make('cost_price')
                    ->numeric(),
                TextInput::make('stock_quantity')
                    ->required()
                    ->numeric()
                    ->default(0),
                Toggle::make('track_stock')
                    ->required(),
                Toggle::make('is_active')
                    ->required(),
                Toggle::make('is_featured')
                    ->required(),
                Toggle::make('is_new')
                    ->label('New Arrival')
                    ->required(),
                Toggle::make('is_bestseller')
                    ->label('Best Seller')
                    ->required(),
                Toggle::make('is_trending')
                    ->label('Trending')
                    ->required(),
                TextInput::make('brand'),
                TextInput::make('material'),
                TextInput::make('fit'),
                TextInput::make('origin'),
                TextInput::make('sizes'),
                TextInput::make('colors'),
                TextInput::make('features'),
                TextInput::make('care_instructions'),
                TextInput::make('size_chart'),
                TextInput::make('meta_title'),
                Textarea::make('meta_description')
                    ->columnSpanFull(),
                TextInput::make('tags'),
                Select::make('category_id')
                    ->relationship('category', 'name')
                    ->required(),
                TextInput::make('rating')
                    ->required()
                    ->numeric()
                    ->default(0.0),
                TextInput::make('review_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('sales_count')
                    ->required()
                    ->numeric()
                    ->default(0),
                TextInput::make('view_count')
                    ->required()
                    ->numeric()
                    ->default(0),
            ]);
    }
}
