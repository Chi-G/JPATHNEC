<?php

namespace App\Filament\Resources\Products\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\ToggleColumn as FilamentToggleColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class ProductsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('slug')
                    ->searchable(),
                TextColumn::make('sku')
                    ->label('SKU')
                    ->searchable(),
                TextColumn::make('price')
                    ->formatStateUsing(fn($state) => '₦' . number_format((float) $state, 2))
                    ->sortable(),
                TextColumn::make('compare_price')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('cost_price')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('stock_quantity')
                    ->numeric()
                    ->sortable(),
                FilamentToggleColumn::make('track_stock')
                    ->label('Track Stock')
                    ->sortable(),
                FilamentToggleColumn::make('is_active')
                    ->label('Active')
                    ->sortable(),
                FilamentToggleColumn::make('is_featured')
                    ->label('Featured')
                    ->sortable(),
                FilamentToggleColumn::make('is_new')
                    ->label('New Arrival')
                    ->sortable(),
                FilamentToggleColumn::make('is_bestseller')
                    ->label('Best Seller')
                    ->sortable(),
                FilamentToggleColumn::make('is_trending')
                    ->label('Trending')
                    ->sortable(),
                TextColumn::make('brand')
                    ->searchable(),
                TextColumn::make('material')
                    ->searchable(),
                TextColumn::make('fit')
                    ->searchable(),
                TextColumn::make('origin')
                    ->searchable(),
                TextColumn::make('meta_title')
                    ->searchable(),
                TextColumn::make('category.name')
                    ->searchable(),
                TextColumn::make('rating')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('review_count')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('sales_count')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('view_count')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                \Filament\Tables\Filters\TernaryFilter::make('is_new')
                    ->label('New Arrivals')
                    ->trueLabel('Yes')
                    ->falseLabel('No'),
                \Filament\Tables\Filters\TernaryFilter::make('is_bestseller')
                    ->label('Best Seller')
                    ->trueLabel('Yes')
                    ->falseLabel('No'),
                \Filament\Tables\Filters\TernaryFilter::make('is_trending')
                    ->label('Trending')
                    ->trueLabel('Yes')
                    ->falseLabel('No'),
                \Filament\Tables\Filters\TernaryFilter::make('is_featured')
                    ->label('Featured')
                    ->trueLabel('Yes')
                    ->falseLabel('No'),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
