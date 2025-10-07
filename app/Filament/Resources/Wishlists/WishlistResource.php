<?php

namespace App\Filament\Resources\Wishlists;

use App\Filament\Resources\Wishlists\Pages\CreateWishlist;
use App\Filament\Resources\Wishlists\Pages\EditWishlist;
use App\Filament\Resources\Wishlists\Pages\ListWishlists;
use App\Filament\Resources\Wishlists\Pages\ViewWishlist;
use App\Filament\Resources\Wishlists\Schemas\WishlistForm;
use App\Filament\Resources\Wishlists\Schemas\WishlistInfolist;
use App\Filament\Resources\Wishlists\Tables\WishlistsTable;
use App\Models\Wishlist;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class WishlistResource extends Resource
{
    protected static ?string $model = Wishlist::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedHeart;

    protected static ?string $recordTitleAttribute = 'wishlist';

    protected static string|\UnitEnum|null $navigationGroup = 'Shopping Experience';

    protected static ?int $navigationSort = 2;

    public static function form(Schema $schema): Schema
    {
        return WishlistForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return WishlistInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return WishlistsTable::configure($table);
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
            'index' => ListWishlists::route('/'),
            'create' => CreateWishlist::route('/create'),
            'view' => ViewWishlist::route('/{record}'),
            'edit' => EditWishlist::route('/{record}/edit'),
        ];
    }
}
