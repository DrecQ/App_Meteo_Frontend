<?php
require __DIR__.'/vendor/autoload.php';
use Illuminate\Support\Facades\Log;

try {
    $logs = Log::getMonolog()->getHandlers()[0]->getLog()->getRecords();
    $lastError = array_shift($logs);
    echo "Last error: " . $lastError['message'] . "\n";
} catch (Exception $e) {
    echo "Could not read logs: " . $e->getMessage() . "\n";
}
