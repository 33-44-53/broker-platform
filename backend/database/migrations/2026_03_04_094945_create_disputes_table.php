<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('disputes', function (Blueprint $table) {
            $table->id();
            $table->string('dispute_number')->unique();
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->string('buyer_name');
            $table->foreignId('artisan_id')->constrained('users')->onDelete('cascade');
            $table->string('artisan_name');
            $table->foreignId('order_id')->constrained('orders')->onDelete('cascade');
            $table->string('issue_type');
            $table->text('description');
            $table->enum('status', ['open', 'in-progress', 'resolved'])->default('open');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('disputes');
    }
};
