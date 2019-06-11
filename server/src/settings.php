<?php
return [
    'settings' => [
        'displayErrorDetails' => true, // set to false in production
        'addContentLengthHeader' => false, // Allow the web server to send the content-length header
        'determineRouteBeforeAppMiddleware' => true,
        // Renderer settings
        'renderer' => [
            'template_path' => __DIR__ . '/../templates/',
        ],

        // Monolog settings
        'logger' => [
            'name' => 'slim-app',
            'path' => isset($_ENV['docker']) ? 'php://stdout' : __DIR__ . '/../logs/app.log',
            'level' => \Monolog\Logger::DEBUG,
        ],
         // for local Database connection settings
        "db" => [
            "host" => "127.0.0.1",
            "dbname" => "GSA",
            "user" => "root",
            "pass" => ""
        ],

        // for live
        // "db" => [
        //     "host" => "localhost",
        //     "dbname" => "techni_18032019",
        //     "user" => "admin2019",
        //     "pass" => "wst$0mEaV7}D"
        // ],
    ],
];
