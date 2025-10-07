<?php

namespace App\Filament\Resources\UserDevices\Pages;

use App\Filament\Resources\UserDevices\UserDeviceResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewUserDevice extends ViewRecord
{
    protected static string $resource = UserDeviceResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
