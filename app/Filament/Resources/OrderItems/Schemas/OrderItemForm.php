<?php

namespace App\Filament\Resources\OrderItems\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class OrderItemForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('order_id')
                    ->required()
                    ->numeric(),
                TextInput::make('product_id')
                    ->required()
                    ->numeric(),
                TextInput::make('product_name')
                    ->required(),
                TextInput::make('product_sku')
                    ->required(),
                Textarea::make('product_description')
                    ->columnSpanFull(),
                FileUpload::make('product_image')
                    ->image(),
                TextInput::make('quantity')
                    ->required()
                    ->numeric(),
                TextInput::make('size'),
                TextInput::make('color'),
                TextInput::make('unit_price')
                    ->required()
                    ->numeric(),
                TextInput::make('total_price')
                    ->required()
                    ->numeric(),
            ]);
    }
}
