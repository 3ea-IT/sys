<?php

namespace App\Services;

use Exception;

/**
 * Thrown when a Swiggy Dineout token is missing, expired, or rejected.
 */
class SwiggyReauthRequiredException extends Exception
{
}