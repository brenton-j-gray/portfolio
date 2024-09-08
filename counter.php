<?php
// Path to the counter file
$file = "counter.txt";

// Check if the file exists, if not, create it
if (!file_exists($file)) {
    file_put_contents($file, "0");
}

// Read the current count
$count = file_get_contents($file);

// Increment the count
$count++;

// Write the new count back to the file
file_put_contents($file, $count);

// Display the count on the webpage
echo "Visitor Count: " . $count;
?>
