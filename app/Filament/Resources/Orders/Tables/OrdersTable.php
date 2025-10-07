<?php

namespace App\Filament\Resources\Orders\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Actions\Action;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\DateTimePicker;
use Filament\Notifications\Notification;

class OrdersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('order_number')
                    ->searchable(),
                TextColumn::make('user.name')
                    ->searchable(),
                TextColumn::make('session_id')
                    ->searchable(),
                TextColumn::make('status')
                    ->badge(),
                TextColumn::make('subtotal')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('tax_amount')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('shipping_amount')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('discount_amount')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('total_amount')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('currency')
                    ->searchable(),
                TextColumn::make('email')
                    ->label('Email address')
                    ->searchable(),
                TextColumn::make('phone')
                    ->searchable(),
                TextColumn::make('payment_status')
                    ->badge(),
                TextColumn::make('payment_method')
                    ->searchable(),
                TextColumn::make('payment_reference')
                    ->searchable(),
                TextColumn::make('shipping_method')
                    ->searchable(),
                TextColumn::make('tracking_number')
                    ->searchable(),
                TextColumn::make('current_location')
                    ->searchable(),
                TextColumn::make('shipped_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('delivered_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('status_updated_at')
                    ->dateTime()
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
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),

                // Quick Status Update Actions
                Action::make('markProcessing')
                    ->label('Mark Processing')
                    ->icon('heroicon-o-cog-6-tooth')
                    ->color('info')
                    ->visible(fn ($record) => $record->status === 'pending')
                    ->requiresConfirmation()
                    ->action(function ($record) {
                        $record->updateStatus('processing', [
                            'status_description' => 'Order is now being processed'
                        ]);

                        Notification::make()
                            ->title('Order status updated')
                            ->body("Order #{$record->order_number} is now being processed")
                            ->success()
                            ->send();
                    }),

                Action::make('markShipped')
                    ->label('Mark Shipped')
                    ->icon('heroicon-o-truck')
                    ->color('warning')
                    ->visible(fn ($record) => in_array($record->status, ['pending', 'processing']))
                    ->form([
                        TextInput::make('tracking_number')
                            ->label('Tracking Number')
                            ->required()
                            ->placeholder('Enter tracking number'),
                        TextInput::make('current_location')
                            ->label('Current Location')
                            ->placeholder('e.g., Lagos Warehouse'),
                        Textarea::make('status_description')
                            ->label('Status Description')
                            ->placeholder('Additional information about shipment')
                            ->rows(2),
                    ])
                    ->action(function ($record, array $data) {
                        $record->updateStatus('shipped', [
                            'tracking_number' => $data['tracking_number'],
                            'current_location' => $data['current_location'] ?? null,
                            'status_description' => $data['status_description'] ?? 'Order has been shipped',
                            'shipped_at' => now(),
                        ]);

                        Notification::make()
                            ->title('Order shipped')
                            ->body("Order #{$record->order_number} has been marked as shipped")
                            ->success()
                            ->send();
                    }),

                Action::make('markDelivered')
                    ->label('Mark Delivered')
                    ->icon('heroicon-o-check-circle')
                    ->color('success')
                    ->visible(fn ($record) => $record->status === 'shipped')
                    ->form([
                        DateTimePicker::make('delivered_at')
                            ->label('Delivery Date & Time')
                            ->default(now())
                            ->required(),
                        TextInput::make('current_location')
                            ->label('Delivery Location')
                            ->placeholder('Customer address/location'),
                        Textarea::make('status_description')
                            ->label('Delivery Notes')
                            ->placeholder('Any delivery notes or recipient details')
                            ->rows(2),
                    ])
                    ->action(function ($record, array $data) {
                        $record->updateStatus('delivered', [
                            'delivered_at' => $data['delivered_at'],
                            'current_location' => $data['current_location'] ?? 'Delivered to customer',
                            'status_description' => $data['status_description'] ?? 'Order successfully delivered',
                        ]);

                        Notification::make()
                            ->title('Order delivered')
                            ->body("Order #{$record->order_number} has been marked as delivered")
                            ->success()
                            ->send();
                    }),

                Action::make('cancelOrder')
                    ->label('Cancel Order')
                    ->icon('heroicon-o-x-circle')
                    ->color('danger')
                    ->visible(fn ($record) => !in_array($record->status, ['delivered', 'cancelled', 'refunded']))
                    ->form([
                        Textarea::make('status_description')
                            ->label('Cancellation Reason')
                            ->placeholder('Please provide reason for cancellation')
                            ->required()
                            ->rows(2),
                    ])
                    ->requiresConfirmation()
                    ->modalHeading('Cancel this order?')
                    ->modalDescription('This action cannot be undone.')
                    ->action(function ($record, array $data) {
                        $record->updateStatus('cancelled', [
                            'status_description' => $data['status_description'],
                        ]);

                        Notification::make()
                            ->title('Order cancelled')
                            ->body("Order #{$record->order_number} has been cancelled")
                            ->warning()
                            ->send();
                    }),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
