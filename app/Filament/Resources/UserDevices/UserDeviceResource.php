<?php

namespace App\Filament\Resources\UserDevices;

use App\Filament\Resources\UserDevices\Pages\CreateUserDevice;
use App\Filament\Resources\UserDevices\Pages\EditUserDevice;
use App\Filament\Resources\UserDevices\Pages\ListUserDevices;
use App\Filament\Resources\UserDevices\Pages\ViewUserDevice;
use App\Filament\Resources\UserDevices\Schemas\UserDeviceForm;
use App\Filament\Resources\UserDevices\Schemas\UserDeviceInfolist;
use App\Filament\Resources\UserDevices\Tables\UserDevicesTable;
use App\Models\UserDevice;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class UserDeviceResource extends Resource
{
    protected static ?string $model = UserDevice::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedDevicePhoneMobile;

    protected static ?string $recordTitleAttribute = 'device_name';

    protected static string|\UnitEnum|null $navigationGroup = 'User Management';

    protected static ?int $navigationSort = 2;

    protected static ?string $navigationLabel = 'User Devices';

    protected static ?string $modelLabel = 'User Device';

    protected static ?string $pluralModelLabel = 'User Devices';

    public static function form(Schema $schema): Schema
    {
        return UserDeviceForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return UserDeviceInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return UserDevicesTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListUserDevices::route('/'),
            'create' => CreateUserDevice::route('/create'),
            'view' => ViewUserDevice::route('/{record}'),
            'edit' => EditUserDevice::route('/{record}/edit'),
        ];
    }
}
