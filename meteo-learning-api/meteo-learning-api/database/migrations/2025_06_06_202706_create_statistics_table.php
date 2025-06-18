<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('statistics', function (Blueprint $table) {
            $table->id();
            $table->string('type');
            $table->integer('value');
            $table->date('date');
            $table->timestamps();

            $table->unique(['type', 'date']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('statistics');
    }
};
