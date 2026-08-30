<?php

use App\Http\Controllers\Api\V1\AdminController;
use App\Http\Controllers\Api\V1\AuthController;
use App\Http\Controllers\Api\V1\FavouriteController;
use App\Http\Controllers\Api\V1\PlaceController;
use App\Http\Controllers\Api\V1\PlannerController;
use App\Http\Controllers\Api\V1\ProfileController;
use App\Http\Controllers\Api\V1\ReviewController;
use App\Http\Controllers\Api\V1\TripPlanController;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
    Route::post('auth/register', [AuthController::class, 'register']);
    Route::post('auth/login', [AuthController::class, 'login']);

    Route::get('categories', [PlaceController::class, 'categories']);
    Route::get('places', [PlaceController::class, 'index']);
    Route::get('places/featured', [PlaceController::class, 'featured']);
    Route::get('places/{place:slug}', [PlaceController::class, 'show']);
    Route::get('places/{place}/reviews', [ReviewController::class, 'index']);
    Route::post('trip-plans/preview', [PlannerController::class, 'preview']);

    Route::middleware('auth:sanctum')->group(function () {
        Route::post('auth/logout', [AuthController::class, 'logout']);
        Route::get('auth/me', [AuthController::class, 'me']);

        Route::apiResource('trip-plans', TripPlanController::class);

        Route::get('favourites', [FavouriteController::class, 'index']);
        Route::post('favourites/{place}', [FavouriteController::class, 'store']);
        Route::delete('favourites/{place}', [FavouriteController::class, 'destroy']);

        Route::post('places/{place}/reviews', [ReviewController::class, 'store']);
        Route::put('reviews/{review}', [ReviewController::class, 'update']);
        Route::delete('reviews/{review}', [ReviewController::class, 'destroy']);

        Route::get('profile', [ProfileController::class, 'show']);
        Route::put('profile', [ProfileController::class, 'update']);
        Route::put('profile/password', [ProfileController::class, 'password']);

Route::middleware('admin')->prefix('admin')->group(function () {
            Route::get('overview', [AdminController::class, 'overview']);
            Route::get('places', [AdminController::class, 'places']);
            Route::post('places', [AdminController::class, 'storePlace']);
            Route::get('places/{place}', [AdminController::class, 'place']);
            Route::put('places/{place}', [AdminController::class, 'updatePlace']);
            Route::delete('places/{place}', [AdminController::class, 'destroyPlace']);

            Route::get('categories', [AdminController::class, 'categories']);
            Route::post('categories', [AdminController::class, 'storeCategory']);
            Route::get('categories/{category}', [AdminController::class, 'category']);
            Route::put('categories/{category}', [AdminController::class, 'updateCategory']);
            Route::delete('categories/{category}', [AdminController::class, 'destroyCategory']);

            Route::get('reviews', [AdminController::class, 'reviews']);
            Route::put('reviews/{review}', [AdminController::class, 'updateReview']);
            Route::delete('reviews/{review}', [AdminController::class, 'destroyReview']);

            Route::get('settings', [AdminController::class, 'settings']);
            Route::put('settings', [AdminController::class, 'updateSettings']);

            Route::post('uploads', [AdminController::class, 'upload']);

            Route::get('users', [AdminController::class, 'users']);
            Route::get('users/{user}', [AdminController::class, 'user']);
            Route::put('users/{user}', [AdminController::class, 'updateUser']);
        });
    });
});
