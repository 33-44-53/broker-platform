<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('auctions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('product_id')->constrained('products')->onDelete('cascade');
            $table->string('product_name');
            $table->string('product_image');
            $table->foreignId('artisan_id')->constrained('users')->onDelete('cascade');
            $table->string('artisan_name');
            $table->decimal('starting_bid', 10, 2);
            $table->decimal('current_bid', 10, 2);
            $table->decimal('min_increment', 10, 2);
            $table->text('description')->nullable();
            $table->integer('duration');
            $table->dateTime('scheduled_date')->nullable();
            $table->dateTime('end_time')->nullable();
            $table->enum('status', ['pending', 'approved', 'live', 'ended'])->default('pending');
            $table->foreignId('winner_id')->nullable()->constrained('users')->onDelete('set null');
            $table->string('winner_name')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('auctions');
    }
};
