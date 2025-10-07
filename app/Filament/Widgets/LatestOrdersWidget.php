<?php

namespace App\Filament\Widgets;

use App\Models\Order;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\BadgeColumn;
use Filament\Widgets\TableWidget;
use Illuminate\Database\Eloquent\Builder;

class LatestOrdersWidget extends TableWidget
{
    protected static ?string $heading = 'Latest Orders';
    
    protected int | string | array $columnSpan = 'full';

    public function table(Table $table): Table
    {
        return $table
            ->query(fn (): Builder => Order::query()->latest()->limit(10))
            ->columns([
                TextColumn::make('order_number')
                    ->label('Order #')
                    ->searchable()
                    ->sortable(),
                    
                TextColumn::make('user.name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable(),
                    
                TextColumn::make('total_amount')
                    ->label('Total')
                    ->money('NGN')
                    ->sortable(),
                    
                BadgeColumn::make('status')
                    ->label('Status')
                    ->colors([
                        'danger' => 'cancelled',
                        'warning' => 'pending',
                        'primary' => 'processing',
                        'success' => 'delivered',
                        'info' => 'shipped',
                    ]),
                    
                BadgeColumn::make('payment_status')
                    ->label('Payment')
                    ->colors([
                        'danger' => 'failed',
                        'warning' => 'pending',
                        'success' => 'paid',
                        'secondary' => 'refunded',
                    ]),
                    
                TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable(),
            ])
            ->defaultSort('created_at', 'desc');
    }
}
