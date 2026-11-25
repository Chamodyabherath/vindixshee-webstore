<?php

namespace App\Services;

use App\Models\Review;

class ReviewService
{
    public function create(array $data, ?int $userId = null): Review
    {
        $data['user_id'] = $userId;
        $data['status'] = $userId ? 'approved' : 'pending';
        $data['approved_at'] = $userId ? now() : null;

        return Review::create($data);
    }
}
