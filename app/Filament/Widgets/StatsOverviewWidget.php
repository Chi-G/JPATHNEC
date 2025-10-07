<?php

namespace App\Filament\Widgets;

use App\Models\User;
use App\Models\Order;
use App\Models\Product;
use App\Models\Category;
use Filament\Widgets\StatsOverviewWidget as BaseStatsOverviewWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class StatsOverviewWidget extends BaseStatsOverviewWidget
{
    protected static ?int $sort = 1;

    protected function getStats(): array
    {
        return [
            Stat::make('Total Users', User::count())
                ->description('Registered customers')
                ->descriptionIcon('heroicon-m-users')
                ->color('success')
                ->chart([7, 2, 10, 3, 15, 4, 17]),

            Stat::make('Total Orders', Order::count())
                ->description('All time orders')
                ->descriptionIcon('heroicon-m-shopping-bag')
                ->color('info')
                ->chart([15, 4, 10, 2, 12, 4, 12]),

            Stat::make('Total Revenue', '₦' . number_format(Order::where('payment_status', 'paid')->sum('total_amount'), 2))
                ->description('Total paid orders')
                ->descriptionIcon('heroicon-m-banknotes')
                ->color('warning')
                ->chart([7, 3, 4, 5, 6, 3, 5, 3]),

            Stat::make('Active Products', Product::where('is_active', true)->count())
                ->description('Products available for sale')
                ->descriptionIcon('heroicon-m-cube')
                ->color('primary')
                ->chart([17, 16, 14, 15, 14, 13, 12]),

            Stat::make('Categories', Category::where('is_active', true)->count())
                ->description('Product categories')
                ->descriptionIcon('heroicon-m-tag')
                ->color('secondary'),

            Stat::make('Pending Orders', Order::where('status', 'pending')->count())
                ->description('Orders awaiting processing')
                ->descriptionIcon('heroicon-m-clock')
                ->color('danger')
                ->chart([2, 3, 3, 4, 6, 7, 8]),
        ];
    }
}
