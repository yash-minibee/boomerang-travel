<?php

declare(strict_types=1);

/**
 * Route registry.
 * Format: METHOD /path => [ControllerClass, method, paramNames[]]
 * Patterns:
 *   :id    => numeric segment
 *   :slug  => alphanumeric + hyphens
 *   :page  => alpha segment
 */
function getRoutes(): array
{
    return [
        // Auth
        ['POST',  '/auth/login',   'AuthController',    'login',          []],
        ['POST',  '/auth/logout',  'AuthController',    'logout',         []],
        ['GET',   '/auth/me',      'AuthController',    'me',             []],

        // Packages
        ['GET',    '/packages',                  'PackageController',     'index',          []],
        ['POST',   '/packages',                  'PackageController',     'store',          []],
        ['GET',    '/packages/id/:id',           'PackageController',     'showById',       ['id']],
        ['GET',    '/packages/:slug',            'PackageController',     'show',           ['slug']],
        ['PUT',    '/packages/:id',              'PackageController',     'update',         ['id']],
        ['DELETE', '/packages/:id',              'PackageController',     'destroy',        ['id']],
        ['PATCH',  '/packages/:id/featured',     'PackageController',     'toggleFeatured', ['id']],

        // Itinerary
        ['GET',    '/packages/:id/itinerary',    'ItineraryController',   'index',          ['id']],
        ['POST',   '/packages/:id/itinerary',    'ItineraryController',   'bulkStore',      ['id']],
        ['DELETE', '/itinerary/:id',             'ItineraryController',   'destroy',        ['id']],

        // Hotels
        ['GET',    '/packages/:id/hotels',       'HotelController',       'index',          ['id']],
        ['POST',   '/packages/:id/hotels',       'HotelController',       'bulkStore',      ['id']],
        ['DELETE', '/hotels/:id',                'HotelController',       'destroy',        ['id']],

        // Destinations
        ['GET',    '/destinations',              'DestinationController', 'index',          []],
        ['POST',   '/destinations',              'DestinationController', 'store',          []],
        ['GET',    '/destinations/:id',          'DestinationController', 'show',           ['id']],
        ['PUT',    '/destinations/:id',          'DestinationController', 'update',         ['id']],
        ['DELETE', '/destinations/:id',          'DestinationController', 'destroy',        ['id']],

        // Inquiries
        ['POST',   '/inquiries',                 'InquiryController',     'store',          []],
        ['GET',    '/inquiries',                 'InquiryController',     'index',          []],
        ['GET',    '/inquiries/:id',             'InquiryController',     'show',           ['id']],
        ['PATCH',  '/inquiries/:id/status',      'InquiryController',     'updateStatus',   ['id']],

        // Customers
        ['GET',    '/customers',                 'CustomerController',    'index',          []],
        ['GET',    '/customers/:id',             'CustomerController',    'show',           ['id']],

        // Testimonials
        ['GET',    '/testimonials',              'TestimonialController', 'index',          []],
        ['GET',    '/testimonials/all',          'TestimonialController', 'indexAll',       []],
        ['POST',   '/testimonials',              'TestimonialController', 'store',          []],
        ['PATCH',  '/testimonials/:id/status',   'TestimonialController', 'updateStatus',   ['id']],
        ['DELETE', '/testimonials/:id',          'TestimonialController', 'destroy',        ['id']],

        // Media
        ['GET',    '/media',                     'MediaController',       'index',          []],
        ['POST',   '/media/upload',              'MediaController',       'upload',         []],
        ['DELETE', '/media/:id',                 'MediaController',       'destroy',        ['id']],

        // CMS Content
        ['GET',    '/content/:page',             'ContentController',     'show',           ['page']],
        ['PUT',    '/content/:page',             'ContentController',     'update',         ['page']],

        // Settings
        ['GET',    '/settings',                  'SettingsController',    'index',          []],
        ['PUT',    '/settings',                  'SettingsController',    'update',         []],

        // Dashboard
        ['GET',    '/dashboard/stats',           'DashboardController',   'stats',          []],
        ['GET',    '/dashboard/revenue',         'DashboardController',   'revenue',        []],
    ];
}
