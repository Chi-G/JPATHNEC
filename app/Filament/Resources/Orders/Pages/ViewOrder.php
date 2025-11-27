<?php

namespace App\Filament\Resources\Orders\Pages;

use App\Filament\Resources\Orders\OrderResource;
use App\Notifications\WhatsApp\OrderStatusUpdateWhatsApp;
use Filament\Actions\EditAction;
use Filament\Actions\Action;
use Filament\Notifications\Notification;
use Filament\Resources\Pages\ViewRecord;

class ViewOrder extends ViewRecord
{
    protected static string $resource = OrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
            
            Action::make('sendWhatsAppNotification')
                ->label('Send WhatsApp Update')
                ->icon('heroicon-o-chat-bubble-left-right')
                ->color('success')
                ->requiresConfirmation()
                ->modalHeading('Send WhatsApp Notification')
                ->modalDescription(fn ($record) => $record->user?->phone 
                    ? "Send order update to customer at {$record->user->phone}?"
                    : 'Customer has no phone number registered.')
                ->visible(fn ($record) => $record->user?->phone !== null)
                ->action(function ($record) {
                    if ($record->user && $record->user->phone) {
                        try {
                            $record->user->notify(new OrderStatusUpdateWhatsApp($record));
                            
                            Notification::make()
                                ->title('WhatsApp notification sent')
                                ->body("Notification sent to {$record->user->phone}")
                                ->success()
                                ->send();
                        } catch (\Exception $e) {
                            Notification::make()
                                ->title('Failed to send WhatsApp')
                                ->body($e->getMessage())
                                ->danger()
                                ->send();
                        }
                    } else {
                        Notification::make()
                            ->title('Cannot send WhatsApp')
                            ->body('Customer has no phone number')
                            ->warning()
                            ->send();
                    }
                }),
        ];
    }
}
