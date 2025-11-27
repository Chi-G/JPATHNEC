<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Notifications\WhatsApp\OrderStatusUpdateWhatsApp;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Actions\Action;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Get;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\EditRecord;

class EditOrder extends EditRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array 
    {
        return [
            ViewAction::make(),
            
            Action::make('updateStatus')
                ->label('Update Status')
                ->icon('heroicon-o-arrow-path')
                ->color('warning')
                ->form([
                    Select::make('status')
                        ->label('Order Status')
                        ->options([
                            'pending' => 'Pending',
                            'processing' => 'Processing',
                            'shipped' => 'Shipped',
                            'delivered' => 'Delivered',
                            'cancelled' => 'Cancelled',
                        ])
                        ->required()
                        ->default(fn ($record) => $record->status)
                        ->live(),
                    
                    TextInput::make('tracking_number')
                        ->label('Tracking Number')
                        ->visible(fn (Get $get) => in_array($get('status'), ['shipped', 'delivered']))
                        ->placeholder('Enter tracking number'),
                    
                    TextInput::make('current_location')
                        ->label('Current Location')
                        ->placeholder('e.g., Lagos Distribution Center'),
                    
                    Textarea::make('status_description')
                        ->label('Status Description')
                        ->placeholder('Optional custom message for customer')
                        ->rows(3),
                    
                    Toggle::make('send_whatsapp')
                        ->label('Send WhatsApp Notification')
                        ->default(true)
                        ->visible(fn ($record) => $record->user?->phone !== null)
                        ->helperText(fn ($record) => $record->user?->phone 
                            ? 'Customer will receive WhatsApp update at ' . $record->user->phone
                            : 'Customer has no phone number'),
                ])
                ->action(function ($record, array $data) {
                    // Update order status using the model's updateStatus method
                    $record->updateStatus($data['status'], [
                        'tracking_number' => $data['tracking_number'] ?? null,
                        'current_location' => $data['current_location'] ?? null,
                        'status_description' => $data['status_description'] ?? null,
                        'updated_by' => auth()->user()->name ?? 'admin',
                    ]);
                    
                    Notification::make()
                        ->title('Order status updated successfully')
                        ->body("Order #{$record->order_number} is now {$data['status']}")
                        ->success()
                        ->send();
                })
                ->requiresConfirmation()
                ->modalHeading('Update Order Status')
                ->modalDescription('This will update the order status and notify the customer via email and WhatsApp (if enabled).'),
            
            DeleteAction::make(),
        ];
    }
}
